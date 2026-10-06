import { createHash } from "node:crypto";
import { z } from "zod";
import { budgetOptions, serviceOptions } from "./form-options";
import {
  checkMailConfiguration,
  deliverEmail,
  MailConfigurationError,
  type OutgoingMessage,
} from "./email";

type Kind = "contact" | "newsletter";
const email = z
  .string()
  .trim()
  .email()
  .max(254)
  .refine((value) => !/[\r\n]/.test(value));
const common = {
  email,
  website: z.string().max(0).optional().default(""),
  token: z.string().max(2048).optional().default(""),
};
const contactSchema = z
  .object({
    ...common,
    name: z
      .string()
      .trim()
      .min(2)
      .max(100)
      .refine((value) => !/[\r\n]/.test(value)),
    company: z.string().trim().min(1).max(160),
    service: z.enum([
      "ai-for-business",
      "website-development",
      "digital-marketing",
      "not-sure",
    ]),
    budget: z
      .enum(["", ...budgetOptions])
      .optional()
      .default(""),
    message: z.string().trim().min(10).max(4000),
  })
  .strict();
const newsletterSchema = z.object(common).strict();

class RequestError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

function validateOrigin(request: Request) {
  const url = new URL(request.url);
  const host = request.headers.get("host") || url.host;
  // Next.js can normalize a loopback IP to localhost, or use the internal
  // server hostname in request.url. Host is the browser's actual destination.
  // Do not accept an arbitrary x-forwarded-host as an alternative origin.
  let destination: URL;
  try {
    destination = new URL(`${url.protocol}//${host}`);
  } catch {
    throw new RequestError(403, "Please submit the form from our website.");
  }
  if (
    !["http:", "https:"].includes(destination.protocol) ||
    destination.username ||
    destination.password ||
    destination.pathname !== "/" ||
    destination.search ||
    destination.hash ||
    request.headers.get("origin") !== destination.origin ||
    request.headers.get("sec-fetch-site") === "cross-site"
  ) {
    throw new RequestError(403, "Please submit the form from our website.");
  }
  return destination;
}

// A bounded per-instance burst limiter supplements Turnstile. Turnstile is
// required in production; this Map is not represented as a distributed limit.
const buckets = new Map<string, { count: number; until: number }>();
function limit(key: string) {
  const now = Date.now();
  for (const [id, bucket] of buckets)
    if (bucket.until < now) buckets.delete(id);
  const id = createHash("sha256").update(key).digest("hex");
  const bucket = buckets.get(id) || { count: 0, until: now + 10 * 60 * 1000 };
  if (bucket.count >= 8)
    throw new RequestError(
      429,
      "Too many attempts. Please wait a few minutes, or email us directly.",
    );
  if (buckets.size >= 10000 && !buckets.has(id))
    throw new RequestError(429, "Please try again shortly.");
  bucket.count++;
  buckets.set(id, bucket);
}

async function readBody(request: Request) {
  if (
    !request.headers
      .get("content-type")
      ?.toLowerCase()
      .startsWith("application/json")
  ) {
    throw new RequestError(415, "Please submit the form from our website.");
  }
  if (Number(request.headers.get("content-length") || 0) > 16384)
    throw new RequestError(413, "Your message is too long.");
  const reader = request.body?.getReader();
  if (!reader) throw new RequestError(400, "Please complete the form.");
  let size = 0;
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 16384) {
        await reader.cancel();
        throw new RequestError(413, "Your message is too long.");
      }
      chunks.push(value);
    }
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch (error) {
    if (error instanceof RequestError) throw error;
    throw new RequestError(400, "Please check the form and try again.");
  } finally {
    reader.releaseLock();
  }
}

async function verifyChallenge(token: string, hostname: string, action: Kind) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    if (process.env.NODE_ENV !== "production") return;
    throw new MailConfigurationError(
      "Production spam protection is not configured.",
    );
  }
  if (!token)
    throw new RequestError(
      400,
      "Please complete the security check and try again.",
    );
  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token }),
      signal: AbortSignal.timeout(8000),
    },
  );
  if (!response.ok)
    throw new RequestError(
      503,
      "The security check is temporarily unavailable. Please try again.",
    );
  const result = (await response.json()) as {
    success?: boolean;
    hostname?: string;
    action?: string;
    "error-codes"?: string[];
  };
  if (
    result["error-codes"]?.some((code) =>
      ["invalid-input-secret", "missing-input-secret"].includes(code),
    )
  ) {
    throw new MailConfigurationError(
      "Spam protection credentials were rejected.",
    );
  }
  if (
    !result.success ||
    result.hostname !== hostname ||
    result.action !== action
  ) {
    throw new RequestError(
      400,
      "Your security check expired or failed. Please try again.",
    );
  }
}

type Dependencies = {
  send?: (message: OutgoingMessage) => Promise<void>;
  configure?: () => void;
  verify?: typeof verifyChallenge;
  rateLimit?: (key: string) => void;
};

/** Dependency injection is used only by tests; routes always use real providers. */
export function createFormHandler(kind: Kind, dependencies: Dependencies = {}) {
  const send = dependencies.send || deliverEmail;
  return async (request: Request) => {
    const headers = {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    };
    try {
      const origin = validateOrigin(request);
      const ip = process.env.VERCEL
        ? request.headers.get("x-vercel-forwarded-for") || "unknown"
        : "local";
      (dependencies.rateLimit || limit)(`${kind}:${ip}`);
      const raw = await readBody(request);
      const parsed =
        kind === "contact"
          ? contactSchema.safeParse(raw)
          : newsletterSchema.safeParse(raw);
      if (!parsed.success)
        throw new RequestError(
          400,
          "Please check your details, email address and message, then try again.",
        );
      (dependencies.configure || checkMailConfiguration)();
      await (dependencies.verify || verifyChallenge)(
        parsed.data.token,
        origin.hostname,
        kind,
      );
      const data = parsed.data;
      const fields = kind === "contact" ? contactSchema.parse(data) : null;
      const text = fields
        ? [
            "New Verendo project enquiry",
            "",
            `Name: ${fields.name}`,
            `Email: ${fields.email}`,
            `Business: ${fields.company}`,
            `Service: ${serviceOptions[fields.service]}`,
            `Budget: ${fields.budget || "Not specified"}`,
            "",
            "Project details:",
            fields.message,
          ].join("\n")
        : `New Verendo newsletter subscription request\n\nEmail: ${data.email}\n\nThis is a subscription request. Add the address to your mailing list only under your consent and unsubscribe process.`;
      await send({
        subject:
          kind === "contact"
            ? "New project enquiry — Verendo"
            : "Newsletter subscription request — Verendo",
        replyTo: data.email,
        text,
      });
      return Response.json(
        {
          ok: true,
          message:
            kind === "contact"
              ? "Thank you. Your project details have been sent. We’ll get back to you by email."
              : "Thank you. Your subscription request has been sent.",
        },
        { headers },
      );
    } catch (error) {
      const status =
        error instanceof RequestError
          ? error.status
          : error instanceof MailConfigurationError
            ? 503
            : 502;
      if (!(error instanceof RequestError))
        console.error(
          `[Verendo ${kind}] ${error instanceof MailConfigurationError ? "Email or spam protection configuration required" : "Delivery failed"}`,
        );
      return Response.json(
        {
          ok: false,
          message:
            error instanceof RequestError
              ? error.message
              : "We couldn’t send your request right now. Your details are still here—please try again or email 8174245usama@gmail.com.",
        },
        {
          status,
          headers: {
            ...headers,
            ...(status === 429 ? { "Retry-After": "600" } : {}),
          },
        },
      );
    }
  };
}
