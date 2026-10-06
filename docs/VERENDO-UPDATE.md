# Verendo update — 2026-09-28

This update applies only the requested rebranding, opening intro, moving V, digital-friction green accents, and About images, plus small compatibility and defensive fixes.

The original `app/globals.css` is unchanged. New selectors in `app/verendo-brand.css` are restricted to `.verendo-intro`, `.verendo-scene` and descendants of `.pain-section`. The previous alpha values in the ring and badges are retained. Existing easing, animation duration, scroll transforms, hover transitions, carousel behavior and responsive layout rules remain in their original files.

The S in the input was pre-rendered video. The new V is newly authored geometry; it is not an edit of the original unavailable 3D scene, and does not claim frame-for-frame equivalence. It floats, rotates and receives metallic environmental reflections through Three.js. The SVG fallback uses the same camera, geometry and movement with basic shading. Rendering pauses when offscreen or hidden and becomes static for reduced-motion preferences. Resize observers, animation frames and graphics resources are released when a scene unmounts.

The root-layout intro uses CSS timing, so even if JavaScript fails the overlay becomes hidden and non-interactive. It lasts 2.6 seconds, including its fade. React removes it after the animation. Root-layout persistence prevents repetition on normal internal route changes.

About has 17 replaced image slots: five main images, six primary team portraits, and six hover alternatives. The two additional generated images are the hero landscape and V poster. Each new image was generated separately using the built-in image-generation tool. WebP encoding preserves the generated composition and dimensions while reducing transfer size. Exact prompts are in `verendo-image-prompts.json`.

Original source and original media were compared before packaging. See `VERENDO-PRESERVATION.json` and `VERENDO-VALIDATION.md`. Older reports in this folder document earlier work and the original reference, not the checks for this update.
