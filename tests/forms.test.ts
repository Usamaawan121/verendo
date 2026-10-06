import assert from "node:assert/strict";
import { test } from "node:test";
import { createFormHandler } from "../lib/form-handler";
import { deliverEmail, MailConfigurationError } from "../lib/email";
import { submitForm } from "../lib/submit-form";

const valid = {
  name: "Test Visitor",
  email: "visitor@example.com",
  company: "Test Business",
  service: "website-development",
  budget: "$10k",
  message: "We need a new website for our business.",
  website: "",
  token: "test-token",
};
const request = (body: unknown, headers: Record<string, string> = {}) =>
  new Request("https://verendo.example/api/contact", {
    method: "POST",
    headers: {
      origin: "https://verendo.example",
      "content-type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });
const noop = () => {};
const dependencies = {
  configure: noop,
  verify: async () => {},
  rateLimit: noop,
};

test("contact only reports success after delivery resolves; includes all four allowed budgets", async () => {
  for (const budget of ["$5k", "$10k", "$15k", "$20k+"]) {
    let message: { text: string; replyTo: string } | undefined;
    const response = await createFormHandler("contact", {
      ...dependencies,
      send: async (value) => {
        message = value;
      },
    })(request({ ...valid, budget }));
    assert.equal(response.status, 200);
    assert.equal(((await response.json()) as { ok: boolean }).ok, true);
    assert.ok(message?.text.includes(`Budget: ${budget}`));
    assert.ok(message?.text.includes("Website Development"));
    assert.equal(message?.replyTo, "visitor@example.com");
  }
});

test("optional budget is accepted and clearly marked", async () => {
  let body = "";
  const response = await createFormHandler("contact", {
    ...dependencies,
    send: async (value) => {
      body = value.text;
    },
  })(request({ ...valid, budget: "" }));
  assert.equal(response.status, 200);
  assert.match(body, /Not specified/);
});

for (const [label, patch] of Object.entries({
  "invalid email": { email: "not-email" },
  "email header injection": {
    email: "visitor@example.com\r\nBcc: attacker@example.com",
  },
  "name header injection": { name: "Bad\r\nName" },
  "invalid budget": { budget: "$1" },
  "invalid service": { service: "unknown" },
  "short message": { message: "Hi" },
  "oversized message": { message: "x".repeat(4001) },
  "empty name": { name: " " },
  "empty business": { company: " " },
  honeypot: { website: "https://spam.example" },
  "injected recipient": { to: "attacker@example.com" },
}))
  test(`rejects ${label} without sending email`, async () => {
    let sent = false;
    const response = await createFormHandler("contact", {
      ...dependencies,
      send: async () => {
        sent = true;
      },
    })(request({ ...valid, ...patch }));
    assert.equal(response.status, 400);
    assert.equal(sent, false);
    assert.equal(((await response.json()) as { ok: boolean }).ok, false);
  });

test("rejects cross-origin, missing-origin and non-JSON requests", async () => {
  const handler = createFormHandler("contact", {
    ...dependencies,
    send: async () => {
      throw Error("Must not send");
    },
  });
  assert.equal(
    (await handler(request(valid, { origin: "https://elsewhere.example" })))
      .status,
    403,
  );
  assert.equal((await handler(request(valid, { origin: "" }))).status, 403);
  assert.equal(
    (await handler(request(valid, { "content-type": "text/plain" }))).status,
    415,
  );
});

test("uses the actual destination Host when Next.js normalizes or proxies the URL", async () => {
  for (const [url, host, origin, hostname] of [
    ["http://localhost:3102/api/contact", "127.0.0.1:3102", "http://127.0.0.1:3102", "127.0.0.1"],
    ["https://internal.example/api/contact", "verendo.example", "https://verendo.example", "verendo.example"],
  ]) {
    let verifiedHost = "";
    const handler = createFormHandler("contact", {
      ...dependencies,
      verify: async (_token, value) => { verifiedHost = value; },
      send: async () => {},
    });
    const response = await handler(new Request(url, {
      method: "POST",
      headers: { host, origin, "content-type": "application/json" },
      body: JSON.stringify(valid),
    }));
    assert.equal(response.status, 200);
    assert.equal(verifiedHost, hostname);
  }
});

test("does not trust forwarded-host or allow cross-site/protocol origin mismatches", async () => {
  const handler = createFormHandler("contact", {
    ...dependencies,
    send: async () => { throw Error("Must not send"); },
  });
  const cases: Record<string, string>[] = [
    { origin: "https://attacker.example", "x-forwarded-host": "attacker.example" },
    { origin: "http://verendo.example" },
    { "sec-fetch-site": "cross-site" },
    { host: "attacker.example@verendo.example" },
    { host: "verendo.example/path" },
    { origin: "null" },
    { origin: "https://verendo.example:8443" },
  ];
  for (const headers of cases) {
    assert.equal((await handler(request(valid, { host: "verendo.example", ...headers }))).status, 403);
  }
});

test("rejects oversized streamed body even without content-length", async () => {
  const handler = createFormHandler("contact", dependencies);
  assert.equal(
    (await handler(request({ ...valid, message: "x".repeat(17000) }))).status,
    413,
  );
});

test("malformed JSON is a validation error, not a crash", async () => {
  const req = new Request("https://verendo.example/api/contact", {
    method: "POST",
    headers: {
      origin: "https://verendo.example",
      "content-type": "application/json",
    },
    body: "{broken",
  });
  assert.equal(
    (await createFormHandler("contact", dependencies)(req)).status,
    400,
  );
});

test("provider failure never reports a successful submission or exposes details", async () => {
  const handler = createFormHandler("contact", {
    ...dependencies,
    send: async () => {
      throw Error("password=private-value");
    },
  });
  const response = await handler(request(valid));
  assert.equal(response.status, 502);
  const body = (await response.json()) as { ok: boolean };
  assert.equal(body.ok, false);
  assert.ok(!JSON.stringify(body).includes("private-value"));
});

test("missing configuration returns a useful 503", async () => {
  const response = await createFormHandler("contact", {
    ...dependencies,
    configure: () => {
      throw new MailConfigurationError("not set");
    },
  })(request(valid));
  assert.equal(response.status, 503);
  assert.equal(((await response.json()) as { ok: boolean }).ok, false);
});

test("newsletter sends a subscription request to the owner", async () => {
  let body = "";
  const response = await createFormHandler("newsletter", {
    ...dependencies,
    send: async (message) => {
      body = message.text;
    },
  })(request({ email: valid.email, website: "", token: "token" }));
  assert.equal(response.status, 200);
  assert.match(body, /subscription request/);
  assert.match(body, /visitor@example.com/);
});

test("burst limit eventually returns 429 with Retry-After", async () => {
  const handler = createFormHandler("newsletter", {
    configure: noop,
    verify: async () => {},
    send: async () => {},
  });
  const statuses = [];
  for (let i = 0; i < 9; i++)
    statuses.push(await handler(request({ email: valid.email })));
  assert.equal(statuses[8].status, 429);
  assert.equal(statuses[8].headers.get("Retry-After"), "600");
});

test("Turnstile rejects wrong hostname, action and replayed/invalid tokens", async () => {
  const before = process.env.TURNSTILE_SECRET_KEY;
  process.env.TURNSTILE_SECRET_KEY = "test-secret";
  const realFetch = globalThis.fetch;
  try {
    for (const answer of [
      { success: false },
      { success: true, hostname: "attacker.example", action: "contact" },
      { success: true, hostname: "verendo.example", action: "newsletter" },
    ]) {
      globalThis.fetch = async () => Response.json(answer);
      const response = await createFormHandler("contact", {
        configure: noop,
        rateLimit: noop,
        send: async () => {
          throw Error("Must not send");
        },
      })(request(valid));
      assert.equal(response.status, 400);
    }
    let sent = false;
    globalThis.fetch = async () =>
      Response.json({
        success: true,
        hostname: "verendo.example",
        action: "contact",
      });
    assert.equal(
      (
        await createFormHandler("contact", {
          configure: noop,
          rateLimit: noop,
          send: async () => {
            sent = true;
          },
        })(request(valid))
      ).status,
      200,
    );
    assert.equal(sent, true);
  } finally {
    globalThis.fetch = realFetch;
    if (before === undefined) delete process.env.TURNSTILE_SECRET_KEY;
    else process.env.TURNSTILE_SECRET_KEY = before;
  }
});

test("Resend transport checks provider acceptance and uses a fixed recipient", async () => {
  const saved = { ...process.env };
  const realFetch = globalThis.fetch;
  process.env.MAIL_PROVIDER = "resend";
  process.env.RESEND_API_KEY = "unit-test-only";
  process.env.MAIL_FROM = "Verendo <hello@verendo.example>";
  process.env.CONTACT_TO_EMAIL = "8174245usama@gmail.com";
  try {
    let payload: Record<string, unknown> = {};
    globalThis.fetch = async (_url, options) => {
      payload = JSON.parse(String(options?.body));
      return Response.json({ id: "test-id" });
    };
    await deliverEmail({
      subject: "Test",
      text: "Example",
      replyTo: "visitor@example.com",
    });
    assert.deepEqual(payload.to, ["8174245usama@gmail.com"]);
    assert.equal(payload.reply_to, "visitor@example.com");
    globalThis.fetch = async () =>
      Response.json({ error: "failed" }, { status: 503 });
    await assert.rejects(
      deliverEmail({
        subject: "Test",
        text: "Example",
        replyTo: "visitor@example.com",
      }),
    );
    globalThis.fetch = async () => Response.json({});
    await assert.rejects(
      deliverEmail({
        subject: "Test",
        text: "Example",
        replyTo: "visitor@example.com",
      }),
    );
  } finally {
    globalThis.fetch = realFetch;
    for (const name of [
      "MAIL_PROVIDER",
      "RESEND_API_KEY",
      "MAIL_FROM",
      "CONTACT_TO_EMAIL",
    ]) {
      if (saved[name] === undefined) delete process.env[name];
      else process.env[name] = saved[name];
    }
  }
});

test("client submission requires explicit server success and retains error information", async () => {
  const realFetch = globalThis.fetch;
  try {
    globalThis.fetch = async () => Response.json({ ok: true, message: "Sent" });
    assert.equal(await submitForm("/api/contact", valid), "Sent");
    globalThis.fetch = async () =>
      Response.json({ ok: false, message: "Try again" }, { status: 502 });
    await assert.rejects(submitForm("/api/contact", valid), /Try again/);
    globalThis.fetch = async () => Response.json({});
    await assert.rejects(submitForm("/api/contact", valid));
    globalThis.fetch = async () => {
      throw Error("Offline");
    };
    await assert.rejects(submitForm("/api/contact", valid), /connection/);
  } finally {
    globalThis.fetch = realFetch;
  }
});

test('SMTP uses authenticated TLS and requires accepted delivery', async (t) => {
  const nodemailer = (await import('nodemailer')).default;
  const saved = { ...process.env };
  process.env.MAIL_PROVIDER = 'smtp'; process.env.SMTP_HOST = 'smtp.example.com';
  process.env.SMTP_USER = 'sender@example.com'; process.env.SMTP_PASS = 'test-only';
  process.env.MAIL_FROM = 'sender@example.com'; process.env.CONTACT_TO_EMAIL = '8174245usama@gmail.com';
  let options: Record<string,unknown> = {};
  let envelope: Record<string,unknown> = {};
  let accepted = true;
  let closed = 0;
  t.mock.method(nodemailer,'createTransport',(value:Record<string,unknown>)=>{
    options=value;
    return {sendMail:async(message:Record<string,unknown>)=>{envelope=message;return{accepted:accepted?['8174245usama@gmail.com']:[]};},close:()=>{closed++;}};
  });
  try {
    process.env.SMTP_PORT='465';
    await deliverEmail({subject:'Test enquiry',text:'Budget: $20k+',replyTo:'visitor@example.com'});
    assert.equal(options.secure,true);assert.equal(envelope.to,'8174245usama@gmail.com');assert.equal(envelope.replyTo,'visitor@example.com');
    process.env.SMTP_PORT='587';
    await deliverEmail({subject:'Test enquiry',text:'Message',replyTo:'visitor@example.com'});
    assert.equal(options.requireTLS,true);assert.equal(options.secure,false);
    accepted=false;
    await assert.rejects(deliverEmail({subject:'Test',text:'Message',replyTo:'visitor@example.com'}));
    assert.equal(closed,3);
    process.env.SMTP_PORT='25';
    await assert.rejects(deliverEmail({subject:'Test',text:'Message',replyTo:'visitor@example.com'}),MailConfigurationError);
  } finally {
    for(const key of ['MAIL_PROVIDER','SMTP_HOST','SMTP_PORT','SMTP_USER','SMTP_PASS','MAIL_FROM','CONTACT_TO_EMAIL']) {
      if(saved[key]===undefined) delete process.env[key]; else process.env[key]=saved[key];
    }
  }
});
