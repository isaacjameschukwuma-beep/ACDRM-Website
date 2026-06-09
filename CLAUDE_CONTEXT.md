# ACDRM — Claude Code Master Context
## Paste this at the start of every VS Code + Claude session

---

I am building the official website for the African Centre for Disaster Risk Management (ACDRM).

## THE INSTITUTION
- Full name: African Centre for Disaster Risk Management
- Acronym: ACDRM
- Tagline: Strengthening Systems. Building Resilience.
- Registered: May 2026 · Corporate Affairs Commission · Nigeria
- Website: www.acdrm.org
- Mandate: Pan-African
- Headquarters: Abuja, Nigeria

## THE FOUNDER
- Display name: Emenike Umesi PhD, CEM
- Full name: Dr. Emenike John Umesi, PhD, DMS, CEM, FSM
- Role: Founding Director, ACDRM
- Background: 30+ years in disaster management, emergency governance, and humanitarian leadership. Former Director at NEMA Nigeria. Led Nigeria's first NEMA Strategic Plan (2025–2029). Authored 2 books and 4 peer-reviewed publications. Harvard-certified in Nuclear & Radiological Emergency Planning.

## TECH STACK
- Base: UpScale Bootstrap Template (BootstrapMade)
- Bootstrap 5.3.3 via CDN
- AOS (Animate On Scroll) via CDN for all scroll animations
- Google Fonts: Inter + Source Serif 4
- No npm. No build step. Pure HTML, CSS, JavaScript.
- Deployed on Vercel as static site.

## BRAND COLORS — USE THESE EXACTLY, NO EXCEPTIONS
- Institutional Blue: #173B6D — dominant color, navbar, headers, buttons, footer
- Forest Green: #1E6B52 — eyebrows, icons, labels, secondary accents
- Leadership Gold: #C89B3C — stat numbers, section underlines, borders, card hover
- Ivory White: #F7F5EF — section backgrounds (alternating with white)
- Charcoal: #1B1B1B — all body text

## CSS VARIABLES (already in assets/css/main.css)
--accent-color: #173B6D
--heading-color: #173B6D
--default-color: #1B1B1B
--background-color: #ffffff
--green-color: #1E6B52
--gold-color: #C89B3C
--ivory-color: #F7F5EF

## FONTS
- Inter (400, 600, 800) — all headings, nav, UI, buttons, labels
- Source Serif 4 (400) — body paragraphs and editorial subheadlines only
- --default-font: 'Inter', system-ui, sans-serif
- --heading-font: 'Inter', system-ui, sans-serif
- --editorial-font: 'Source Serif 4', Georgia, serif

## HOMEPAGE SECTIONS (index.html) — IN ORDER
1. Navbar — logo left, links center, CTA right, sticky, transparent-to-white on scroll
2. Hero — split screen, text left 58%, image carousel right 42%
3. Stats Ticker — infinite CSS scroll, dark blue band, gold numbers
4. Six Strategic Pillars — 6-card grid with icons
5. Positioning Statement — full-width blue band, bold white text
6. How We Think — two-column, long narrative text, no bullets
7. What We Stand For — contrast values "X over Y" format
8. Flagship Programmes — 3 cards
9. Latest Insights — 3 publication cards
10. Partner CTA Band — blue background, gold button
11. Footer — charcoal background

## SIX STRATEGIC PILLARS
1. Disaster Risk Governance — icon: shield
2. Capacity Building & Training — icon: people/users
3. Research & Knowledge — icon: book-open
4. Preparedness & Response Systems — icon: alert-triangle
5. Climate Resilience — icon: leaf
6. Disaster Risk Financing — icon: trending-up

## THREE FLAGSHIP PROGRAMMES
1. African Resilience Leadership Fellowship (ARLF) — 40 fellows/year, 6 months, hybrid
2. African Resilience & Disaster Risk Governance Initiative (ARDGI) — $8.5M, 5 years, 5 countries
3. African Disaster Risk & Resilience Observatory — continental knowledge platform

## 2031 STRATEGIC TARGETS (for stats ticker)
- 10+ African Countries Supported
- 1,500 Professionals Trained
- 50 Research & Policy Publications
- $100M Resilience Financing Mobilised

## HERO FLOATING CARD STATS (for PureCounter)
- 30 — Years of Experience (shows as 30+)
- 10 — Countries Targeted (shows as 10+)

## HERO IMAGE CAROUSEL
- 5 images cycling every 4 seconds
- Crossfade transition (not slide)
- No controls — pure autoplay
- Files: assets/img/hero/hero-1.jpg through hero-5.jpg
- Container: 14px border radius, 2px solid #C89B3C border

## STATS TICKER BEHAVIOUR
- CSS keyframes infinite left scroll
- Background: #173B6D
- Numbers: #C89B3C bold large
- Labels: white 60% opacity uppercase
- Loops infinitely — duplicate set for seamless loop
- Pauses on hover

## ANIMATION RULES
- Use AOS for all scroll animations: data-aos="fade-up" data-aos-delay="100"
- Stagger delays: 100, 200, 300, 400ms
- Cards: translateY(-4px) lift + gold border on hover
- CTA buttons: background darkens on hover
- Arrow icons: translateX(4px) on hover
- Never use dark section backgrounds except #173B6D for ticker and footer

## RESPONSIVENESS BREAKPOINTS
- Mobile: 480px
- Tablet: 768px
- Desktop: 1024px
- Large: 1440px
- Max content width: 1280px, always centered

## DESIGN RULES — NEVER BREAK THESE
- White or #F7F5EF ivory backgrounds only (except ticker and footer)
- One gold accent element per section maximum
- Inter for all headings and UI
- Source Serif 4 for body paragraphs only
- Always center content within max-width: 1280px container
- Navbar is always sticky — transparent on hero, white + shadow on scroll
- Gold (#C89B3C) is always sparse — never a background, only accent

## REFERENCE WEBSITES FOR DESIGN DIRECTION
- undrr.org — sector match, study layout and programme pages
- phillipsconsulting.net — How We Think section, What We Stand For format
- dalberg.com — African development consulting, minimal premium
- obamafoundation.org — hero image execution, institutional gravitas
- odi.org — policy institute editorial style

## FILE STRUCTURE
- index.html — homepage
- pages/about.html, founder.html, programmes.html, research.html, contact.html
- assets/css/main.css — all styles
- assets/js/main.js — all JavaScript
- assets/img/hero/ — 5 hero images
- assets/img/founder/ — founder photo
- assets/img/logo/ — logo files

## HOW TO WORK WITH ME
Tell me which section or file you want to work on.
I will build or edit that specific thing.
Always reference the brand colors and rules above.
Never invent new colors or fonts.
Always keep AOS animations on scroll-triggered sections.
