# Florilegium Officium

A mobile-first reader for the traditional Roman Divine Office. Divinum Officium remains the authoritative liturgical engine; this project provides a cleaner iPhone-first presentation layer.

## Architecture

- **Divinum Officium backend:** Google Cloud Run
- **Frontend:** static HTML/CSS/JavaScript
- **Proxy:** Cloudflare Pages Function at `/api/office`
- **Liturgical logic:** entirely delegated to Divinum Officium

The proxy currently points to:

`https://divinum-officium-833566975684.us-east1.run.app`

## Supported rubrics

- Divino Afflatu — 1939
- Divino Afflatu — 1954
- Reduced — 1955
- Rubrics — 1960

Latin and English are displayed side by side.

## Cloudflare Pages deployment

Create a Pages project from this GitHub repository and use:

- **Production branch:** `main`
- **Framework preset:** None
- **Build command:** leave blank
- **Build output directory:** `public`

Cloudflare Pages automatically deploys the `functions/` directory as Pages Functions, so no separate Worker project is required.

After deployment, the frontend requests `/api/office`; the Pages Function fetches the requested Hour from the Cloud Run Divinum Officium instance with `content=1`, keeping DO responsible for occurrence, concurrence, commemorations, octaves, psalmody, lessons, collects, and all other liturgical decisions.

The proxy also contains one narrowly scoped data repair for older backend images containing a malformed St. Zephyrinus common reference. On 25 August at Vespers, it supplies the omitted bilingual commemoration only when Divinum Officium declares that commemoration in the heading but fails to render it in the prayer section. Because this is a Simplex commemoration, the suffrage remains and supplies the final conclusion, matching the official Divinum Officium output.

## Design

The interface is deliberately restrained and mobile first:

- dark background `#070606`
- purple accent `#8451CF`
- compact horizontal Hour navigation
- Matins-only lessons view for spiritual reading without psalms, responsories, or prayers
- previous/next day controls
- persistent rubric selection
- adjustable reader text size
- Latin/English parallel columns
- installable PWA metadata for iPhone Home Screen use

## Principle

**Divinum Officium decides what is prayed. Florilegium Officium decides how it is displayed.**
