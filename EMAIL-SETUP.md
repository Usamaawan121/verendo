# Activate Verendo enquiry emails

The recipient is `8174245usama@gmail.com`. Receiving emails there does not by itself authorize this website to send them. An authenticated sending provider is required.

## Option A — existing Gmail account / SMTP

1. Sign into the Google account you want to send from.
2. Enable Google 2-Step Verification if it is not already enabled.
3. Create a Google App Password for this website at https://myaccount.google.com/apppasswords. This is separate from your normal account password. Some account types/security policies do not offer App Passwords; in that case use another authenticated SMTP provider or Option B.
4. In Vercel, open the project → Settings → Environment Variables. Add:

| Name | Value |
| --- | --- |
| `MAIL_PROVIDER` | `smtp` |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `465` |
| `SMTP_USER` | `8174245usama@gmail.com` (if this is the sending account) |
| `SMTP_PASS` | The sending account's App Password, without the displayed spaces |
| `MAIL_FROM` | `8174245usama@gmail.com` (the authenticated sending account) |
| `CONTACT_TO_EMAIL` | `8174245usama@gmail.com` |

Use port 587 for providers that require STARTTLS. Normal Google account passwords are not supported here. Keep secret values in Vercel or `.env.local`; do not paste them into chat or GitHub.

Gmail can reject automated logins or apply sending limits. For a commercial site, a dedicated transactional provider is preferable; the same handler supports provider SMTP or Option B without changing the form.

## Option B — Resend with a verified sending domain

Verify your sending domain in Resend, then set:

| Name | Value |
| --- | --- |
| `MAIL_PROVIDER` | `resend` |
| `RESEND_API_KEY` | Your email-sending API key |
| `MAIL_FROM` | An address on your verified domain, e.g. `Verendo <website@your-domain>` |
| `CONTACT_TO_EMAIL` | `8174245usama@gmail.com` |

The example sender is a placeholder; it is not a created mailbox/domain. Gmail can remain the receiving inbox. Never use a public `NEXT_PUBLIC_` prefix for a provider key/password.

## Spam protection — required for live forms

1. In Cloudflare Turnstile, create a **Managed** widget.
2. Add your actual Vercel/custom hostname, for example `verendo.vercel.app` if that is the current project domain. Add each other hostname where you will submit forms. You do not need to move your domain's DNS to use Turnstile.
3. Add these Vercel variables:
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY`: the widget's public site key.
   - `TURNSTILE_SECRET_KEY`: its private secret.
4. Redeploy after setting both the email and Turnstile variables. The public site key is incorporated at build time.

The server validates each token's hostname, action and validity. Tokens cannot be reused. Challenges refresh after submissions. The extra memory-based rate limiter is per server instance; Turnstile is the production anti-bot control. For stricter traffic limits, configure a shared gateway/rate-limiting service for your deployment.

## Local configuration and checks

```powershell
Copy-Item .env.example .env.local
code .env.local
npm run check:setup
npm run check:setup -- --verify-smtp
```

Fill in the actual values before running the checks. The SMTP verification command authenticates only; it does not send an email. Do not overwrite an existing configured `.env.local` unnecessarily.

Then rebuild/redeploy and submit one real enquiry. Confirm:

1. The confirmation is displayed only after provider acceptance.
2. The form clears on success.
3. Your mailbox receives the visitor's name, email, company, service, optional budget and message.
4. Reply goes to the visitor's address.
5. A failed request leaves the form filled and displays a retry message.

A successful response means the mail provider accepted the message, not a guarantee of inbox placement. Check Spam and provider logs if needed. The assistant had no sending credentials and did not perform this real mailbox delivery test.

## Official references

- https://nodemailer.com/guides/using-gmail
- https://vercel.com/kb/guide/sending-emails-from-an-application-on-vercel
- https://vercel.com/kb/guide/how-to-add-vercel-environment-variables
- https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/
- https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
