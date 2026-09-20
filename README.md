# Portfolio — Mahmoud Alshraky

English-only React portfolio. Scrolling builds a real system: its parts fly in and snap together (WebGL), and each part plays a small visual story of what it does. Routes, tables and files are kept in a collapsed "Technical details" panel, never in the 3D scene. It also carries dated real traffic numbers and a case study of a browser face and hand tracking prototype. A small Express API behind it handles the contact form.

**Live:** [web-dev-seven-iota.vercel.app](https://web-dev-seven-iota.vercel.app)

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
    components/      Nav, Hero, Proof, Work, NeuroLink, Experience, About, contact,
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
- **How the 3D works.** `components/Assembly/timeline.js` maps scroll progress to a build clock: each module lands on the stack, then plays its story (`components/Assembly/visuals/*`: data vault, engine, payment gate, search grid, screen, and for NeuroLink a webcam, hand, face, protocol timeline and physician view). `AssemblyScene.jsx` places the trays and drives the camera. Everything is a pure function of scroll, so nothing moves on its own and it behaves the same under the OS reduced-motion setting. Without WebGL (or on low-powered devices) the section falls back to plain captions plus the technical details.
- **Palette.** Near-black with magenta (`#0a0a0c`, `#c147e9`, deep purple `#6a1b9a`), the same as the original portfolio. Do not add a light theme or other accent colours.
- To add a system, add it to `PROJECTS` in `content.js` with `image` or `diagram`, and `layers` (rows are `[tag, text]`, real routes, tables or features shown only under Technical details).

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
