# ACDRM Website: Claude Code Context

> **Snapshot date:** 10 October 2026, matches the live site at www.acdrm.org (commit `b74947c`).
> The website code is the master copy. If the site has changed since this date, re-check
> each section against the file named next to it before relying on it, then update this note.
> This file is excluded from the public site (see `.vercelignore`).

---

## 1. The institution (source: `pages/about.html`, `pages/founder.html`, `index.html`)
- **Name:** African Centre for Disaster Risk Management (ACDRM)
- **Tagline:** Strengthening Systems. Building Resilience.
- **Registered:** May 2026, Corporate Affairs Commission (CAC), Nigeria
- **Headquarters:** FCT, Abuja, Nigeria. Pan-African mandate.
- **Contact:** africancentre@acdrm.org · +234 803 340 1017 · www.acdrm.org
- **Founding Director:** Dr. Emenike John Umesi, PhD, DMS, CEM, FSM (display: Emenike Umesi PhD, CEM). 30+ years in disaster management; former Director at NEMA Nigeria.
- **Authoritative content sources (local only, not in git):** `Company DocumentReadme/ACDRM COMPANY PROFILE v.2.1_03_06_26.pdf` and the ACDRM Brand Manual PDF.

## 2. Tech stack and hosting
- Pure HTML, CSS and JavaScript. No framework, no npm, no build step.
- CDNs: Google Fonts (Inter + Poppins), Bootstrap Icons 1.11.3, AOS 2.3.4 (scroll animations).
- **Hosting:** Vercel, auto-deploys from GitHub `isaacjameschukwuma-beep/ACDRM-Website`, branch `main`. Pushing to `main` updates the live site with no downtime.
- `vercel.json` redirects `/index.html` to `/`. All "home" links use `/` (never `index.html`).
- **Local preview:** `powershell -ExecutionPolicy Bypass -File tools\serve.ps1 8080`, then open http://localhost:8080/

## 3. Brand (source: `assets/css/main.css`, top `:root` block)
| Token | Value | Use |
|---|---|---|
| `--accent-color` | `#173B6D` Institutional Blue | dominant: headings, buttons, footer |
| `--green-color` | `#1E6B52` Forest Green | eyebrows, icons, secondary |
| `--gold-color` | `#C89B3D` Leadership Gold | sparse accents only (from Brand Manual) |
| `--ivory-color` | `#F7F5EF` Ivory | alternating section backgrounds |
| `--charcoal-color` | `#1B1B1B` Charcoal | body text |

- **Fonts:** Poppins for headings, nav and UI (`--heading-font`, `--nav-font`); Inter for body (`--default-font`, `--editorial-font`). Brand Manual specifies Aptos + Poppins; Aptos is not web-available, so Inter replaces it. Do not reintroduce Source Serif.
- **Copy rule (strict):** never use em dashes or en dashes in site copy. Use commas for clause breaks and hyphens for ranges. `tools/fix-dashes.ps1` enforces it; re-run after adding copy.

## 4. Pages (source: file listing)
- `index.html`: homepage
- `pages/`: `about` (incl. leadership team section), `founder`, `framework` (GIE Nexus Model), `programmes`, `arlf`, `ardgi`, `observatory`, `research` (tabbed library), `publication` / `article` / `blog` (detail pages filled from the backend), `partnerships`, `contact` (form delivers to africancentre@acdrm.org via FormSubmit)
- `admin/`: `login.html`, `dashboard.html` (research upload area, built by the backend developer)
- Header: solid white on all pages with colour logo (`logo-color.png`); footer uses `logo-white.png`.
- Nav: About · What We Do (`/#pillars`) · Programmes · Research · Partnerships · Contact · "Partner With Us" button. The Login link is commented out; admin is reached directly at `/admin/login.html`.

## 5. Homepage, in order (source: `index.html`)
1. **Hero:** full-screen background slider (`.hero-slide`, `hero-1..4.jpg`) with blue overlay; eyebrow "Pan-African Resilience Institution"; headline "Strengthening Systems. Building Resilience."; buttons Explore Our Work / Partner With Us; stat "30+ Years of Experience"; "Registered · CAC Nigeria · May 2026". No founder card.
2. **Stats ticker:** animated wave, infinite scroll: 10+ African Countries Supported · 1,500 Professionals Trained · 50+ Research & Policy · $100M Resilience Financing.
3. **Six Strategic Pillars** (`#pillars`): Disaster Risk Governance · Capacity Building & Training · Research & Knowledge · Preparedness & Response Systems · Climate Resilience · Disaster Risk Financing.
4. **Positioning band** ("Our Purpose").
5. **How We Think** (`#approach`).
6. **What We Stand For** (`#values`).
7. **Flagship Programmes** (`#programmes`): ARLF · ARDGI · African Disaster Risk & Resilience Observatory.
8. **Latest Insights** (`#insights`): loaded live from the backend (see section 6).
9. **Partner CTA band**, then footer.

## 6. Backend and research content (source: `assets/js/*.js`, `admin/assets/js/*.js`)
- **API:** `https://acdrm-backend.onrender.com/api/v1` (Node backend on Render, built and run by the backend developer, Iyke). Files are stored on Cloudinary.
- Content item fields: `title`, `description` (abstract), `body`, `coverImage`, `pdf`, `type` (`PUBLICATION` / `ARTICLE` / `BLOG` / `PDF`), `status`, `slug`, `createdAt`.
- Endpoints used: `/content/latest` (homepage), `/content/feed/{tab}` (research tabs), `/content/{id}` (detail pages), `/content/{id}/related`, `/auth/login` (admin).
- **Covers:** shown on homepage cards, research cards, publication page and related cards via `window.acdrmCover(url, width, fallback)` in `assets/js/main.js`. It requests Cloudinary resized copies (`f_auto,q_auto,c_limit,w_N`) and falls back to a site image when there is no cover.
- **PDF downloads:** the backend stores PDFs without a `.pdf` extension. `publication-detail.js` fetches the file and saves it as `<slug>.pdf`. Keep this unless the backend is fixed and verified.
- **Homepage insights:** short teaser (about 150 characters) plus "Read more" linking to the item's own page.
- **Admin login** uses the backend; if the Render server is asleep or down, login shows "Load failed". That is a backend issue, not the site.

## 7. Security rules (important)
- On 22 June 2026 a malicious commit (`932996e`) from the backend developer's machine added `.vscode/tasks.json` (runs code on folder open) and a fake font `public/fonts/fa-solid-300.llf`. Removed in `67e0f4f`.
- **Before every `git pull`, inspect incoming commits.** Reject anything adding `.vscode/`, `public/`, `*.llf`, obfuscated JS, or `.gitignore` lines hiding `.bat` files. Never open an unchecked clone in VS Code.

## 8. Images and tools (source: `tools/`)
- Originals (large PNGs) stay local; web copies are made by `tools/optimize-images.ps1`. Re-run when new originals are added.
- Other scripts: `serve.ps1` (local preview), `fix-dashes.ps1`, `process-logos.ps1`, `make-favicon.ps1`, `crop-projects.ps1`.
- `tools/`, this file, `README.md` and `screenshots/` are excluded from the public site via `.vercelignore`.

## 9. Open items at snapshot date
- Backend (Iyke): Render server unstable; keep `.pdf` extension on uploads; create an admin account for the client (admin currently uses Iyke's email).
- Leadership bio for Iheoma Job (Project Manager, `about.html`) is approved as final by the owner. Do not change it.

## How to work with me
Tell me which page or section to work on. Use the brand tokens and fonts above, never invent new colours or fonts, keep AOS animations on scroll sections, and follow the no-dash copy rule.
