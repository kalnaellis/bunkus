# Bunkus intake landing

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
