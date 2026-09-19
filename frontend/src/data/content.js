// Single source of truth for everything the portfolio states about itself.
// Every number is either read from a dashboard named in `source`, or counted
// from the code named in `evidence`. Do not add a figure without one of the two.
// The build (vite.config.js) also reads this file to write the page head and the
// crawler HTML, so it stays plain data: images are keys resolved in images.js.

export const SITE = {
  url: "https://web-dev-seven-iota.vercel.app",
  name: "Mahmoud Alshraky",
  role: "Software engineer",
  email: "alshraky3@gmail.com",
  phone: "+966 58 261 9119",
  whatsapp: "https://wa.link/5zcep6",
  github: "https://github.com/mshraky3",
  linkedin: "https://www.linkedin.com/in/mahmoud-alshraky",
  instagram: "https://www.instagram.com/m_alshraky/",
  city: "Qassim, Saudi Arabia",
  degree: "B.Sc. Computer Science, Qassim University (graduating June 2027)",
};

export const TITLE = "Mahmoud Alshraky | Software engineer, full-stack";
export const DESCRIPTION =
  "Full-stack software engineer. I build and run production systems with React, Node.js and PostgreSQL: an exam platform, an HR system for 25+ branches, a job marketplace, and an in-browser face and hand tracking prototype. Explore each one, taken apart layer by layer.";

// ─── Proof: measured traffic and scale ───────────────────────────
export const METRICS_AS_OF = "19 September 2026";

export const HEADLINE_METRICS = [
  {
    value: "468",
    label: "pages indexed by Google",
    detail: "Up from 5 on 30 August, after I prerendered the public content for crawlers.",
    source: { by: "Google Search Console", site: "smle-question-bank.com", when: "16 Sep 2026" },
  },
  {
    value: "1,001",
    label: "visitors in 30 days",
    detail: "4,262 page views, 45% bounce rate.",
    source: { by: "Vercel Web Analytics", site: "smle-question-bank.com", when: "30 days to 19 Sep 2026" },
  },
  {
    value: "734",
    label: "clicks from Google search in 90 days",
    detail: "13.1K impressions, average position 6.8.",
    source: { by: "Google Search Console", site: "smle-question-bank.com", when: "17 Jun to 16 Sep 2026" },
  },
];

export const TRAFFIC_ROWS = [
  { site: "smle-question-bank.com", what: "SQB exam platform", visitors: "1,001 visitors", search: "734 clicks, 13.1K impressions", note: "Vercel (30 days), Search Console (90 days)" },
  { site: "erthfc.com", what: "Environmental consultancy site", visitors: "132 visitors", search: "Not connected yet", note: "Vercel (30 days)" },
  { site: "shoghli.vercel.app", what: "Shoghli job marketplace", visitors: "Not tracked yet", search: "9 clicks, 2.18K impressions", note: "Search Console (90 days)" },
];

export const SCALE_FACTS = [
  { value: "7,000+", label: "questions in SQB, each with a written explanation", evidence: "SQB home page showed 7,115 on 17 Sep 2026" },
  { value: "573", label: "commits in the SQB repository", evidence: "git rev-list --count HEAD" },
  { value: "150", label: "API route handlers in SQB", evidence: "counted in backend/app.js and backend/routes" },
  { value: "31", label: "database tables created by SQB's schema bootstrap", evidence: "CREATE TABLE IF NOT EXISTS statements" },
  { value: "25+ / 600+", label: "branches / employees in the HR system", evidence: "my CV; healthcare company" },
  { value: "54", label: "route handlers across Shoghli's 13 API modules", evidence: "counted in apps/api" },
  { value: "35", label: "automated tests for the shared email gateway", evidence: "tests/*.test.ts" },
];

// ─── The hero teardown: SQB, layer by layer ──────────────────────
// `rows` are [tag, text]. Every row is a real route, table, file or feature.
export const HERO = {
  eyebrow: "Open to full-time roles and freelance work",
  headline: "I build systems people use, then keep them running.",
  scrollCue: "Scroll to take one apart: SQB, an exam platform I built and run.",
  overview: "SQB, taken apart. Five layers, every one written and operated by me.",
  outro: "That was one system. Here are the others.",
  layers: [
    {
      name: "Interface",
      role: "What people see",
      kind: "image",
      image: "sqb",
      note: "smle-question-bank.com",
      step: {
        title: "The interface",
        text: "React 19 and Vite. Every public page is prerendered, so search engines read real content instead of an empty shell.",
        facts: ["Google-indexed pages went from 5 to 468 between 30 Aug and 16 Sep 2026", "1,001 visitors and 4,262 page views in the last 30 days"],
      },
    },
    {
      name: "Apps and bots",
      role: "Other ways in",
      kind: "rows",
      rows: [
        ["APP", "Expo / React Native, same backend"],
        ["BOT", "Telegram: daily question, weekly summary"],
        ["CRON", "/api/cron/telegram-daily"],
        ["CRON", "/api/cron/telegram-weekly"],
        ["CRON", "/api/cron/lifecycle-emails"],
        ["CRON", "/api/cron/daily-emails"],
      ],
      note: "Three front doors, one backend",
      step: {
        title: "One backend, three front doors",
        text: "The web app, an Expo mobile app and a Telegram bot all use the same API. Scheduled jobs post questions and send lifecycle emails.",
        facts: ["Telegram: daily question, weekly summary, channel posts and cleanup", "9 scheduled endpoints run on cron"],
      },
    },
    {
      name: "API",
      role: "Where the rules live",
      kind: "rows",
      rows: [
        ["GET", "/api/questions"],
        ["GET", "/api/questions/:id/explanation"],
        ["GET", "/api/user-subscription/:userId"],
        ["GET", "/invoice/:gatewayRef.pdf"],
        ["POST", "/webhook"],
        ["GET", "/admin/analytics"],
        ["GET", "/api/public/stats"],
      ],
      note: "150 route handlers in one Express app",
      step: {
        title: "150 route handlers",
        text: "Auth, quizzes, explanations, subscriptions, invoices, admin analytics and cron, in one Express app on Vercel.",
        facts: ["Payment webhooks confirm and activate subscriptions", "A PDF invoice is generated for each payment"],
      },
    },
    {
      name: "Database",
      role: "What is remembered",
      kind: "rows",
      rows: [
        ["TABLE", "user_question_progress"],
        ["TABLE", "payment_events"],
        ["TABLE", "funnel_events"],
        ["TABLE", "page_engagement"],
        ["TABLE", "login_history"],
        ["TABLE", "subscription_groups"],
        ["TABLE", "group_seats"],
        ["TABLE", "trial_grants"],
      ],
      note: "31 tables, built to be re-run safely",
      step: {
        title: "31 tables, safe to re-run",
        text: "PostgreSQL. The schema is created idempotently at cold start, so a fresh database and a live one end up identical.",
        facts: ["Progress, payments, funnel events and logins are tracked per user", "The medicine and nursing tracks are kept strictly separate"],
      },
    },
    {
      name: "Money and messages",
      role: "Built once, reused",
      kind: "rows",
      rows: [
        ["PAY", "Moyasar: Apple Pay, webhooks, VAT invoices"],
        ["MAIL", "Shared email gateway, Gmail fallback"],
        ["BOT", "Telegram Bot API"],
        ["HOST", "Vercel serverless functions and cron"],
      ],
      note: "One gateway serves four projects",
      step: {
        title: "Payments and email, built once",
        text: "Moyasar handles payments. Email goes through a gateway I wrote that four of my projects share, with a fallback when the daily quota runs out.",
        facts: ["Five plans: monthly, four-month, annual, and group plans for 3 and 5 seats", "The gateway has 35 automated tests"],
      },
    },
  ],
};

// ─── Projects ────────────────────────────────────────────────────
export const PROJECTS = [
  {
    id: "sqb",
    group: "prod",
    title: "SQB",
    subtitle: "Exam-prep platform for the Saudi SMLE and SNLE licensing exams",
    summary:
      "Students practise with 7,000+ questions that each have a written explanation, see where they are weak, and pay for access. I built the web app, the API, the mobile app and the Telegram bot, and I run it in production.",
    facts: [
      "Two exam tracks, medicine and nursing, with content and analytics kept separate per track.",
      "Payments through Moyasar, email through my shared gateway, and a mobile app on the same backend.",
      "Prerendered public pages took Google-indexed pages from 5 to 468.",
    ],
    stack: ["React 19", "Vite", "Express", "PostgreSQL", "Moyasar", "Expo", "Resend"],
    layers: null, // uses HERO.layers
    meta: { role: "Design and build, solo", period: "Feb 2025 to now", status: "Live" },
    href: "https://www.smle-question-bank.com",
  },
  {
    id: "hr",
    group: "prod",
    title: "Multi-branch HR platform",
    subtitle: "Employee records, payroll, absence and documents for a healthcare company",
    summary:
      "A company with 25+ branches and 600+ employees tracked people and paperwork by hand. I built the system from scratch: employee lifecycle, payroll and absence, documents with expiry alerts, student bus transport, and reports in PDF and Excel with the Hijri calendar.",
    facts: [
      "Document expiry alerts fire 30, 60 and 90 days ahead.",
      "JWT sessions, role-based access across branches, one-time codes for branch accounts.",
      "Redis caching and composite indexes on the hot queries.",
    ],
    stack: ["React 19", "Node.js", "Express", "PostgreSQL", "JWT", "Redis"],
    layers: [
      {
        name: "Interface",
        role: "What staff use",
        kind: "rows",
        rows: [
          ["PAGE", "Dashboard and branch statistics"],
          ["PAGE", "Employee file and expiry tracking"],
          ["PAGE", "Payroll and absences"],
          ["PAGE", "Bus transportation and reports"],
          ["PAGE", "Branch documents and archive"],
        ],
        note: "Private system, so no screenshot",
      },
      {
        name: "API",
        role: "18 route modules",
        kind: "rows",
        rows: [
          ["MODULE", "employees, employee-file, employee-expiry"],
          ["MODULE", "payroll-absences, bus-transportation"],
          ["MODULE", "branches, branch-documents, branch-statistics"],
          ["MODULE", "documents, archive, academic-years"],
          ["MODULE", "auth, admin, notifications, dashboard"],
        ],
        note: "Express, one module per area",
      },
      {
        name: "Access",
        role: "Who can do what",
        kind: "rows",
        rows: [
          ["AUTH", "JWT sessions"],
          ["ROLES", "Role-based access across 25+ branches"],
          ["OTP", "One-time codes for branch and user accounts"],
          ["AUDIT", "Review confirmations and year transitions"],
        ],
        note: "branch_otp_tokens, user_otp_tokens",
      },
      {
        name: "Data",
        role: "Storage and reports",
        kind: "rows",
        rows: [
          ["DB", "PostgreSQL with migrations"],
          ["CACHE", "Redis, per-route expiry"],
          ["INDEX", "Composite indexes on hot queries"],
          ["REPORT", "PDF and Excel, Hijri dates"],
        ],
        note: "Built for reports people can print",
      },
    ],
    meta: { role: "Full-stack engineer", period: "Oct 2025 to now", status: "In use at the company" },
    href: "",
    private: "Internal system with employee data, so there is no public link. I walk through it in an interview or call.",
  },
  {
    id: "shoghli",
    group: "prod",
    title: "Shoghli",
    subtitle: "Location-based job marketplace for Syria",
    summary:
      "Employers find skilled workers near them and request a call. Workers register free from an Android app. Three applications share one API and one database, with written docs for architecture, API, database and deployment.",
    facts: [
      "Employers pay through Sham Cash and upload a receipt; an admin approves it before the account works.",
      "Email verification with a four-digit code, and geographic search on PostGIS.",
      "54 route handlers across 13 API modules and 18 tables.",
    ],
    stack: ["React 18", "React Native", "Expo", "Express", "PostgreSQL", "PostGIS"],
    layers: [
      {
        name: "Employer website",
        role: "React 18 + Vite",
        kind: "rows",
        rows: [
          ["FLOW", "Register and pay through Sham Cash"],
          ["FLOW", "Upload the payment receipt"],
          ["FLOW", "Wait for admin approval"],
          ["FLOW", "Search workers nearby, request a call"],
        ],
        note: "Marketplace actions are locked until approved",
      },
      {
        name: "Worker app",
        role: "React Native + Expo Router",
        kind: "rows",
        rows: [
          ["FLOW", "Register from the Android app, free"],
          ["FLOW", "Finish onboarding"],
          ["FLOW", "Publish a profile"],
          ["FLOW", "Receive call requests"],
        ],
        note: "Same API as the website",
      },
      {
        name: "API",
        role: "13 modules, 54 handlers",
        kind: "rows",
        rows: [
          ["MODULE", "auth, users, workers"],
          ["MODULE", "jobs, categories, locations"],
          ["MODULE", "callRequests, ratings, reports"],
          ["MODULE", "employerApplications, admin"],
          ["MODULE", "notifications, settings"],
        ],
        note: "Express 4",
      },
      {
        name: "Database",
        role: "PostgreSQL + PostGIS",
        kind: "rows",
        rows: [
          ["GEO", "governorates, districts, subdistricts, villages"],
          ["DATA", "job_posts, job_categories"],
          ["DATA", "worker_profiles, employer_profiles"],
          ["DATA", "call_requests, ratings, reports"],
          ["AUTH", "email_otps, otp_codes"],
        ],
        note: "18 tables",
      },
    ],
    meta: { role: "Design and build", period: "2026", status: "Live" },
    href: "https://shoghli.vercel.app",
  },
  {
    id: "email",
    group: "prod",
    title: "Shared email gateway",
    subtitle: "One email service for four production projects",
    summary:
      "Four projects needed reliable email, but Resend's free plan allows 100 messages a day and one domain. I built one gateway that splits the quota between them and falls back to Gmail SMTP when it runs out.",
    facts: [
      "Bounces and complaints are suppressed through a webhook signed by Svix.",
      "Idempotency keys prevent duplicate sends; error alerts have a cooldown.",
      "35 automated tests in four files.",
    ],
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Resend", "Nodemailer", "Svix"],
    layers: [
      {
        name: "Public API",
        role: "What projects call",
        kind: "rows",
        rows: [
          ["POST", "/api/v1/send"],
          ["POST", "/api/v1/send/bulk"],
          ["POST", "/api/v1/notify"],
          ["GET", "/api/v1/quota"],
          ["GET", "/api/v1/messages/:id"],
        ],
        note: "Origin-checked and authenticated",
      },
      {
        name: "Quota",
        role: "Fair share",
        kind: "rows",
        rows: [
          ["QUOTA", "Splits Resend's 100 a day across projects"],
          ["FALLBACK", "Gmail SMTP when the day's quota is spent"],
          ["SAFE", "Idempotency keys stop duplicate sends"],
        ],
        note: "lib/quota.ts",
      },
      {
        name: "Suppression",
        role: "Keeping the reputation",
        kind: "rows",
        rows: [
          ["HOOK", "POST /api/webhooks/resend"],
          ["SIG", "Signed by Svix"],
          ["RULE", "Bounces and complaints suppress the address"],
          ["UNSUB", "GET /u/:token"],
        ],
        note: "lib/suppression.ts, lib/unsubscribe.ts",
      },
      {
        name: "Tests",
        role: "35 in total",
        kind: "rows",
        rows: [
          ["TEST", "client.test.ts, 8"],
          ["TEST", "origin.test.ts, 6"],
          ["TEST", "quota.test.ts, 11"],
          ["TEST", "render.test.ts, 10"],
        ],
        note: "node --test",
      },
    ],
    meta: { role: "Design and build", period: "2026", status: "Internal infrastructure" },
    href: "",
    private: "Internal infrastructure. Its admin panel shows real users' data, so there is no public link.",
  },
  {
    id: "kernel",
    group: "sites",
    title: "Kernel",
    subtitle: "Laptop finder for computer-science students in Saudi Arabia",
    summary:
      "Tell it your study track, your budget in riyals and what you will not give up, and it matches you against 40 laptops sold by 5 Saudi retailers and explains each trade-off. Its hero shows a laptop taken apart in 3D.",
    facts: ["A react-three-fiber scene with GSAP motion and Lenis smooth scrolling.", "6 study tracks, 40 laptops, 5 retailers."],
    stack: ["React", "TypeScript", "Three.js", "react-three-fiber", "GSAP", "Zustand"],
    layers: [
      { name: "Interface", role: "What visitors see", kind: "image", image: "kernel", note: "kernel-laptop-finder.vercel.app" },
      { name: "3D scene", role: "react-three-fiber", kind: "rows", rows: [["R3F", "react-three-fiber and drei"], ["3D", "A laptop shown exploded"]], note: "Three.js" },
      { name: "Motion", role: "How it moves", kind: "rows", rows: [["GSAP", "Timelines"], ["LENIS", "Smooth scrolling"]], note: "" },
      { name: "State and data", role: "What it knows", kind: "rows", rows: [["STATE", "Zustand"], ["DATA", "40 laptops"], ["DATA", "5 retailers"], ["DATA", "6 study tracks"]], note: "" },
    ],
    meta: { role: "Design and build", period: "2026", status: "Live" },
    href: "https://kernel-laptop-finder.vercel.app",
  },
  {
    id: "law",
    group: "sites",
    title: "Al-Haysoni Law Firm",
    subtitle: "Website for a law firm",
    summary: "A professional presence for a law firm, with an interactive 3D scene, a contact form that emails the office, and structured data for search engines. Freelance work, July to August 2025.",
    facts: ["React 19 and Three.js.", "Schema.org structured data, sitemap and robots.txt."],
    stack: ["React 19", "Three.js", "Vite", "Express"],
    layers: [
      { name: "Interface", role: "What visitors see", kind: "image", image: "law", note: "alhisony.com" },
      { name: "3D scene", role: "Three.js", kind: "rows", rows: [["3D", "Interactive scene on the home page"]], note: "" },
      { name: "Contact", role: "Reaches the office", kind: "rows", rows: [["FORM", "Contact form"], ["API", "Express endpoint that sends the email"]], note: "" },
      { name: "Search", role: "Being found", kind: "rows", rows: [["LD", "Schema.org structured data"], ["MAP", "sitemap.xml and robots.txt"]], note: "" },
    ],
    meta: { role: "Freelance", period: "Jul to Aug 2025", status: "Live" },
    href: "https://www.alhisony.com",
  },
  {
    id: "erth",
    group: "sites",
    title: "Erth Environmental Services",
    subtitle: "Website for an environmental consultancy",
    summary: "A bilingual (Arabic and English) site for an environmental consultancy, with Google Maps and automated intake of consultation requests. Freelance work, May to June 2025.",
    facts: ["Arabic and English interface.", "Google Maps integration and an Express API for requests."],
    stack: ["React", "Express", "Google Maps API", "Framer Motion"],
    layers: [
      { name: "Interface", role: "What visitors see", kind: "image", image: "erth", note: "erthfc.com" },
      { name: "Languages", role: "Two of them", kind: "rows", rows: [["I18N", "Arabic and English, switchable"]], note: "" },
      { name: "Maps", role: "Where the clients are", kind: "rows", rows: [["API", "Google Maps"]], note: "" },
      { name: "Requests", role: "Consultation intake", kind: "rows", rows: [["API", "Express endpoint for consultation requests"]], note: "" },
    ],
    meta: { role: "Freelance", period: "May to Jun 2025", status: "Live" },
    href: "https://erthfc.com",
  },
];

// ─── NeuroLink ───────────────────────────────────────────────────
export const NEUROLINK = {
  name: "NeuroLink",
  headline: "A camera that reads faces and hands, and does not diagnose.",
  intro:
    "NeuroLink is a prototype for early behavioural screening support in primary-care visits. A child plays a 3 minute 5 second game while a webcam measures behavioural indicators. The doctor sees only what today's session showed that the record does not already contain. The doctor decides.",
  context: "Built for Let's Pitch It 2026 (GDG Qassim). It is a prototype, not a medical device, and it has not been clinically validated.",
  scrollCue: "Scroll to follow one frame through it.",
  overview: "Five stages, from the camera to the doctor.",
  outro: "The repository is private. I demo it live in an interview or a call.",
  facts: [
    { value: "478", label: "face landmarks per frame, including both irises" },
    { value: "21", label: "landmarks per hand" },
    { value: "6", label: "game blocks, 3:05 in total" },
  ],
  layers: [
    {
      name: "Camera and landmarks",
      role: "What the camera sees",
      kind: "rows",
      rows: [
        ["CAM", "One getUserMedia call site"],
        ["FACE", "478 landmarks with irises"],
        ["HAND", "21 landmarks per hand"],
        ["RUN", "MediaPipe WASM, on the device"],
        ["FALLBACK", "GPU first, then CPU"],
      ],
      note: "Pinned to MediaPipe 0.10.18",
      step: {
        title: "The camera stays on the device",
        text: "Face and hand landmarks are extracted in the browser with MediaPipe. A build check fails if anything except one file touches the camera.",
        facts: ["Model files are pinned because the 'latest' path changes in place", "Virtual cameras are detected and avoided"],
      },
    },
    {
      name: "Features",
      role: "One typed frame per video frame",
      kind: "rows",
      rows: [
        ["HEAD", "headYaw, headPitch, headRoll"],
        ["GAZE", "gazeRegion, gazeConf"],
        ["EYES", "blinkLeft, blinkRight, eyesOpen"],
        ["FACE", "jawOpen, smile, browRaise"],
        ["HANDS", "extended[5], isPoint, bearing"],
        ["STATE", "pointing, onTask, distanceCm"],
      ],
      note: "features.ts",
      step: {
        title: "A small typed frame",
        text: "Raw landmarks become one small object: head pose, gaze region, blinks, smile and brow, and per-finger extension with pointing.",
        facts: ["Rolling session stats: attention stability, look-away count, blink count"],
      },
    },
    {
      name: "Protocol",
      role: "Fixed timing, on purpose",
      kind: "rows",
      rows: [
        ["B0", "calib, 20 s"],
        ["B1", "social, 40 s"],
        ["B2", "name, 30 s"],
        ["B3", "point, 40 s"],
        ["B4", "wave, 25 s"],
        ["B5", "bubbles, 30 s"],
      ],
      note: "3 min 5 s in total",
      step: {
        title: "A game built as an instrument",
        text: "Six blocks with fixed timing, so every measure is defined against a timestamped stimulus and old sessions stay comparable.",
        facts: ["Block B1 approximates a published paradigm with a webcam and does not claim the original's validation"],
      },
    },
    {
      name: "Scoring",
      role: "Every number has a source",
      kind: "rows",
      rows: [
        ["API", "FastAPI and SQLite engine"],
        ["NORMS", "norms_v1.json, age norms"],
        ["RULE", "Each field records its provenance"],
        ["UI", "The interface must show the source"],
      ],
      note: "analysis/thresholds.ts, engine/app/norms",
      step: {
        title: "Every number shows where it came from",
        text: "Thresholds live in a norms file where each field records its provenance. The scoring layer must echo the source it used, and the interface must render it.",
        facts: ["A number whose origin the software will not show is a number it must not show"],
      },
    },
    {
      name: "Physician view",
      role: "The doctor decides",
      kind: "rows",
      rows: [
        ["SHOWS", "Only the difference from the record"],
        ["ACT", "Add to record"],
        ["ACT", "Request referral"],
        ["ACT", "Dismiss"],
        ["NEVER", "Diagnose or name a condition"],
      ],
      note: "The physician's decision is final",
      step: {
        title: "It does not diagnose",
        text: "The physician sees what today's session showed that the record does not already contain, as one notification with three choices.",
        facts: ["A build check fails if the bundle contains condition-naming vocabulary"],
      },
    },
  ],
};

// ─── Experience, skills, about ───────────────────────────────────
export const EXPERIENCE = [
  {
    id: "hr",
    role: "Full-stack software engineer",
    org: "Ultimate Care Rehabilitation Co.",
    note: "Healthcare, 25+ branches",
    dates: "Oct 2025 to now",
    items: [
      "Designed and built an HR system from scratch for 600+ employees: lifecycle, payroll, absence, documents and student transport.",
      "Implemented JWT authentication with multi-level roles, caching and composite indexes.",
      "Automated document-expiry alerts and PDF and Excel reports with Hijri dates.",
    ],
  },
  {
    id: "sqb",
    role: "Full-stack developer",
    org: "SQB",
    note: "Exam-prep platform I run",
    dates: "Feb 2025 to now",
    items: [
      "Built the platform, API, database, mobile app and Telegram bot, and run them in production.",
      "Integrated Moyasar payments with webhook-driven activation and VAT invoices.",
      "Prerendered public content for crawlers: Google-indexed pages rose from 5 to 468.",
    ],
  },
  {
    id: "law",
    role: "Web developer (freelance)",
    org: "Al-Haysoni Law Firm",
    note: "",
    dates: "Jul to Aug 2025",
    items: ["Delivered a site with an interactive Three.js scene and Schema.org structured data."],
  },
  {
    id: "erth",
    role: "Web developer (freelance)",
    org: "Erth Environmental Services",
    note: "",
    dates: "May to Jun 2025",
    items: ["Built a bilingual site with Google Maps and automated consultation-request intake."],
  },
];

export const SKILLS = [
  { group: "Languages", items: [["JavaScript", "Every project"], ["TypeScript", "Email gateway, NeuroLink, Kernel"], ["Python", "NeuroLink engine (FastAPI)"], ["SQL", "PostgreSQL in SQB, HR, Shoghli"]] },
  { group: "Front end", items: [["React 18 and 19", "Every project"], ["Three.js, react-three-fiber", "This site, Kernel, Al-Haysoni"], ["GSAP", "Kernel"], ["Right-to-left layouts", "SQB, HR, Shoghli"]] },
  { group: "Back end", items: [["Node.js, Express", "SQB, HR, Shoghli"], ["FastAPI", "NeuroLink"], ["PostgreSQL, PostGIS", "SQB, HR, Shoghli"], ["Redis", "HR"]] },
  { group: "Mobile and integrations", items: [["React Native, Expo", "SQB, Shoghli"], ["Moyasar payments", "SQB"], ["Resend, Nodemailer, Svix", "Email gateway"], ["MediaPipe", "NeuroLink"]] },
  { group: "Operating", items: [["Git", "573 commits in SQB alone"], ["Vercel", "18 projects"], ["SEO and Search Console", "SQB: 5 to 468 indexed pages"], ["Automated tests", "Email gateway: 35"]] },
];

export const ABOUT = {
  lead: "I am a software engineer in Qassim, Saudi Arabia, finishing a Computer Science degree at Qassim University in June 2027.",
  body: [
    "I like systems that have to keep working: payments that must not double-charge, schedules that must run, documents that must not expire unnoticed. So I build the whole thing, from the database to the interface, and I stay on after launch.",
    "I work in Arabic and English, and I am comfortable with right-to-left interfaces, which is most of what I have shipped.",
  ],
  habits: [
    ["I write things down", "Shoghli has architecture, API, database and deployment docs. NeuroLink has a spec, a protocol and a sources file."],
    ["I test what matters", "The email gateway has 35 automated tests. NeuroLink has build checks that enforce its own promises."],
    ["I measure", "SQB's indexed pages, visitors and search clicks come from Search Console and Vercel, and are dated on this page."],
  ],
};
