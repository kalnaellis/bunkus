# BUNKUS — Pass 1 landing page (Vite + React)

One-page cinematic lawyer landing page for GitHub Pages at:
`https://kalnaellis.github.io/bunkus/`

## Implemented in Pass 1

- Vite + React single-page app (no router).
- Sticky top micro-strip nav (`BUNKUS` + `Seal your case` jump link).
- 4 poster-style sections with required copy.
- Section 2 and 3 16:9 image frames using `public/image-placeholder.svg` placeholder.
- Inline intake flow state machine:
  - State A: CTA only
  - State B: required intake form + validation + errors
  - State C: upload UI with drag/drop + multiple file select + file list
- `localStorage` persistence:
  - `bunkus_intake`
  - `bunkus_files`
- Responsive desktop/mobile layout and visible keyboard focus styles.

## Placeholder image note

`public/image-placeholder.svg` is a text-based placeholder so PR/diff tools that do not support binaries can still process changes.
Replace image URLs or add real JPG assets later when your workflow supports binary files.

## Local run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```
