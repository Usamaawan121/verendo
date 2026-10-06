# Reference website / animation audit

Reference: https://sanjaya.framer.ai/
Inspected: 26 September 2026.

## What the public website reveals

| Area | Evidence / conclusion | Editable reconstruction |
| --- | --- | --- |
| Platform | Framer-generated markup, styles and runtime | React components and readable source |
| Frontend | React and Motion-based Framer animation runtime | React 19 + Motion |
| Smooth scroll | `lenis` classes and Lenis stylesheet were present | Lenis 1.3 |
| Styling | Generated Framer CSS, Geist and Geist Mono, near-black background, translucent borders | CSS variables and custom CSS; Tailwind supports UI primitives |
| Tailwind on the reference | No positive evidence that the reference was authored with Tailwind | Tailwind 4 is used in this reconstruction, not claimed as original source |
| GSAP, Three.js, Spline | No positive evidence found in the inspected pages | Not used |
| Hero “3D” | A 5.055-second looping MP4, 2512 × 1424 | Same public MP4 stored locally |
| Portrait and footer motion | Approximately 5.08-second MP4 loops | Same public media, visibility-based playback |
| 3D sculptures on cards | Raster artwork, including browser-served AVIF variants | Local images and CSS hover transforms |
| Hero entrance | Opacity/scale entrance with delayed labels and contact card | Motion entrance and text reveal |
| Text | Individual character opacity / vertical movement | Character spans with staggered Motion variants |
| Problems section | Long scroll section, sticky scene, badges that scale and fade | `useScroll` / `useTransform`, CSS perspective and ring |
| Projects | Sticky cards with shrinking/fading earlier cards | Sticky desktop stack and scroll-linked transforms |
| Integrations | Repeated logos travelling horizontally in opposite directions | Two CSS marquees with gradient mask |
| Services | Heading stays in view while service cards continue | CSS `position: sticky` |
| Landscape panels | Scroll-linked background displacement and gradient masks | `ParallaxImage` component |
| Testimonials | Horizontal slider and count-up metrics | Embla/shadcn carousel and Motion counters |
| Pricing | Monthly/yearly variant switching with blurred/fading amounts | Radix tabs and Motion price entrance |
| FAQ | Expand/collapse answers; multiple answers can be open | Radix/shadcn Accordion |
| Navigation | Scroll-dependent header and mobile navigation | Fixed Motion header and Radix Sheet |
| Buttons | Label/arrow transitions | CSS duplicate-label slide and arrow movement |

This is an inspection of the public frontend, not access to Framer's editor or the creator's original development files. Absence of a library signature is not proof that no hidden part of the original project ever used it.

## Functional destinations observed

- Project and article cards link to detail pages.
- Header/footer link to projects, about, blog, contact, legal pages and 404.
- Booking buttons pointed to `https://cal.com`, without a specific booking account.
- Plan buttons in the reference did not expose an `href` destination.
- Form layouts were inspected. Actual delivery, mailing-list subscriptions and backend processing were not tested by sending messages.

## Notes about the supplied markdown guide

The supplied guide is useful educational material, but it is not the site's source code. Some technology/effect descriptions are possibilities rather than verified findings. Empty code fences and generic explanations cannot recreate the site. In particular, the inspected hero uses an MP4; describing that visual as a live 3D scene or a sequence of separate still images is not an accurate account of the observed implementation.

## Differences deliberately documented

The clone provides editable implementations of visible effects. Exact spring curves, every scroll threshold, the entire original CMS copy, creator-only configuration, and hidden backend functions were not recovered. The team portrait transition is implemented as a hover/focus crossfade. The mobile project stack is simplified into normal cards for readability. Original promotional “Buy Template” and Framer platform badges are omitted.
