# Bunkus — scroll editorial intake (Vite + React)

This repo is now aligned for **GitHub Pages static hosting** + **separate backend endpoint** for intake/upload.

## What is implemented

- Vite + React scaffold (`src/`, `vite.config.ts`) with `base: '/bunkus/'` for GH Pages.
- 4 pinned scroll scenes using GSAP ScrollTrigger.
- WebGL background (R3F shader) with low-cost grain and Scene 4 cursor sparkle reaction.
- Scene 2 16:9 reveal composition (image + subject layer + side text).
- Scene 3 recomposition transform.
- Scene 4 CTA arming + modal intake UI with backend stub calls.
- GitHub Actions workflow to build/deploy `dist/` to Pages.
- `.nojekyll` for Pages compatibility.

## Local run

```bash
npm install
npm run dev
```

## Backend architecture (required in production)

Because GitHub Pages is static, keep secrets server-side:

- `POST /case` on Cloudflare Worker / Vercel / Netlify / Apps Script.
- `POST /upload` endpoint for file handling and Sheets row updates.

Update the frontend endpoint URL in `src/App.jsx` (`https://example-worker.dev/case`).
