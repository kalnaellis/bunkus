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
