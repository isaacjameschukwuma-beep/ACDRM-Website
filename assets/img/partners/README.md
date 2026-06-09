# Partner / donor logos (rolling marquee)

Used in the rolling logo marquees on:
- `pages/observatory.html` (Institutional Readiness)
- `pages/ardgi.html` (Target Donors)
- `pages/partnerships.html` (Target Donors & Strategic Partners)

## Present (real logos, sourced from Wikimedia Commons)
- `world-bank.svg` — World Bank
- `undp.svg` — UNDP
- `usaid.svg` — USAID
- `eu.svg` — European Union (flag)
- `african-union.svg` — African Union (flag)
- `un.svg` — United Nations emblem (available if needed)

## Shown as TEXT (logo not bundled — drop a file here to upgrade to a logo)
Add any of these with the exact filename and it will appear automatically in the marquee
(then replace the matching `<span class="logo-text-fallback">…</span>` with
`<img src="../assets/img/partners/FILENAME">` in the page):
- `afdb.svg` — African Development Bank
- `fcdo.svg` — UK FCDO
- `rockefeller.svg` — Rockefeller Foundation
- `undrr.svg` — UNDRR

## Notes
- Prefer SVG (scales crisply). PNG with transparent background also works.
- IMPORTANT: these institutions are listed as **target/strategic partners** in the
  company profile. Confirm you have the right to display each organisation's logo
  before going live (trademark / brand-guideline permission).
