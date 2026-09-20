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
  "Full-stack software engineer. I build and run production systems with React, Node.js and PostgreSQL: an exam platform, an HR system for 25+ branches, a job marketplace, and an in-browser face and hand tracking prototype. Watch each one get built, layer by layer.";

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

// ─── The hero: SQB, built layer by layer as you scroll ───────────
// Modules are listed in build order, bottom of the stack first. `visual` picks the
// 3D scene the module plays (see components/Assembly/visuals). `step` is the plain
// language caption. `rows` are [tag, text] technical details, shown only in the
// collapsed "Technical details" panel, never in the 3D scene.
export const HERO = {
  eyebrow: "Open to full-time roles and freelance work",
  headline: "I build systems people use, then keep them running.",
  scrollCue: "Scroll to watch one get built: SQB, an exam platform I run.",
  outro: "That is SQB, built and run by me. Here are the other systems.",
  layers: [
    {
      name: "Data",
      role: "What is remembered",
      visual: "vault",
      rows: [
        ["DB", "PostgreSQL, 31 tables"],
        ["TABLE", "user_question_progress"],
        ["TABLE", "payment_events"],
        ["TABLE", "funnel_events"],
        ["TABLE", "page_engagement"],
        ["TABLE", "login_history"],
        ["TABLE", "subscription_groups, group_seats, trial_grants"],
        ["SCHEMA", "Created idempotently at cold start, safe to re-run"],
      ],
      note: "The medicine and nursing tracks are kept strictly separate",
      step: {
        title: "It starts with the data",
        text: "Thousands of exam questions, every student's progress and every payment live in one database, designed so a brand-new copy and the live one always match.",
        facts: ["7,000+ questions, each with a written explanation (7,115 on 17 Sep 2026)", "Medicine and nursing kept strictly apart"],
      },
    },
    {
      name: "Engine",
      role: "Where the rules live",
      visual: "engine",
      rows: [
        ["API", "One Express app, 150 route handlers"],
        ["GET", "/api/questions"],
        ["GET", "/api/questions/:id/explanation"],
        ["GET", "/api/user-subscription/:userId"],
        ["GET", "/admin/analytics"],
        ["APP", "Expo / React Native, same backend"],
        ["BOT", "Telegram: daily question, weekly summary"],
        ["CRON", "9 scheduled endpoints (Telegram, lifecycle and daily emails)"],
      ],
      note: "Vercel serverless functions and cron",
      step: {
        title: "One brain, three front doors",
        text: "The website, a mobile app and a Telegram bot all talk to the same backend, so a rule is written once and holds everywhere. Scheduled jobs post a daily question and send reminders.",
        facts: ["Web, Expo mobile app and Telegram bot share one API", "Telegram gets a daily question and a weekly summary"],
      },
    },
    {
      name: "Money and messages",
      role: "Built once, reused",
      visual: "money",
      rows: [
        ["PAY", "Moyasar: Apple Pay, webhooks"],
        ["POST", "/webhook confirms and activates the subscription"],
        ["GET", "/invoice/:gatewayRef.pdf (VAT invoice)"],
        ["MAIL", "Shared email gateway, Gmail SMTP fallback"],
        ["BOT", "Telegram Bot API"],
      ],
      note: "One email gateway serves four projects",
      step: {
        title: "Payments and email, handled",
        text: "When a student pays, Moyasar confirms it, the subscription switches on and a VAT invoice is generated as a PDF. Email goes out through a gateway I built that four of my projects share.",
        facts: ["Five plans: monthly, four-month, annual, and group plans for 3 and 5 seats", "The email gateway has 35 automated tests"],
      },
    },
    {
      name: "Search",
      role: "Being found",
      visual: "search",
      rows: [
        ["BUILD", "Public pages prerendered so crawlers read real content"],
        ["GSC", "468 indexed pages on 16 Sep 2026, from 5 on 30 Aug"],
        ["GSC", "734 clicks and 13.1K impressions in 90 days"],
      ],
      note: "Source: Google Search Console",
      step: {
        title: "Found by search engines",
        text: "The public pages are prerendered, so Google reads real content instead of an empty shell. Every lit page is one Google now knows about.",
        facts: ["Indexed pages went from 5 to 468 between 30 Aug and 16 Sep 2026", "734 clicks from Google search in 90 days"],
      },
    },
    {
      name: "Interface",
      role: "What people see",
      visual: "screen",
      image: "sqb",
      rows: [
        ["UI", "React 19 and Vite, right-to-left Arabic"],
        ["URL", "smle-question-bank.com"],
      ],
      note: "",
      step: {
        title: "And finally, what students see",
        text: "The finished product: a React 19 interface built right-to-left for Arabic, with practice questions, explanations and a plan for each student.",
        facts: ["1,001 visitors and 4,262 page views in the last 30 days", "Live at smle-question-bank.com"],
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
    image: "sqb",
    layers: null, // uses HERO.layers
    meta: { role: "Design and build, solo", period: "Feb 2025 to now", status: "Live" },
    href: "https://www.smle-question-bank.com",
  },
  {
    id: "hr",
    group: "prod",
    diagram: "branches",
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
    diagram: "nearby",
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
    diagram: "gateway",
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
    id: "law",
    group: "sites",
    image: "law",
    title: "Al-Haysoni Law Firm",
    subtitle: "Website for a law firm",
    summary: "A professional presence for a law firm, with an interactive 3D scene, a contact form that emails the office, and structured data for search engines. Freelance work, July to August 2025.",
    facts: ["React 19 and Three.js.", "Schema.org structured data, sitemap and robots.txt."],
    stack: ["React 19", "Three.js", "Vite", "Express"],
    layers: [
      { name: "3D scene", role: "Three.js", rows: [["3D", "Interactive scene on the home page"]], note: "" },
      { name: "Contact", role: "Reaches the office", rows: [["FORM", "Contact form"], ["API", "Express endpoint that sends the email"]], note: "" },
      { name: "Search", role: "Being found", rows: [["LD", "Schema.org structured data"], ["MAP", "sitemap.xml and robots.txt"]], note: "" },
    ],
    meta: { role: "Freelance", period: "Jul to Aug 2025", status: "Live" },
    href: "https://www.alhisony.com",
  },
  {
    id: "erth",
    group: "sites",
    image: "erth",
    title: "Erth Environmental Services",
    subtitle: "Website for an environmental consultancy",
    summary: "A bilingual (Arabic and English) site for an environmental consultancy, with Google Maps and automated intake of consultation requests. Freelance work, May to June 2025.",
    facts: ["Arabic and English interface.", "Google Maps integration and an Express API for requests."],
    stack: ["React", "Express", "Google Maps API", "Framer Motion"],
    layers: [
      { name: "Languages", role: "Two of them", rows: [["I18N", "Arabic and English, switchable"]], note: "" },
      { name: "Maps", role: "Where the clients are", rows: [["API", "Google Maps"]], note: "" },
      { name: "Requests", role: "Consultation intake", rows: [["API", "Express endpoint for consultation requests"]], note: "" },
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
  scrollCue: "Scroll to watch it get built, part by part.",
  outro: "The repository is private. I demo it live in an interview or a call.",
  facts: [
    { value: "478", label: "face landmarks per frame, including both irises" },
    { value: "21", label: "landmarks per hand" },
    { value: "6", label: "game blocks, 3:05 in total" },
  ],
  layers: [
    {
      name: "Camera",
      role: "What the camera sees",
      visual: "webcam",
      rows: [
        ["CAM", "One getUserMedia call site"],
        ["RUN", "MediaPipe WASM, on the device"],
        ["FALLBACK", "GPU first, then CPU"],
        ["PIN", "Model files pinned to MediaPipe 0.10.18"],
      ],
      note: "A build check fails if anything but one file touches the camera",
      step: {
        title: "It starts with a webcam",
        text: "A child plays a short game while the webcam watches. The video never leaves the device: face and hand tracking run in the browser.",
        facts: ["Runs on the device with MediaPipe", "A build check fails if anything except one file touches the camera"],
      },
    },
    {
      name: "Hands",
      role: "21 points per hand",
      visual: "hand",
      rows: [
        ["HAND", "21 landmarks per hand"],
        ["HANDS", "extended[5], isPoint, bearing"],
        ["STATE", "pointing, onTask, distanceCm"],
      ],
      note: "features.ts",
      step: {
        title: "Hands: 21 points each",
        text: "Every frame the browser finds 21 landmarks on the hand, enough to tell an open hand from a point, a wave or a fist.",
        facts: ["Pointing and waving are checked against what the game asked for"],
      },
    },
    {
      name: "Face",
      role: "478 points",
      visual: "face",
      rows: [
        ["FACE", "478 landmarks with irises"],
        ["HEAD", "headYaw, headPitch, headRoll"],
        ["GAZE", "gazeRegion, gazeConf"],
        ["EYES", "blinkLeft, blinkRight, eyesOpen"],
        ["FACE", "jawOpen, smile, browRaise"],
      ],
      note: "features.ts",
      step: {
        title: "Faces: 478 points",
        text: "478 landmarks, including both irises, give the head turn, where the child is looking, blinks and expression, all condensed into one small record per frame.",
        facts: ["Head pose, gaze region, blinks, smile and brow raise"],
      },
    },
    {
      name: "The game",
      role: "Fixed timing, on purpose",
      visual: "protocol",
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
        text: "Six timed blocks, 3 minutes 5 seconds in total. Every measure is tied to a timestamped moment, so sessions stay comparable with each other.",
        facts: ["The social-attention block approximates a published paradigm with a webcam and does not claim the original's validation"],
      },
    },
    {
      name: "The doctor",
      role: "The doctor decides",
      visual: "physician",
      rows: [
        ["API", "FastAPI and SQLite engine"],
        ["NORMS", "norms_v1.json, age norms"],
        ["RULE", "Each field records its provenance"],
        ["ACT", "Add to record, Request referral, Dismiss"],
        ["NEVER", "Diagnose or name a condition"],
      ],
      note: "analysis/thresholds.ts, engine/app/norms",
      step: {
        title: "The doctor decides",
        text: "The physician sees only what today's session showed that the record does not already contain, as one notification with three choices: add to the record, request a referral, or dismiss. It never diagnoses.",
        facts: ["Every number shows where it came from", "A build check fails if the code contains condition-naming vocabulary"],
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
  { group: "Languages", items: [["JavaScript", "Every project"], ["TypeScript", "Email gateway, NeuroLink"], ["Python", "NeuroLink engine (FastAPI)"], ["SQL", "PostgreSQL in SQB, HR, Shoghli"]] },
  { group: "Front end", items: [["React 18 and 19", "Every project"], ["Three.js, react-three-fiber", "This site, Al-Haysoni"], ["Scroll-driven 3D animation", "This site"], ["Right-to-left layouts", "SQB, HR, Shoghli"]] },
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
