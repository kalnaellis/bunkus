# BUNKUS Landing Page Spec

## Pass 1 scope (layout + UI only)
- One-page React app (no router) for GitHub Pages deployment under `/bunkus/`.
- Four cinematic, full-screen style sections with white background and dark type.
- Thin sticky top strip nav with brand on left and jump link to section 4 on right.
- Section copy:
  1. `NOT YOUR REGULAR LAWYER`
  2. `I MAKE RULES BEND`
  3. `CASE CLOSED. LIPS CLOSED.`
  4. `SOME BREAK LAWS. I BREAK LIMITS.`
- Sections 2 and 3 include opposite-side 16:9 visual cards using a text-based placeholder: `public/image-placeholder.svg`.
- Section 4 includes CTA-driven intake state machine UI.

## Intake flow requirements (frontend only)
- State A: CTA button only.
- State B: Inline form expansion with required fields:
  - First name
  - Last name
  - Email
  - Phone
  - Required checkbox with legal intake notice text
- Basic validation with visible error messages.
- On valid submit, save JSON to `localStorage` key `bunkus_intake` and switch to upload state.
- State C: Upload UI with drag/drop and multi-select support.
- Accepted files: pdf, doc, docx, jpg, png, zip.
- Show selected file names + sizes and save file names JSON to `localStorage` key `bunkus_files`.
- Display done message: `Received. We will review your materials.`

## Technical constraints
- Vite + React.
- `vite.config.ts` must use `base: '/bunkus/'`.
- Minimal dependencies and componentized layout.
- Accessibility includes explicit labels, keyboard focus visibility, semantic buttons, and clear errors.
- Use text-based placeholder assets in-repo to avoid binary-file PR blockers.
