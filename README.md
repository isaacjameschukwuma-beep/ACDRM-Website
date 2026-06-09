# ACDRM — African Centre for Disaster Risk Management

Official website for the **African Centre for Disaster Risk Management (ACDRM)** — Africa's dedicated institution for disaster risk governance, resilience building, and humanitarian leadership. Headquartered in Abuja, Nigeria.

**Tagline:** Strengthening Systems. Building Resilience. · **Version 1.0**

---

## Tech stack
Pure **HTML, CSS, and JavaScript** — no build step, no framework. CDNs only:
- Google Fonts (Poppins + Inter)
- Bootstrap Icons 1.11.3
- AOS 2.3.4 (scroll animations)

Designed to deploy as a **static site on Vercel**.

## Project structure
```
index.html              Homepage (full-screen hero slider, pillars + video, programmes, insights)
favicon.ico             Browser-tab icon (shield)
pages/
  about.html            Who we are, vision/mission/values, GIE summary, leadership team
  founder.html          Founding Director profile (Dr. Emenike Umesi)
  framework.html        The GIE Nexus Model (Governance, Interoperability, Ethics)
  programmes.html       Core services, 3 flagship programmes, practice areas
  arlf.html             ARLF programme detail
  ardgi.html            ARDGI programme detail
  observatory.html      Disaster Risk Observatory detail
  research.html         Publications / Articles / Blogs (tabbed library)
  partnerships.html     Track record, partners, donors
  blog.html             News & insights listing (backend-ready)
  article.html          Single-post template (backend-ready)
  contact.html          Enquiry form (delivers to africancentre@acdrm.org)
assets/
  css/main.css          All styles + brand design tokens
  js/main.js            Header, carousel, AOS init, counters, mobile nav
  img/                  Web-optimised images (hero, projects, founder, team, logo, partners)
  video/                Homepage "What We Do" video (meeting.mp4)
tools/                  PowerShell helper scripts (image optimise/crop, favicon, local server)
screenshots/            Review screenshots
```

## Brand
- Institutional Blue `#173B6D` · Forest Green `#1E6B52` · Leadership Gold `#C89B3D` · Ivory `#F7F5EF` · Charcoal `#1B1B1B`
- Headings/UI: **Poppins** · Body: **Inter**

## Local preview
No build needed. Start the included static server (Windows PowerShell):
```powershell
powershell -ExecutionPolicy Bypass -File tools\serve.ps1 8080
```
Then open http://localhost:8080/

## Deploy (Vercel)
Static site — deploy the repository root as-is (no build command; output directory = root). Add the custom domain `www.acdrm.org` in Vercel settings.

## Contact form
The enquiry form (`pages/contact.html`) delivers every submission to **africancentre@acdrm.org** via FormSubmit (no backend needed). The first submission requires a one-time activation click in that inbox. To switch to a custom backend later, change the form `action` to your endpoint (field names are preserved).

## Notes
- Raw original photos and internal documents (brand manual, company profile) are intentionally **not** committed — see `.gitignore`. The web-optimised images the site uses are included.
- Helper scripts in `tools/` regenerate optimised images, crops, and the favicon from source files kept locally.

---
Built by **Stratagem Africa**. © 2026 African Centre for Disaster Risk Management.
