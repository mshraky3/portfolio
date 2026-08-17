# Portfolio — Mahmoud Alshraky

Full-stack portfolio site: an Arabic-first (RTL) React single-page app with a small Express API behind it for the contact form and a live-jobs aggregator.

**Live:** [web-dev-seven-iota.vercel.app](https://web-dev-seven-iota.vercel.app)

---

## Stack

| Layer | Tech |
| --- | --- |
| Frontend | React 19, Vite 6, React Router 7, plain CSS, Framer Motion, Three.js (`@react-three/fiber`) |
| Backend | Node.js, Express 4, Nodemailer, deployed as a Vercel serverless function |
| Hosting | Vercel (frontend + API deployed separately) |
| Tooling | ESLint 9 (flat config), Python + ReportLab for résumé generation |

---

## Layout

```
frontend/          React SPA
  src/
    App.jsx          public portfolio page (SEO meta + structured data)
    main.jsx         router: public site + private /hq area
    components/      portfolio sections + the Job-Hunt HQ tracker
    pages/hq/        private research pages (see below)
    utils/           client-side PDF export
  public/            résumé PDFs, images, robots.txt, sitemap.xml
backend/           Express API (contact email, résumé tracking, job aggregation)
resume-src/        Python generators for the 8 résumé variants
job-hunt/          personal job-hunt notes and templates
```

## Routes

| Route | What |
| --- | --- |
| `/` | Public portfolio |
| `/hq` | Job-Hunt HQ tracker — passphrase-gated, data stored per-browser |
| `/hq/companies` | Qassim tech companies, grouped by tier, filter + mark Target/Skip |
| `/hq/targets` | The 11 ranked targets, plus the remaining shortlist |
| `/hq/shortlist` | Employers within 50 km, grouped into distance rings |
| `/hq/it-jobs` | Tech-companies-only cut of the 50 km sweep |

Everything under `/hq` is `noindex, nofollow` and keeps its state in `localStorage` only — nothing is sent to a server.

---

## Running locally

**Frontend**

```bash
cd frontend && npm install && npm run dev
```

**Backend**

```bash
cd backend && npm install && cp .env.example .env && npm run dev
```

Fill in `.env` before starting the API — see `backend/.env.example` for what each variable does. To point the frontend at a local API, create `frontend/.env.local`:

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

Regenerate a résumé variant (`ksa`, `ireland`, `remote`, `enterprise`, `agency`, `health`, `edu`, `gov`):

```bash
python resume-src/gen_resume.py frontend/public/resumes/Mahmoud_Alshraky_Resume_KSA.pdf ksa
```

---

## Deployment

Both halves deploy to Vercel as separate projects.

- **Frontend** — root directory `frontend`. `vercel.json` rewrites all paths to `index.html` so `/hq/*` deep links resolve.
- **Backend** — root directory `backend`. Set `EMAIL_USER`, `EMAIL_PASS`, `ALLOWED_ORIGIN`, and `DIGEST_SECRET` (optionally `CRON_SECRET`) in the project's environment variables.

## Contact

- Email — alshraky3@gmail.com
- LinkedIn — [mahmoud-alshraky](https://www.linkedin.com/in/mahmoud-alshraky)
- GitHub — [@mshraky3](https://github.com/mshraky3)
