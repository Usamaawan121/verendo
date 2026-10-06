# Verendo 1.1.0 verification

Checked 3 October 2026 against the latest supplied GitHub source (`aa3c178`, footer phone update), in an isolated working copy.

## Passed

- `npm run lint`: no lint errors.
- `npm run typecheck`: no TypeScript errors.
- `npm run build`: normal Next.js/Turbopack production build completed.
- `npm run check:routes`: 21 expected pages, four legacy redirects, five unknown-route 404 responses, and 28 referenced-media checks passed (30 route/content checks).
- Blog post, portfolio project and demo-product data compared with the baseline: values unchanged.
- Desktop Chrome preview: black/green hero, local artwork loading, three service pages, dropdown navigation, service-specific contact selection, process transitions, and comparison title/cards.
- Corrected a hover/click dropdown conflict and verified a single click opens the menu.
- Corrected overlapping comparison opacity timelines. At the cards stage, measured title opacity 0 and card opacity 1; reversing returned title 1 and cards 0.
- Mobile layout checked in a 390-pixel iframe (375-pixel content viewport): no horizontal document overflow, four static process cards, three static sequence sections, menu opens/closes and Website Development navigation succeeds.
- Opening logo appears on reload and is removed; it remained absent after normal internal navigation.
- Existing WhatsApp and phone links retain +1 971 399 4753. No message or booking was submitted during tests.
- No application-origin console errors observed. The testing browser emitted unrelated extension metadata errors.

## Scope and limits

This is a frontend release. Email-draft forms retain their documented behavior; no backend or mailing-list provider was added. External WhatsApp service behavior and live Vercel deployment were not tested or changed. Dependency versions and the lockfile dependency graph were not upgraded; this was not a new security audit. Existing response headers remain configured.

Desktop testing used the available Linux Chrome browser. The mobile check exercises responsive CSS in an iframe, not a physical iOS/Android device. Windows setup and Safari were not independently executed here. Reduced-motion layouts are implemented; browser preference emulation was not available in the test surface.

New hero and process art is rendered imagery with UI transforms, not user-rotatable 3D meshes. The footer monogram retains its existing Three.js and fallback implementation with updated colors.

Earlier reports in this directory document prior versions. Their old pricing and preservation statements do not describe version 1.1.0.
