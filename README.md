# Florilegium Officium

A mobile-first reader for the traditional Roman Divine Office. Like Propria, this site serves saved liturgical data generated directly by the official Divinum Officium Perl engine. No Google Cloud Run service or Google credentials are required.

## Options

- Divino Afflatu — 1954 (the pre-1955 rubrics)
- Rubrics — 1960
- Little Office of the Blessed Virgin Mary — Divino Afflatu 1954 (`votive=C12`)

Language modes: Latin • English, Latin • Español, Cantilenæ • English.

The Hours, Matins lessons view, Confiteor supplement, and 1954 Martyrology supplement keep their existing presentation. The Martyrology uses the generated 1954 Prime in plain Latin and the selected translation.

## Data and updates

GitHub Actions checks `DivinumOfficium/divinum-officium` master at minute 17 of every hour. GitHub may delay scheduled runs. Unchanged upstream commits skip generation while at least 60 future days remain available. When needed, the workflow generates seven previous days and 90 days beginning today for every supported Hour, rubric, and language. New data replaces the old range only after generation succeeds; all saved Hours are verified before the workflow commits and pushes them. Cloudflare's Git integration deploys that commit.

This rolling range keeps the complete Office collection within Cloudflare Pages' file limit. Dates outside the saved range return a clear 404; they do not contact a live backend. Upstream commit and coverage are recorded in `public/data/office/available.json`.

## Cloudflare Pages

Keep the existing Git-connected Pages project:

- Production branch: `main`
- Framework: None
- Build command: leave blank (or `npm run build` to verify saved data)
- Output directory: `public`

`/api/office` and `/api/martyrology` read saved JSON through the Pages `ASSETS` binding. `_routes.json` limits Functions to those two endpoints. Google and Cloudflare Access identity settings from the previous backend setup are no longer used.

## Regenerate locally

Install Perl with CGI, URI and HTML::Parser, plus Node 20 or later. Clone the official DO repository, then run:

```sh
npm run sync:offices -- --source /path/to/divinum-officium --start 2026-10-02 --days 97
npm test
npm run verify:data
```

The generator executes `Pofficium.pl` with the same options as the previous proxy and preserves DO's HTML and GABC. Liturgical rules and translations remain DO's; this project controls presentation.

If DO returns a missing GABC score message, the affected section uses DO's plain Latin text for the same date, rubric and Hour. The other notation and the English translation remain intact. Verification rejects unresolved missing-score output.
