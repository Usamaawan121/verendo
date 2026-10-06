import nodemailer from "nodemailer";

export type OutgoingMessage = {
  subject: string;
  text: string;
  replyTo: string;
};
export class MailConfigurationError extends Error {}

function emailSettings() {
  const provider =
    process.env.MAIL_PROVIDER ||
    (process.env.RESEND_API_KEY ? "resend" : "smtp");
  const to = process.env.CONTACT_TO_EMAIL || "8174245usama@gmail.com";
  const from = process.env.MAIL_FROM || process.env.SMTP_USER || "";
  if (
    !from ||
    /[\r\n]/.test(from + to) ||
    !/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(to)
  ) {
    throw new MailConfigurationError(
      "Email sender or recipient is not configured.",
    );
  }
  if (provider === "resend") {
    if (!process.env.RESEND_API_KEY)
      throw new MailConfigurationError("Email provider is not configured.");
  } else if (provider === "smtp") {
    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS
    ) {
      throw new MailConfigurationError("SMTP is not configured.");
    }
    if (![465, 587].includes(Number(process.env.SMTP_PORT || 465))) {
      throw new MailConfigurationError(
        "Use authenticated TLS SMTP on port 465 or 587.",
      );
    }
  } else throw new MailConfigurationError("Unknown email provider.");
  return { provider, to, from };
}

export function checkMailConfiguration() {
  emailSettings();
}

/** Never accepts a recipient or sender supplied by the visitor. */
export async function deliverEmail(message: OutgoingMessage) {
  const { provider, to, from } = emailSettings();
  if (provider === "resend") {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: message.replyTo,
        subject: message.subject,
        text: message.text,
      }),
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) throw new Error("Email provider rejected the request.");
    const result = (await response.json()) as { id?: string };
    if (!result.id)
      throw new Error("Email provider did not confirm acceptance.");
    return;
  }
  const port = Number(process.env.SMTP_PORT || 465);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    requireTLS: port === 587,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 8000,
    disableFileAccess: true,
    disableUrlAccess: true,
  });
  try {
    const result = await transporter.sendMail({
      from,
      to,
      replyTo: message.replyTo,
      subject: message.subject,
      text: message.text,
    });
    if (
      !result.accepted?.some(
        (address) => String(address).toLowerCase() === to.toLowerCase(),
      )
    ) {
      throw new Error("Email provider did not accept the recipient.");
    }
  } finally {
    transporter.close();
  }
}
