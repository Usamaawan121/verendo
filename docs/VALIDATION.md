# Validation

Checked on 26 September 2026.

## Automated checks

- TypeScript: `npm run typecheck` passed.
- ESLint: `npm run lint` passed with no application errors or warnings.
- Production bundle: `npm run build` completed successfully.
- All referenced local media paths exist. Included images were decoded/verified.
- 66 reference media files plus one hero poster are included locally.
- Hero video bytes matched a second download from the reference URL (SHA-256 `305be0453f83d78fe82d9aecce7b42e4e04cac56c6478772857582e773663c91`). Its full-scene opening and later close-up frames are parts of the same clip, not separate 3D implementations.

## Browser checks

- Desktop homepage rendering, loaded hero/portrait/footer videos and no broken loaded images.
- Monthly/yearly tab selection: yearly prices displayed $3999 / $5999 / $6999.
- Growth plan selection carried `Growth — yearly` to the contact page.
- FAQ expanded and exposed its answer.
- Testimonial next button changed the carousel track from its initial position to `translate3d(-1112px, 0px, 0px)` in the tested desktop viewport.
- Mobile menu opened and navigated to the contact page.
- Contact form required-name validation prevented an empty submission and focused the name field.
- Email input used native email validation; budget menu displayed the four configured ranges.
- Contact page had no horizontal overflow at 390 px and 768 px review frame widths.
- Project listing opened Batavia's case study.
- Blog listing showed six articles; the first article opened with three content sections.
- About page rendered six team cards.
- Privacy-policy and 404 routes rendered.
- Desktop and mobile preview screenshots are in `docs/previews/`.

These are representative browser checks, not exhaustive testing of every route/state/device combination. Mobile review used responsive browser frames, not a physical phone. No real email, newsletter, booking or payment was submitted. No claim is made that a third-party backend is connected.

## Remaining differences / limitations

- This is reconstructed React source, not an original Framer editor file.
- Some animation curves, timing, scroll positions and responsive transitions are approximations.
- Case-study/article/legal prose is partly rewritten sample content.
- Three of the case studies reuse their cover artwork in the inner detail layout.
- Original private CMS, backend and 3D authoring files are unavailable.
- Template prices, testimonials and performance metrics are not independently verified claims.
- Windows startup commands are provided; this build was validated in a Linux environment.
