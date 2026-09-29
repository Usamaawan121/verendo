# Personalization release — 27 September 2026

This ZIP edits the supplied Sanjaya source. It does not publish or replace a live site.

## Updated content

- Homepage business and service copy for web/software engineering, mobile apps, UI/UX design, marketing, and automation.
- Four portfolio projects: StreamScale (Netflix-inspired streaming system design), EventSphere (event web application), Tummly (restaurant SaaS/software design), and Verendo (digital-service website).
- The homepage project stack, projects index, all four case studies, related-project links, and the existing project references on About use the updated project information.
- Three testimonial portrait images only. The existing quotes, names, roles, logos, and carousel logic remain unchanged.
- Contact email: 8174245usama@gmail.com. The Sanjaya brand remains because no replacement brand name was supplied.
- Old project URLs redirect to their corresponding new case studies.

## Preserved exactly

The stylesheet files, animation component, shared navigation/forms/footer component, UI primitives, all original media bytes (including all three MP4s), blog data, blog renderers, article images, and article routes are unchanged. Every CSS class, inline style, and motion/reveal property in the two edited visual components was compared against the supplied ZIP. Scroll/transform hook calls are unchanged. Pricing amounts, decorative media references, team data, section structure, and interactions remain as supplied.

See `PRESERVATION-REPORT.json` for the passing checks. Visible line wrapping naturally follows the replacement wording at each screen width; no styling was adjusted to force a different layout.

## Editable files

- `content/site.ts`: email, services, portfolio copy/assets, testimonial image references, supporting FAQ/process/pricing descriptions.
- `components/sanjaya/home.tsx`: approved homepage wording.
- `components/sanjaya/pages.tsx`: project-page wording and existing About project references.
- `app/[...slug]/page.tsx`: old project URL redirects.
- `public/media/project-*` and `public/media/testimonial-portrait-*`: new project artwork, project wordmarks, and portrait files.

## Artwork and remaining template content

The new covers are representative generated product mockups, not screenshots of deployed products. The three new portraits depict fictional people and are placeholders. No client identity or testimonial was verified. Testimonial text was deliberately left unchanged as requested. Project descriptions present portfolio scope without invented revenue, usage, or performance results. This package is the portfolio website source; it does not include source code for the four featured products.

Team information, the Clarissa contact card, phone number, social destinations, prices, shared footer/CTA wording, and non-project About content remain template content. They were outside this limited edit. The contact and newsletter forms retain their original email-draft behavior unless an endpoint is configured.

## Local and Vercel setup

The uploaded ZIP predates the npm/Next.js setup already chosen for Vercel in this conversation. This release retains that setup: `npm run dev` uses `next dev`, `npm run build` uses `next build`, and `npm start` uses `next start`. `npm run install:ci` uses `npm ci`. A validated npm `package-lock.json` replaces the pnpm lockfile. Dependency declarations and all visual code remain unchanged.

Open the extracted `sanjaya-editable` folder in VS Code and run:

```powershell
npm ci
npm run dev
```

For production: `npm run build`, then `npm start`. In Vercel choose Next.js, build `npm run build`, install `npm ci`, and leave Output Directory override off. Do not enter an npm command in Output Directory.

## Checks performed

- TypeScript check: passed.
- ESLint: passed.
- Next.js production build: passed.
- Fresh npm dependency installation and `npm ci --dry-run`: passed after correcting the generated lockfile.
- Browser review: all four case studies and their local images loaded, all four previous project URLs redirected, all six blog links remained present, and an existing article loaded.
- Desktop and 390px mobile layouts reviewed. Mobile menu opened. All three new portraits loaded and carousel next controls advanced the slides.
- Original styling, animation, media, and blog preservation checks: passed.

The archive excludes dependencies, build output, local preview state, and temporary review files. `README.md` contains run/edit instructions. The older reference audit and screenshots are retained as historical documentation of the original reconstruction. These checks cover this revision; they are not a guarantee against every possible browser or hosting issue.
