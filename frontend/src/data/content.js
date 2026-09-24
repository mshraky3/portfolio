// Single source of truth for everything the portfolio states about itself.
// Every number is either read from a dashboard named in `source`, or counted
// from the code named in `evidence`. Do not add a figure without one of the two.
// The build (vite.config.js) also reads this file to write the page head and the
// crawler HTML, so it stays plain data: images are keys resolved in images.js.

export const SITE = {
  url: "https://alshraky.xyz",
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
  "Full-stack software engineer. I build and run production systems with React, Node.js and PostgreSQL: an exam platform, an HR system for 25+ branches, a shared email gateway, and an in-browser face and hand tracking prototype. Watch each one get built, layer by layer.";

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

export const SCALE_FACTS = [
  { value: "7,000+", label: "SQB questions, each explained", evidence: "SQB home page showed 7,115 on 17 Sep 2026" },
  { value: "573", label: "commits to SQB", evidence: "git rev-list --count HEAD" },
  { value: "150", label: "API routes in SQB", evidence: "counted in backend/app.js and backend/routes" },
  { value: "31", label: "database tables in SQB", evidence: "CREATE TABLE IF NOT EXISTS statements" },
  { value: "25+", label: "branches on the HR system", evidence: "my CV; healthcare company" },
  { value: "35", label: "tests on the email gateway", evidence: "tests/*.test.ts" },
];

// ─── The hero: how I build a system, part by part as you scroll ──
// Parts are listed in build order, bottom of the stack first. `visual` picks the
// 3D scene the part plays (see components/Assembly/visuals). `step` is the plain
// language caption; each fact names the project it comes from and is sourced
// elsewhere in this file. The hero is general, so it has no technical rows.
export const HERO = {
  eyebrow: "Open to full-time roles and freelance work",
  headline: "I build systems people use, then keep them running.",
  scrollCue: "Scroll to watch how I build a system, part by part.",
  outro: "That is how I build. Here are four systems built that way.",
  layers: [
    {
      name: "Plan",
      visual: "blueprint",
      step: {
        title: "It starts on paper",
        text: "Before any code: who uses it, what must never go wrong, and what the data looks like. The plan is drawn first, then built on.",
        facts: ["NeuroLink began as a written spec, a test protocol and a sources file", "SQB keeps its medicine and nursing tracks strictly apart"],
      },
    },
    {
      name: "Data",
      visual: "vault",
      step: {
        title: "Then the data",
        text: "One database holds everything that has to be remembered, designed so a brand-new copy and the live one always match.",
        facts: ["SQB: 31 tables, created by a schema that is safe to re-run", "HR: PostgreSQL with migrations and indexes on the hot queries"],
      },
    },
    {
      name: "Rules",
      visual: "sorter",
      step: {
        title: "Rules in one place",
        text: "Every request passes through one core that applies the rules once, so the website, the app and the bot cannot disagree. A request that breaks a rule is refused.",
        facts: ["SQB: 150 route handlers behind one API", "The web app, the mobile app and the Telegram bot all use it"],
      },
    },
    {
      name: "Access",
      visual: "gate",
      step: {
        title: "Everyone gets the right door",
        text: "Signing in says who you are; your role says how far you get. A branch manager sees one branch, an administrator sees them all.",
        facts: ["HR: role-based access across 25+ branches", "One-time codes for branch accounts"],
      },
    },
    {
      name: "Interface",
      visual: "wireframe",
      step: {
        title: "Then what people see",
        text: "The interface goes on last, on top of everything underneath: the same data and rules on a laptop and on a phone, right-to-left where the users read Arabic.",
        facts: ["SQB and HR: right-to-left Arabic interfaces", "SQB: a web app and an Expo mobile app on one backend"],
      },
    },
    {
      name: "Running",
      visual: "pulse",
      step: {
        title: "Then I keep it running",
        text: "Launch is the middle, not the end. Scheduled jobs run on time, tests guard the parts that must not break, and dashboards show whether people find it.",
        facts: ["SQB: 9 scheduled jobs; 5 to 468 Google-indexed pages between 30 Aug and 16 Sep 2026", "Email gateway: 35 automated tests"],
      },
    },
  ],
};

// ─── Systems: one scroll-built chapter each ──────────────────────
// Same shape as the hero. `short` labels the chapter, `turn` varies the camera
// a little per chapter, `extraTech` adds rows to "Technical details" that have
// no scene of their own. Rows are [tag, text] and never appear in the 3D.
export const PROJECTS = [
  {
    id: "sqb",
    group: "prod",
    short: "SQB",
    rig: "path",
    cue: "Scroll to follow a student through it.",
    turn: 0,
    title: "SQB",
    subtitle: "Exam-prep platform for the Saudi SMLE and SNLE licensing exams",
    summary:
      "7,000+ practice questions with explanations for Saudi licensing exams. I built the web app, API, mobile app and Telegram bot, and I run it.",
    outro: "SQB is live, and I still run it.",
    facts: [
      "7,000+ questions, each with a written explanation (7,115 on 17 Sep 2026).",
      "Two exam tracks, medicine and nursing, with content and analytics kept separate per track.",
      "Prerendered public pages took Google-indexed pages from 5 to 468.",
    ],
    stack: ["React 19", "Vite", "Express", "PostgreSQL", "Moyasar", "Expo", "Telegram Bot API"],
    extraTech: [
      {
        name: "Data",
        rows: [
          ["DB", "PostgreSQL, 31 tables"],
          ["TABLE", "user_question_progress"],
          ["TABLE", "payment_events"],
          ["TABLE", "funnel_events, page_engagement, login_history"],
          ["TABLE", "subscription_groups, group_seats, trial_grants"],
          ["SCHEMA", "Created idempotently at cold start, safe to re-run"],
        ],
        note: "The medicine and nursing tracks are kept strictly separate",
      },
    ],
    layers: [
      {
        name: "Search",
        visual: "search",
        rows: [
          ["BUILD", "Public pages prerendered so crawlers read real content"],
          ["GSC", "468 indexed pages on 16 Sep 2026, from 5 on 30 Aug"],
          ["GSC", "734 clicks and 13.1K impressions in 90 days"],
        ],
        note: "Source: Google Search Console",
        step: {
          title: "It starts with a search",
          text: "Students find SQB on Google. Its public pages are prerendered, so search engines read real content. Every lit tile is a page Google knows.",
          facts: ["Indexed pages went from 5 to 468 between 30 Aug and 16 Sep 2026", "734 clicks from Google search in 90 days"],
        },
      },
      {
        name: "Interface",
        visual: "screen",
        image: "sqb",
        rows: [
          ["UI", "React 19 and Vite, right-to-left Arabic"],
          ["URL", "smle-question-bank.com"],
        ],
        note: "",
        step: {
          title: "Then they practise",
          text: "Practice questions, explanations and a plan for each student, in a right-to-left interface built for Arabic readers.",
          facts: ["1,001 visitors and 4,262 page views in the 30 days to 19 Sep 2026", "Live at smle-question-bank.com"],
        },
      },
      {
        name: "Payments",
        visual: "money",
        rows: [
          ["PAY", "Moyasar: Apple Pay, webhooks"],
          ["POST", "/webhook confirms and activates the subscription"],
          ["GET", "/invoice/:gatewayRef.pdf (VAT invoice)"],
          ["MAIL", "Shared email gateway, Gmail SMTP fallback"],
        ],
        note: "Email goes through the shared gateway below",
        step: {
          title: "Then they subscribe",
          text: "When a student pays, Moyasar confirms it, the subscription switches on and a VAT invoice is generated as a PDF. The receipt email goes out through the gateway I built for my projects.",
          facts: ["Five plans: monthly, four-month, annual, and group plans for 3 and 5 seats", "Webhook-driven activation, VAT invoice as a PDF"],
        },
      },
      {
        name: "Engine",
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
          title: "And they come back",
          text: "The website, a mobile app and a Telegram bot all run on one backend. A daily question and reminders bring students back.",
          facts: ["Web, Expo mobile app and Telegram bot share one API", "Telegram gets a daily question and a weekly summary"],
        },
      },
    ],
    meta: { role: "Design and build, solo", period: "Feb 2025 to now", status: "Live" },
    href: "https://www.smle-question-bank.com",
  },
  {
    id: "hr",
    group: "prod",
    short: "HR",
    rig: "orbit",
    cue: "Scroll: the company is the planet, its tools orbit it.",
    turn: 0.35,
    title: "Multi-branch HR platform",
    subtitle: "Employee records, payroll, absence and documents for a healthcare company",
    summary:
      "A healthcare company with 25+ branches ran its staff on paper. I built its system from scratch: people, payroll, documents, buses and reports.",
    outro: "In use at the company, across its branches.",
    facts: [
      "Document expiry alerts fire 30, 60 and 90 days ahead.",
      "JWT sessions, role-based access across branches, one-time codes for branch accounts.",
      "Redis caching and composite indexes on the hot queries.",
    ],
    stack: ["React 19", "Node.js", "Express", "PostgreSQL", "JWT", "Redis"],
    extraTech: [
      {
        name: "Access",
        rows: [
          ["AUTH", "JWT sessions"],
          ["ROLES", "Role-based access across 25+ branches"],
          ["OTP", "One-time codes for branch and user accounts"],
          ["AUDIT", "Review confirmations and year transitions"],
        ],
        note: "branch_otp_tokens, user_otp_tokens",
      },
    ],
    layers: [
      {
        name: "Branches",
        visual: "globe",
        rows: [
          ["MODULE", "branches, branch-documents, branch-statistics"],
          ["MODULE", "bus-transportation"],
          ["PAGE", "Dashboard and branch statistics"],
          ["API", "18 route modules, one per area"],
        ],
        note: "Express",
        step: {
          title: "25+ branches, one system",
          text: "Every branch reports to one system: one set of employee records, one set of rules, and the buses that carry the students.",
          facts: ["25+ branches of a healthcare company", "Student bus transport tracked alongside staff"],
        },
      },
      {
        name: "Expiry",
        visual: "expiry",
        rows: [
          ["MODULE", "employees, employee-file, employee-expiry"],
          ["MODULE", "documents, archive, notifications"],
          ["ALERT", "30, 60 and 90 days before expiry"],
        ],
        note: "Private system, so no screenshot",
        step: {
          title: "Nothing expires unnoticed",
          text: "Every employee file carries documents with expiry dates. Alerts fire 90, 60 and 30 days before one runs out, so renewals happen before the deadline, not after.",
          facts: ["Alerts at 90, 60 and 30 days"],
        },
      },
      {
        name: "Payroll",
        visual: "payroll",
        rows: [
          ["MODULE", "payroll-absences, academic-years"],
          ["PAGE", "Payroll and absences"],
        ],
        note: "",
        step: {
          title: "Payroll and absence, month by month",
          text: "Attendance and absences add up to each month's payroll, per employee and per branch, with Hijri dates where people expect them.",
          facts: ["Payroll, absence and year transitions in one place"],
        },
      },
      {
        name: "Reports",
        visual: "reports",
        rows: [
          ["DB", "PostgreSQL with migrations"],
          ["CACHE", "Redis, per-route expiry"],
          ["INDEX", "Composite indexes on hot queries"],
          ["REPORT", "PDF and Excel, Hijri dates"],
        ],
        note: "Built for reports people can print",
        step: {
          title: "Reports people can print",
          text: "Payroll, absence and branch reports come out as PDF and Excel files, ready to print, sign or send on.",
          facts: ["PDF and Excel, with Hijri dates", "Redis caching and composite indexes keep them fast"],
        },
      },
    ],
    meta: { role: "Full-stack engineer", period: "Oct 2025 to now", status: "In use at the company" },
    href: "",
    private: "Internal system with employee data, so there is no public link. I walk through it in an interview or call.",
  },
  {
    id: "neurolink",
    group: "prod",
    short: "NeuroLink",
    rig: "tunnel",
    cue: "Scroll to fly through the camera's eye.",
    turn: -0.3,
    title: "NeuroLink",
    subtitle: "A camera that reads faces and hands, and does not diagnose",
    summary:
      "A child plays a 3-minute game while the webcam measures behaviour, all in the browser. The doctor sees only what is new, and decides.",
    note: "Built for Let's Pitch It 2026 (GDG Qassim). It is a prototype, not a medical device, and it has not been clinically validated.",
    outro: "The repository is private. I demo it live in an interview or a call.",
    stats: [
      { value: "478", label: "face landmarks per frame, including both irises" },
      { value: "21", label: "landmarks per hand" },
      { value: "6", label: "game blocks, 3:05 in total" },
    ],
    facts: [
      "Face and hand tracking run in the browser; the video never leaves the device.",
      "Build checks fail if anything but one file touches the camera, or if the code names a condition.",
    ],
    stack: ["TypeScript", "MediaPipe", "Python", "FastAPI", "SQLite"],
    layers: [
      {
        name: "Camera",
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
    meta: { role: "Design and build", period: "2026", status: "Prototype" },
    href: "",
    private: "The repository is private. I run it live in an interview or a call.",
  },
  {
    id: "email",
    group: "prod",
    short: "Email",
    rig: "explode",
    cue: "Scroll to open the machine.",
    turn: 0.2,
    title: "Shared email gateway",
    subtitle: "One email service for three of my projects",
    summary:
      "SQB, the HR system and this portfolio share one free email plan of 100 a day. This gateway splits it fairly and falls back to Gmail.",
    outro: "Quietly behind every email my projects send.",
    facts: [
      "Bounces and complaints are suppressed through a webhook signed by Svix.",
      "Idempotency keys prevent duplicate sends; error alerts have a cooldown.",
      "35 automated tests in four files.",
    ],
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Resend", "Nodemailer", "Svix"],
    layers: [
      {
        name: "One door",
        visual: "sources",
        rows: [
          ["POST", "/api/v1/send"],
          ["POST", "/api/v1/send/bulk"],
          ["POST", "/api/v1/notify"],
          ["GET", "/api/v1/quota"],
          ["GET", "/api/v1/messages/:id"],
        ],
        note: "Origin-checked and authenticated",
        step: {
          title: "Three projects, one door",
          text: "Every project sends through the same gateway instead of carrying its own mail setup. It checks where each request comes from, and turns away mail from a source it does not know.",
          facts: ["SQB, the HR system and this portfolio send through it", "Requests from unregistered origins are dropped"],
        },
      },
      {
        name: "Quota",
        visual: "quota",
        rows: [
          ["QUOTA", "Splits Resend's 100 a day across projects"],
          ["FALLBACK", "Gmail SMTP when the day's quota is spent"],
        ],
        note: "lib/quota.ts",
        step: {
          title: "A fair share of 100 a day",
          text: "Resend's free plan allows 100 emails a day. The gateway splits them between the projects, and when the day's share is spent, mail goes out through Gmail instead of failing.",
          facts: ["Gmail SMTP takes over when the quota runs out"],
        },
      },
      {
        name: "Bounces",
        visual: "suppress",
        rows: [
          ["HOOK", "POST /api/webhooks/resend"],
          ["SIG", "Signed by Svix"],
          ["RULE", "Bounces and complaints suppress the address"],
          ["SAFE", "Idempotency keys stop duplicate sends"],
          ["UNSUB", "GET /u/:token"],
        ],
        note: "lib/suppression.ts, lib/unsubscribe.ts",
        step: {
          title: "A bounce is remembered",
          text: "When an address bounces or complains, a signed report comes back and the gateway stops mailing that address. The same message sent twice goes out once.",
          facts: ["Webhook reports are verified with Svix signatures", "Idempotency keys stop duplicate sends"],
        },
      },
      {
        name: "Tests",
        visual: "tests",
        rows: [
          ["TEST", "client.test.ts, 8"],
          ["TEST", "origin.test.ts, 6"],
          ["TEST", "quota.test.ts, 11"],
          ["TEST", "render.test.ts, 10"],
        ],
        note: "node --test",
        step: {
          title: "35 tests hold it together",
          text: "The client, the origin check, the quota and the email templates are covered by 35 automated tests, so one change cannot quietly break mail for every project at once.",
          facts: ["35 tests in four files"],
        },
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
    summary: "A law firm's site with an interactive 3D scene, a contact form that reaches the office, and structured data for search.",
    facts: ["React 19 and Three.js.", "Schema.org structured data, sitemap and robots.txt."],
    stack: ["React 19", "Three.js", "Vite", "Express"],
    layers: [
      { name: "3D scene", rows: [["3D", "Interactive scene on the home page"]], note: "" },
      { name: "Contact", rows: [["FORM", "Contact form"], ["API", "Express endpoint that sends the email"]], note: "" },
      { name: "Search", rows: [["LD", "Schema.org structured data"], ["MAP", "sitemap.xml and robots.txt"]], note: "" },
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
    summary: "An Arabic site for an environmental consultancy, opening on an interactive 3D globe, with dark and light themes and a consultation form.",
    facts: ["Interactive Three.js globe with Saudi Arabia marked out.", "A fingerprint drawn from a mathematical field, not by hand."],
    stack: ["Three.js", "Vite", "JavaScript", "Google Maps"],
    layers: [
      { name: "Globe", rows: [["3D", "Three.js globe, loaded on demand"], ["GEO", "Country outlines built from TopoJSON at build time"]], note: "" },
      { name: "Print", rows: [["ART", "Fingerprint contoured from a scalar field (marching squares)"]], note: "" },
      { name: "Contact", rows: [["FORM", "Consultation request form"], ["MAP", "Google Maps link"], ["LD", "Schema.org structured data"]], note: "" },
    ],
    meta: { role: "Freelance", period: "2025, redesigned Sep 2026", status: "Live" },
    href: "https://erthfc.com",
  },
];

// ─── Experience, skills, about ───────────────────────────────────
export const EXPERIENCE = [
  {
    id: "hr",
    role: "Full-stack software engineer",
    org: "Ultimate Care Rehabilitation Co.",
    note: "Healthcare, 25+ branches",
    dates: "Oct 2025 to now",
    items: [
      "Designed and built an HR system from scratch for a company with 25+ branches: lifecycle, payroll, absence, documents and student transport.",
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
    dates: "2025, redesigned Sep 2026",
    items: ["Built the site, then redesigned it around an interactive Three.js globe."],
  },
];

export const SKILLS = [
  { group: "Languages", items: [["JavaScript", "Every project"], ["TypeScript", "Email gateway, NeuroLink"], ["Python", "NeuroLink engine (FastAPI)"], ["SQL", "PostgreSQL in SQB, HR and the email gateway"]] },
  { group: "Front end", items: [["React", "Every project"], ["Three.js, react-three-fiber", "This site, Al-Haysoni, Erth"], ["Scroll-driven 3D animation", "This site"], ["Right-to-left layouts", "SQB, HR"]] },
  { group: "Back end", items: [["Node.js, Express", "SQB, HR"], ["FastAPI", "NeuroLink"], ["PostgreSQL", "SQB, HR, email gateway"], ["Redis", "HR"]] },
  { group: "Mobile and integrations", items: [["React Native, Expo", "SQB"], ["Moyasar payments", "SQB"], ["Resend, Nodemailer, Svix", "Email gateway"], ["MediaPipe", "NeuroLink"]] },
  { group: "Operating", items: [["Git", "573 commits in SQB alone"], ["Vercel", "11 projects"], ["SEO and Search Console", "SQB: 5 to 468 indexed pages"], ["Automated tests", "Email gateway: 35"]] },
];

export const ABOUT = {
  lead: "I build the whole system, from the database to the screen, and I stay on after launch.",
  chips: ["Qassim, Saudi Arabia", "Computer Science, Qassim University, June 2027", "Arabic and English", "Open to full-time and freelance"],
};
