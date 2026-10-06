# Verendo 1.2.0

Editable Next.js website for Verendo. Black + #32CD32 branding, existing approved copy and media, three service pages, projects, blog, contact and legal pages. There is no Plans/Pricing page.

## Run on Windows / VS Code

Open the `verendo` folder containing `package.json` (there is just one project folder in this ZIP).

```powershell
npm ci
npm run dev
```

Open http://localhost:3000. Use Ctrl+C to stop. Supported Node versions: 22.13+ within Node 22, or Node 24. Use an actively maintained Node release in that range.

```powershell
npm run test
npm run lint
npm run build
npm run check:routes
```

## What changed

- Phone width no longer disables the benefit, process and comparison animations.
- The four-step process uses a responsive pinned scene with the same image transitions as desktop.
- Mobile comparison cards transition one at a time so their copy fits the screen.
- Very short landscape viewports use animated flowing content to avoid clipping. A visitor's Reduce Motion preference remains respected.
- All four benefit labels and both comparison cards are present; layout-mode changes explicitly restore visibility.
- Project cards retain the scroll scale/fade/stack effect on mobile. Oversized cards scroll fully before pinning their bottom edge.
- Service illustrations stay inside their own reserved area, separated from headings; touch devices also get gentle artwork motion and press feedback.
- Mobile text reveals start earlier and finish sooner; the selected Digital Studio video remains autoplaying, muted, inline and looping.
- Budget is an optional dropdown: `$5k`, `$10k`, `$15k`, `$20k+`.
- Contact and newsletter requests go through same-origin server routes. Successful enquiries clear the form and show confirmation; failures preserve entered details.
- Delivery validation, honeypot, bounded request size, same-origin checks, a per-instance burst limit and production Turnstile verification are included.
- Next.js was patched to 16.3.6, along with affected production dependencies. Unused Vinext/Vite/Cloudflare/D1 scaffolding was removed from this Vercel/Next.js project. See `QA-REPORT.md` for the remaining upstream development-tool advisory.

## Email delivery: setup is required

The source contains no private credentials. **Real inbox delivery is not active until the environment variables are set and the deployment is rebuilt.** Read `EMAIL-SETUP.md` before using the forms with clients.

Default receiving inbox: **8174245usama@gmail.com**. Choose SMTP or Resend. Configure a Cloudflare Turnstile widget for production spam protection. In production, incomplete setup returns an honest error rather than a false success.

A provider accepting an email is not proof that it reached the inbox. Confirm receipt in your real mailbox after deployment, including Spam. Newsletter submissions currently send a request to the owner; this is not an automatic mailing-list/campaign service.

## Vercel

Import the repository with these settings:

| Setting | Value |
| --- | --- |
| Framework | Next.js |
| Root directory | The folder containing `package.json` |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output directory | Override **OFF** (Next.js default) |

Add the variables from `EMAIL-SETUP.md` for the deployment environment, then redeploy. `npm ci` is an install command, never an output directory.

Commit `package-lock.json` and `.env.example`. Do not commit `node_modules`, `.next`, `.env.local`, secret values, `.vercel`, ZIPs or test output directories. The included `.gitignore` handles these.

## Browser QA

The executable browser regression suite covers Chromium, Firefox and WebKit with phone/tablet/desktop viewport profiles. These are emulations, not physical devices.

```powershell
npx playwright install chromium firefox webkit
npm run build
npm run test:e2e
```

The suite checks scene visibility/sequence progress, artwork bounds, viewport overflow, internal navigation, the budget options and successful/failed form UI. Its form requests are mocked: it sends no real emails. Review the HTML report and screenshots with `npx playwright show-report`.

**The browser suite was prepared but not executed in the assistant workspace because browser access to the local preview was blocked.** See `QA-REPORT.md` for completed checks and remaining live verification. Do not interpret a successful TypeScript/build test as visual testing on every phone.

## Editing

- `content/site.ts`: public contact details, navigation, project/blog data, social links.
- `content/services.ts`: the three services and process copy.
- `components/verendo/experience.tsx`: hero, benefit, process, comparison and service sections.
- `components/verendo/animation.tsx`, `motion-layout.ts`: shared reveals and responsive motion preferences.
- `app/verendo-responsive.css`: responsive fixes and form feedback.
- `components/verendo/pages.tsx`, `shared.tsx`: page UI and shared footer/contact forms.
- `lib/form-handler.ts`, `email.ts`: server validation and delivery.

All existing public media bytes and blog data were retained. Earlier reports in `docs/` describe previous releases and are historical, including old pricing screenshots. Current release checks are in `QA-REPORT.md`.

Social icons and dummy URLs are intentionally retained as requested. Replace those URLs in `content/site.ts` with your own account URLs when ready.
