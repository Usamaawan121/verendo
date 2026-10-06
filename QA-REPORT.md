# Verendo 1.2.0 — verification record

Source: the supplied `verendo(1).zip`. This release updates that project; it is not a rebuild from a different template. The original uploaded archive was kept unchanged locally.

## Completed checks

| Check | Result |
| --- | --- |
| ESLint | Passed |
| Next.js production build and TypeScript | Passed — Next.js 16.3.6 |
| Automated server/client/component tests | 31 passed, 0 failed |
| Production HTTP route, content and API checks | 40 passed |
| Referenced media requests | 31 passed |
| Hero MP4 streaming | HTTP 206, requested 1,024-byte range returned |
| Budget in server-rendered contact form | Exactly `$5k`, `$10k`, `$15k`, `$20k+`; selection optional |
| Plans/Pricing routes | Both return 404; no page or navigation link added |
| Lockfile/install validation | `npm ci --dry-run --ignore-scripts --prefer-offline --no-audit` passed |
| Production dependency audit | `npm audit --omit=dev`: 0 reported vulnerabilities at check time |
| Asset preservation | All 115 original files under `public/` retained with identical SHA-256 hashes |
| Blog, project and service data | Retained; `content/site.ts` only changes form endpoint configuration |
| Social icons/URLs | Existing icons and dummy platform URLs retained as requested |

The test environment used Node 24.19.0 and npm 11.9.0 on Linux. The lockfile dry run is not a fresh Windows installation test.

The HTTP checks render all 21 supported pages, verify expected headings, check redirects and missing-page responses, and exercise both form routes with invalid or cross-origin input. They do not send an external email.

The automated form tests cover all budget choices, optional budget, fixed recipient, input/body validation, header injection, honeypot, origin/Host handling, challenge hostname/action, rate limiting, authenticated SMTP settings, provider acceptance/failure, and preservation/reset of entered form values. Provider responses are mocked. A production-server origin rejection found during testing was corrected and regression-tested.

Component checks simulate responsive media queries at widths 320, 360, 390, 412, 768, 820 and 1440px, plus short landscape. They confirm that the relevant animated structure and content remain present. JSDOM has no real layout or animation engine: these checks do not prove pixel-perfect rendering or smooth frame rates.

## Implemented mobile corrections

- Small screen width no longer disables the process, benefit and comparison sequences.
- All four benefit labels and both comparison cards have visible normal-flow fallbacks.
- Phone comparison cards appear sequentially within the pinned scene; short landscape flows normally so long content is not trapped inside a short viewport.
- Process imagery and copy fit a phone composition; all four steps remain available.
- Project stacking/scale/fade works at mobile widths, with sticky positioning adjusted for taller cards.
- Service imagery stays within its reserved area; text reveals are faster on phones, with touch feedback where hover is unavailable.
- Reduced-motion preferences remain respected. Existing hero media, brand colours and approved text are retained.

## Still requires live verification

**Browser/device visual QA was not run here.** The environment blocked browser access to the local preview. The included Playwright suite is prepared, not certified as passing. It provides Chromium, Firefox and WebKit profiles for desktop, narrow phones, iPhone-size screens, Android-size screens, tablets and landscape. Run it on your computer using the README commands, then inspect scrolling on real iOS/Android devices. It is not proof of compatibility with every device model. Browser/device settings can restrict autoplay.

**Real inbox delivery is not activated or verified.** Configure an authenticated email provider and Cloudflare Turnstile using `EMAIL-SETUP.md`, redeploy, and submit a real enquiry. The receiving address defaults to `8174245usama@gmail.com`. Missing configuration reports an error and preserves entered details. A success response requires provider acceptance; inbox placement still needs a mailbox check. Newsletter submissions send a subscription request to the owner, not an automatic mailing-list enrollment.

## Known upstream development dependency advisory

The full dependency audit reports five high-severity entries in the development lint chain: `eslint-config-next` → `@next/eslint-plugin-next` → `fast-glob` → `micromatch` → `braces`. They refer to the same upstream deeply nested pattern denial-of-service issue, [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm). No patched `braces` release was available at verification time. This chain is absent from the production-only audit. It was not hidden with a forced framework downgrade. Keep dependencies updated as an upstream fix becomes available.

The per-instance request limiter supplements Turnstile; it is not a distributed traffic quota. No penetration test, physical-device certification or guarantee against future vulnerabilities/crashes is implied by these checks.

## Archive

One ZIP contains one `verendo/` project folder. Build output, `node_modules`, Git history, real environment secrets and test-output directories are excluded. `.env.example`, source, original media, lockfile, tests and setup instructions are included. ZIP entries and checksums are verified when packaging.
