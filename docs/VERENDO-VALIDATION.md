# Verendo 1.0.3 — validation, 2026-09-29

## Requested changes

- The digital-friction badges now scale from 1.00 to 1.08 instead of 3.8, with slight outward travel and viewport bounds. The existing green theme, ring, text, fade timing and reduced-motion presentation are preserved. Bounds account for the existing mobile parent scale.
- All three shared “Book 15-mins call” buttons (Home hero, Home FAQ and Contact) use `https://wa.me/19713994753`, matching the requested +1 (971) 399-4753 number. Other links and contact details are unchanged.

## Checks for version 1.0.3

Environment: Linux, Node.js 24.19.0, npm 11.9.0, Next.js 16.3.4, React 19.2.6 and Chrome.

| Check | Result |
| --- | --- |
| Fresh npm ci | Passed; existing non-blocking dependency warnings |
| ESLint and production build with TypeScript | Passed |
| Production pages, redirects and missing routes | 25 checks passed: 17 content pages, four legacy redirects and four expected 404 responses |
| Referenced media | 69 image/video paths passed |
| Desktop scroll | Sampled throughout the sticky section; badge scale capped at 1.08 and horizontal bounds remained inside the viewport |
| Mobile and tablet scroll layouts | 390px and 840px frames checked, with 375px and 825px content widths; initial layout remained separated and maximum-scale cards stayed within horizontal bounds |
| Booking links | Both Home buttons and the Contact button rendered the exact requested WhatsApp destination; phone digits matched |
| Browser console during responsive checks | No application errors or warnings observed |
| Content preservation | All non-booking content exports, including blog, project and pricing data, compared equal to 1.0.2 |

The actual section is shown in `docs/scroll-verification.jpg`. Browser security blocked the external WhatsApp app handoff, so an actual chat opening was not verified. The rendered destination and requested number were verified; no messages were sent.

Release edits are limited to `components/verendo/home.tsx`, `content/site.ts`, package version metadata and release documentation, plus the new verification screenshot. CSS files, shared animations, the V scene, intro, projects, blogs and existing media remain byte-identical to 1.0.2. No GitHub push or Vercel deployment was performed.

## Previous release verification

The following 1.0.2 record is retained as history. Its pricing behavior remains unchanged.

# Verendo 1.0.2 — validation and limits, 2026-09-29

## This update

Yearly pricing is now calculated from each monthly price using the same 20% value displayed in the tab. It retains the existing whole-dollar format, rounding to the nearest dollar. Monthly prices are unchanged.

| Plan | Monthly | Yearly monthly equivalent, rounded |
| --- | --- | --- |
| Starter | $4,999 | $3,999 |
| Growth | $6,999 | $5,599 |
| Enterprise | $7,999 | $6,399 |

Only pricing data/calculation, the shared discount label, package version and release documentation changed. Both CSS files, all animation settings, the V scene, intro, forms, project pages, blogs and media are unchanged from version 1.0.1. A browser screenshot is included in `docs/pricing-verification.jpg`.

## Checks repeated for version 1.0.2

Environment: Linux, Node.js 24.19.0, npm 11.9.0, Next.js 16.3.4, React 19.2.6, Chrome browser.

| Check | Result |
| --- | --- |
| Fresh npm ci | Passed; existing dependency deprecation warnings were non-blocking |
| ESLint | Passed |
| Production build including TypeScript | Passed |
| Pricing calculation | All three discounts equal 20% within whole-dollar rounding; original monthly rates retained |
| Production page content | All 17 content pages returned HTTP 200 with the correct H1 and main content, without the custom 404 screen |
| Legacy redirects and unknown routes | Four redirects and four expected 404 responses passed; 25 route/content checks total |
| Referenced media | All 69 discovered image/video paths returned HTTP 200 with media content types |
| Browser pricing tabs | Monthly and Yearly showed the expected amounts |
| Plan links | All yearly links retained the correct plan and billing=yearly query parameters |
| Responsive pricing | Desktop, 390px frame and 840px frame checked; frame content widths 375px and 825px had no horizontal page overflow |
| Browser console during pricing checks | No application errors or warnings observed |
| Source preservation | Archive comparison confirmed all files outside the seven listed release edits were byte-identical, with one new documentation screenshot |

A decimal-price draft was discarded because it widened the three-column pricing grid at tablet widths. The delivered build uses the original whole-dollar display and passed the responsive checks above. No CSS changes were needed.

`npm run check:routes` repeats the production page, redirect, missing-route and media checks. Run `npm run build` first. It does not run a browser or test form delivery.

## Earlier browser verification of version 1.0.1

The previous test pass independently installed and built the exact 1.0.1 ZIP and inspected its production output in Chrome. All 17 content pages rendered. Refresh displayed the 2.6-second intro; normal internal navigation did not replay it. The animated V SVG fallback, scoped green section, replacement About images and portrait hover, FAQ, pricing tabs, and mobile navigation were checked. No application console errors were found. Those unaffected features were not all retested interactively for this pricing-only update.

This supersedes the older report's statement that final browser testing was blocked: a working production preview was subsequently opened and those checks completed.

## Remaining limits

Contact and newsletter forms open an email draft. They do not automatically send messages or create subscriptions; no delivery backend was added. Existing contact/social placeholders remain.

The all-pages-404 problem in the earlier Windows recording was not reproduced on Linux. Its exact cause remains unconfirmed. Native Windows behavior and GPU metallic lighting were not independently verified; Chrome used the SVG rendering fallback. No claim of freedom from all future bugs or vulnerabilities is made.

No GitHub push or Vercel deployment was performed for this update.
