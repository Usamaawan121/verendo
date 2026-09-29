# Verendo — editable website

Your existing website, updated with Verendo branding. Built with Next.js 16, React 19, TypeScript, Motion, Lenis, Three.js, Tailwind CSS 4 and the original custom CSS.

## Run in VS Code

Stop the previous server with Ctrl+C. Extract this ZIP into a **new, empty folder**, then open its `verendo` folder (the folder containing `package.json`) in VS Code. Do not merge it into the older extracted project or copy its `.next` / `node_modules` folders. Node.js 22.13 or newer is required; this update was checked with Node.js 24.19.0.

```powershell
npm ci
npm run dev
```

Open `http://localhost:3000` after the terminal says Ready. The terminal should show `verendo@1.0.3` and `next dev --webpack --port 3000`. An occupied port is reported as an error, so the command cannot silently start a second copy on a different port. Stop your previous server before retrying. Press Ctrl+C to stop. If PowerShell blocks `npm.ps1`, use `npm.cmd` in place of `npm`.

## Production build

```powershell
npm run typecheck
npm run lint
npm run build
npm run check:routes
npm run start
```

Development now uses the standard Next.js CLI with Webpack as a compatibility measure. Build and start still use Next.js directly. The old preview-specific development wrapper is removed. No account, database, Docker, API key or environment file is needed for the included frontend.

`npm run check:routes` starts the built application on local port 3102, checks the expected heading and content of all 17 pages, four legacy redirects, four missing-page responses, and referenced media, then stops its own server. It fails if a valid page renders the 404 screen even with HTTP 200. Run `npm run build` first. If you intentionally edit a page heading, update `scripts/route-expectations.json` as well. To choose another test port in PowerShell, run `$env:VERENDO_CHECK_PORT = "3103"` first.

## Version 1.0.3 scroll and booking update

Only two website behaviors changed: the digital-friction cards now use a restrained 1.00–1.08 scroll scale and slight outward movement with viewport bounds, and every shared “Book 15-mins call” card opens `https://wa.me/19713994753` for +1 (971) 399-4753. Their existing text, appearance and fade timing remain. CSS files, intro behavior, the V scene, blogs, projects, images, pricing and other contact links are unchanged from 1.0.2.

## Version 1.0.2 pricing correction

The Yearly tab now applies the advertised 20% discount to each monthly rate, rounded to the nearest whole dollar to preserve the existing compact price format. The monthly equivalents are Starter $3,999, Growth $5,599 and Enterprise $6,399. Edit each plan's `monthly` value and the shared `yearlyDiscountPercent` in `content/site.ts`; the discounted prices and badge stay synchronized. The existing monthly prices, styles, animations and email-draft forms are unchanged.

## September 29 compatibility update

The supplied ZIP reproduced the correct Home/About content and internal navigation in the clean Linux test browser. The all-pages-404 problem shown in the Windows recording was **not reproduced**, so its exact cause has not been established. This update simplifies development startup, explicitly fixes the development port, adds intro completion tracking for the current document and a timeout fallback, and adds content-based route checks. It does not claim a confirmed fix for an unidentified Windows-specific error.

If the same problem remains in this new folder, expand the red Next.js issue badge and copy its full message, plus the terminal error. Do not reinstall random packages or replace the styling. These messages are needed to identify the actual failure.

## Vercel

Import the GitHub repository and use:

| Setting | Value |
| --- | --- |
| Framework | Next.js |
| Root Directory | Folder containing `package.json` |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory override | **Off — use the Next.js default** |

`npm ci` is an install command, never an output directory. Commit `package-lock.json` with the source. The included `.gitignore` excludes `node_modules`, `.next`, local environment files, Vercel state and TypeScript build caches.

## Approved changes

- Verendo replaces the previous company name in page content, blogs where mentioned, metadata, navigation, wordmarks and favicon.
- A black opening screen shows Verendo for 2.6 seconds on a fresh page load or refresh. Normal internal navigation does not replay it.
- The hero and footer use an editable, dimensional V with floating and rotating motion. WebGL devices use metallic materials and environmental reflections. Browsers without WebGL use the same animated geometry through an SVG renderer with simpler shading. A local poster remains available if rendering cannot initialize.
- Only the digital-friction section receives the supplied `#98FE00` green accents. Its existing scrolling, opacity and scaling behavior remain unchanged.
- About images are replaced, including the hero, two collaboration images, metrics banner, founder, six team portraits and six matching hover portraits.

The original `app/globals.css`, shared animation helpers, component primitives, and original media files are preserved byte for byte. Blog articles/images, projects, services and testimonials are preserved apart from company-name replacement. Yearly pricing is corrected as described above; monthly prices are unchanged. Legacy unused media remains in the source archive; the displayed brand and About slots use the new assets.

## Where to edit

| Content | File |
| --- | --- |
| Contact details, services, projects, team, blog and image references | `content/site.ts` |
| Home page | `components/verendo/home.tsx` |
| About, contact, articles, project and legal layouts | `components/verendo/pages.tsx` |
| Header and footer | `components/verendo/shared.tsx` |
| V geometry, materials, lighting and motion | `components/verendo/scene-engine.ts` |
| V loading and fallback images | `components/verendo/monogram.tsx` |
| Opening screen | `components/verendo/brand-intro.tsx` |
| New intro/V styling and scoped green colour | `app/verendo-brand.css` |
| Original styling and animations | `app/globals.css`, `components/verendo/animation.tsx` |
| Metadata and favicon | `app/layout.tsx`, `public/favicon.svg` |

All displayed media and fonts are local. New About photos are AI-generated illustrative people, not verified photographs of the named template team. Their generation prompts are included in `docs/verendo-image-prompts.json`. Existing names, claims, prices and contact placeholders were retained to respect the requested content scope.

## Forms and security

Contact and newsletter forms keep their existing email-draft behavior. They do not send a message or create a subscription automatically. Your email is configured in `content/site.ts`. The phone number and social links remain the existing placeholders.

To use a delivery service, configure your own HTTPS endpoint in `content/site.ts` and keep credentials, validation and rate limiting on the server. Never commit service secrets or `.env` files.

This update adds response headers for MIME sniffing, referrer handling, framing and unused camera/microphone/location permissions. Next.js branding headers are disabled. Unknown URL segments containing a literal percent sign no longer go through an unsafe second decode.

`docs/VERENDO-VALIDATION.md` records the actual checks and their limits. Passing checks and a dependency audit cannot guarantee that future browser changes, hosting changes or security vulnerabilities will never cause a problem.

## Source and licensing notes

This is editable application source, not the original Framer project's private source or a Framer remix file. `ASSET-SOURCES.json` and the older reference reports preserve attribution and the original media history; they are not live site content. The package does not grant a commercial template licence. No CMS, payment system, booking account or mailing-list backend has been added.
