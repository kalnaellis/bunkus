# Bunkus intake landing

This repo now includes a **dependency-free static web build** so you can pull and view the page immediately in a browser.

## Quick view (no npm required)

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Files used for static experience

- `index.html` – single long-scroll story page
- `styles.css` – typography, spacing, CTA, modal styling
- `script.js` – scroll transitions, CTA state machine, form + upload UI flow

## Optional Next.js/API implementation

The prior Next.js/API structure remains in `app/`, `components/`, and `lib/` if you want to run full server routes with Google integrations later.
Single-page, scroll-driven legal intake narrative with a morphing CTA and Google Sheets/Drive logging pipeline.

## Run

```bash
npm install
npm run dev
```

## Environment

Copy `.env.example` to `.env.local` and set the Google service account + IDs.

## API flow

- `POST /api/case`: validates intake payload, appends spreadsheet row, creates Drive folder.
- `POST /api/upload`: uploads files to that folder and updates the row with file links.
