# Portfolio — Mahmoud Alshraky

English-only React portfolio. Scrolling builds a system: the hero shows how I build any system (plan, data, rules, access, interface, keeping it running), then each of four systems (SQB, the HR platform, NeuroLink, the email gateway) and the client sites gets its own shorter scroll chapter. Parts fly in and snap together (WebGL), and each plays a small visual story of what it does. Routes, tables and files are kept in a collapsed "Technical details" panel, never in the 3D scene. It also carries dated real traffic numbers and a case study of a browser face and hand tracking prototype. A small Express API behind it handles the contact form.

**Live:** [alshraky.xyz](https://alshraky.xyz) (also web-dev-seven-iota.vercel.app)

> **Ops (2026-09-20).** Frontend = Vercel `web-dev`; API = Vercel `portfolio-api` (`portfolio-api-rose.vercel.app`, mail via the email gateway, crons `/job-digest` 05:00 UTC and `/evening-checkin` 16:00 UTC); no database. Hosting map: working-projects `INFRASTRUCTURE.md`; rules: `project-rules/PORTFOLIO.md`. `job-hunt/` is private and git-ignored.

---

## Stack

| Layer | Tech |
| --- | --- |
| Frontend | React 19, Vite 6, React Router 7, plain CSS with design tokens, three.js through `@react-three/fiber` and `drei`; Bricolage Grotesque and IBM Plex Mono |
| Backend | Node.js, Express 4, Nodemailer, deployed as a Vercel serverless function |
| Hosting | Vercel (frontend and API deployed separately) |
| Tooling | ESLint 9 (flat config), Python + ReportLab for résumé generation |

---

## Layout

```
frontend/
  index.html         head markers <!--seo--> and <!--crawl--> filled at build time
  vite.config.js     siteHtml() plugin: writes meta, JSON-LD and crawler HTML from content.js
  src/
    data/content.js  every claim on the page, with its source and date
    data/images.js   image keys used by content.js
    components/      Nav, Hero, Proof, Systems, Sites, Experience, About, contact, Reactions,
                     Assembly (the scroll-driven 3D engine), Tracker (private /hq, lazy-loaded)
    utils/           capabilities.js: WebGL, low-power and reduced-motion checks
  public/            résumé PDFs, og.png (1200x630), robots.txt, sitemap.xml
backend/             Express API (contact email, résumé tracking, job aggregation)
resume-src/          Python generators for the résumé variants
job-hunt/            private notes (git-ignored)
```

## Rules for changing the content

- **No number without a source.** Add it to `src/data/content.js` with where it came from and the date. Traffic figures come from Google Search Console and Vercel Web Analytics; re-read them and update `METRICS_AS_OF` when you refresh them.
- The résumé generator (`resume-src/gen_resume.py`) carries the same facts. Change both, then regenerate the PDFs (command below).
- **English only.** No Arabic text, fonts or screenshots of Arabic interfaces on the public site. Screenshots come from the English mode of each product (`src/assets/shots`). The private `/hq` tool is lazy-loaded so its data never ships in the public bundle.
- **How the 3D works.** One engine, `components/Assembly`, drives every scroll section; a **rig** (`rigs.js`) decides how that section moves: `stack` (hero: parts fly in and snap onto a tower), `path` (SQB: stations along a road, the camera follows a glowing student), `orbit` (HR: tools revolve round a globe of 25 branches), `tunnel` (NeuroLink: a flight through lens rings), `explode` (email: a closed machine folds open into an exploded view and shuts again). The two client sites are tiles in the same "Everything I've built" index as the systems (screenshot and link), not a section of their own. Scenery per rig is in `decor.jsx`; per-module scenes in `visuals/` (`general.jsx`, `sqb.jsx`, `hr.jsx`, `neurolink.jsx`, `email.jsx`, registered in `visuals/index.js`). `timeline.js` maps scroll to a build clock; `AssemblyStage` takes `size` (`full`, `chapter`, `compact`) and `rig`. The canvas only exists near the viewport (at most two WebGL contexts). Everything is a pure function of scroll, so it behaves the same under the OS reduced-motion setting; without WebGL each section falls back to plain captions.
- **"Your turn" section and visitor data.** `components/Reactions` ends the page: "What brought you here?" (one tap, live split), "Tell me one thing" (a line emailed to me) and "Share your work with me" (a photo from the camera or an upload, and/or a link, emailed to me with the photo attached; photos are shrunk to 1280 px in the browser). `backend/visitors.js` stores anonymous visits, events, intents and a one-line record of notes and shares in the `portfolio` schema (`backend/schema.sql`) through `DATABASE_URL`; no names, emails or IPs, and shared photos are not stored by the portfolio. Instagram link: `/?from=ig#react`.
- **Performance.** 3D canvases render on demand (only while scrolling or easing; a still page draws nothing), start at a pixel ratio of at most 1.5 on touch devices and 1.75 elsewhere, and step down by 0.25 while frames run under 40 fps. The About logo is an exploded view in plain CSS 3D (`public/about/logo-*.webp`, layers cut from `logo.png`).
- **Screenshots** (`src/assets/shots`) are captured from the live sites at 2x in headless Chrome and saved as 2048 px WebP; Erth is its dark theme (Arabic only since its Sep 2026 redesign).
- **Palette.** Near-black with magenta (`#0a0a0c`, `#c147e9`, deep purple `#6a1b9a`), the same as the original portfolio. Do not add a light theme or other accent colours.
- To add a system, add it to `PROJECTS` in `content.js` with `group: "prod"` and `layers`: each layer has a `visual` key, a plain-language `step` and `rows` (`[tag, text]`, real routes, tables or features shown only under Technical details; `extraTech` holds rows without a scene). Shoghli was taken off the site on 2026-09-23; the email gateway serves three projects (SQB, HR, this portfolio).

## Routes

| Route | What |
| --- | --- |
| `/` | Public portfolio |
| `/hq` | Job-Hunt HQ tracker — passphrase-gated, data stored per-browser |
| `/hq/companies`, `/hq/targets`, `/hq/shortlist`, `/hq/it-jobs`, `/hq/route` | Private research pages |

Everything under `/hq` is `noindex, nofollow` and keeps its state in `localStorage` only.

---

## Running locally

```bash
cd frontend && npm install && npm run dev
```

```bash
cd backend && npm install && cp .env.example .env && npm run dev
```

Fill in `.env` before starting the API. To point the frontend at a local API, create `frontend/.env.local`:

```bash
echo "VITE_API_BASE=http://localhost:3000" > frontend/.env.local
```

## Other commands

```bash
cd frontend && npm run build
```

```bash
cd frontend && npm run lint
```

Regenerate the résumé variants (`ksa`, `ireland`, `remote`, `enterprise`, `agency`, `health`, `edu`, `gov`, `frontend`):

```bash
python resume-src/gen_resume.py frontend/public/resumes/Mahmoud_Alshraky_Resume_KSA.pdf ksa
```

The default download (`frontend/public/Mahmoud_Ahmed El-Sharaky_Resume.pdf`) is a copy of the KSA variant.

---

## Deployment

Both halves deploy to Vercel as separate projects.

- **Frontend** — root directory `frontend`. `vercel.json` rewrites all paths to `index.html` so `/hq/*` deep links resolve.
- **Backend** — root directory `backend`. Set `EMAIL_USER`, `EMAIL_PASS`, `ALLOWED_ORIGIN`, and `DIGEST_SECRET` (optionally `CRON_SECRET`) in the project's environment variables.

## Contact

- Email — alshraky3@gmail.com
- LinkedIn — [mahmoud-alshraky](https://www.linkedin.com/in/mahmoud-alshraky)
- GitHub — [@mshraky3](https://github.com/mshraky3)
