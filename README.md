# Bunkus — one-page legal intake funnel

Single-page poster-style site with a static frontend and Google Apps Script backend support.

## What this build now includes

- Four full-screen scenes on a pure-white background with oversized editorial typography.
- Hero type-on reveal: `NOT YOUR REGULAR LAWYER`.
- Poster panel swap:
  - Scene 2: `I MAKE RULES BEND` + 16:9 image.
  - Scene 3: `CASE CLOSED. LIPS CLOSED.` + mirrored 16:9 image layout.
- Lightweight motion strategy:
  - Scroll-linked image parallax transforms.
  - Sticky dramatic hold in Scene 3.
  - Cursor-follow micro glitch shimmer (desktop only).
- CTA state machine in Scene 4:
  1. **Button** → `SEAL YOUR CASE IN ONE CLICK`
  2. **Inline form** → name, email, legal-intake consent
  3. **Upload mode** → file selector, upload list, statuses
- Privacy/legal microcopy embedded in CTA flow.

## Funnel data schema (Google Sheet)

Create a sheet named `Intake` with:

1. `timestamp`
2. `name`
3. `email`
4. `consent`
5. `source`
6. `case_id`
7. `files_count`
8. `file_links`
9. `notes`

The provided Apps Script (`apps-script/Code.gs`) auto-creates this header row if the sheet is empty.

## Backend (recommended for static hosting)

This project includes a Google Apps Script backend implementation in:

- `apps-script/Code.gs`

### What the script does

- `action: "intake"`
  - Validates name/email/consent
  - Generates `CASE-YYYY-XXXXXX`
  - Appends intake row to Sheet
  - Creates a Drive folder per case
  - Returns `caseId`, `rowIndex`, `folderId`, `folderUrl`
- `action: "upload"`
  - Accepts base64 files (`pdf/doc/docx/jpg/png/zip`)
  - Uploads files to case folder
  - Updates Sheet `files_count` and `file_links`

## Frontend setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment variable

Set this in `.env.local`:

```bash
NEXT_PUBLIC_APPS_SCRIPT_URL="https://script.google.com/macros/s/DEPLOYMENT_ID/exec"
```

If omitted, the UI still works in demo fallback mode for intake step.

## Deploy notes

This repo is now configured for static export with GitHub Pages.

1. `next.config.mjs` uses `output: "export"` and emits static files into `out/`.
2. GitHub Actions workflow `.github/workflows/deploy.yml` publishes `out/` to Pages.
3. `public/CNAME` and `public/.nojekyll` are included in the exported output.
4. Keep all submission/upload logic pointed at your Apps Script URL because GitHub Pages itself is static.

## Legal microcopy currently shown

- `Confidential intake. No spam. No nonsense.`
- `I understand this is an initial intake, not official legal advice.`


## GitHub Pages readiness checklist

- [x] Static export enabled (`next build` writes `out/`)
- [x] Deploy workflow uploads `out/`
- [x] Custom domain included via `public/CNAME`
- [x] No server-only API routes required for frontend flow
- [x] Intake + uploads delegated to Apps Script endpoint
