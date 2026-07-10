import { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import "./Tracker.css";

/*
 * PRIVATE JOB-HUNT TRACKER — local-only, passphrase-gated.
 * Reached at:  <site>/#/hq   (see SECRET_HASH in main.jsx)
 * All data lives in this browser's localStorage. Nothing is sent anywhere.
 * Use Export/Import (top-right) to back up or move to another device.
 */

const DATA_KEY = "jht_data_v1";
const PASS_KEY = "jht_pass_v1";
const LIVE_KEY = "jht_live_v1";

// Same backend the contact form uses. Override locally with VITE_API_BASE.
const API_BASE = import.meta.env.VITE_API_BASE || "https://portfolio-api-rose.vercel.app";

const STATUSES = ["Wishlist", "Applied", "Interview", "Offer", "Rejected"];
const STATUS_COLOR = {
  Wishlist: "#8a8a99",
  Applied: "#C147E9",
  Interview: "#f5a623",
  Offer: "#3ecf8e",
  Rejected: "#e05260",
};
const COURSE_STATES = ["Not started", "In progress", "Done"];

// --- seed content pulled from our KSA software-engineer plan ---
const SEED_SKILLS = [
  { id: "s1", name: "DSA / Problem-solving (LeetCode, HackerRank)", priority: "High", done: false, note: "Screened in every technical interview" },
  { id: "s2", name: "A typed/compiled language (Java or C#)", priority: "High", done: false, note: "KSA banks/gov/enterprise run these" },
  { id: "s3", name: "Automated testing (Jest, unit tests)", priority: "Medium", done: false, note: "No tests in projects = red flag" },
  { id: "s4", name: "Docker + basic CI/CD", priority: "Medium", done: false, note: "Baseline expectation" },
  { id: "s5", name: "Cloud fundamentals (AWS / Azure)", priority: "Medium", done: false, note: "KSA is cloud-first (Vision 2030)" },
  { id: "s6", name: "System design basics", priority: "Medium", done: false, note: "" },
  { id: "s7", name: "English proficiency (push past 'just below native')", priority: "Low", done: false, note: "" },
];

const SEED_COURSES = [
  { id: "c1", name: "HackerRank — Problem Solving + SQL + JS certs", url: "https://www.hackerrank.com/skills-verification", state: "Not started", cert: "" },
  { id: "c2", name: "freeCodeCamp — JS Algorithms & Data Structures", url: "https://www.freecodecamp.org/learn", state: "Not started", cert: "" },
  { id: "c3", name: "freeCodeCamp — Back End Development and APIs", url: "https://www.freecodecamp.org/learn", state: "Not started", cert: "" },
  { id: "c4", name: "Postman — API Fundamentals Student Expert", url: "https://academy.postman.com/", state: "Not started", cert: "" },
  { id: "c5", name: "CS50x (Harvard/edX) — free certificate", url: "https://cs50.harvard.edu/x/", state: "Not started", cert: "" },
  { id: "c6", name: "AWS Cloud Practitioner Essentials (Skill Builder)", url: "https://skillbuilder.aws/", state: "Not started", cert: "" },
];

/*
 * IRELAND FROM 0 — Egyptian citizen, living in KSA, CS student (grad 2027).
 * Facts verified July 2026 (citizensinformation.ie, enterprise.gov.ie, irishimmigration.ie).
 * Route: employer-sponsored Critical Skills Employment Permit (CSEP) → Stamp 4 after 2 yrs.
 */
const SEED_IRELAND = [
  // Phase 0 — Reality check
  { id: "ie01", phase: "0 · Reality check — read first", name: "Understand the route: Critical Skills Employment Permit (CSEP)", done: false,
    note: "Software developer is on Ireland's Critical Skills Occupations List. An employer sponsors you — no labour-market test, family can join immediately, Stamp 4 (work without permit) after 2 years.",
    url: "https://www.citizensinformation.ie/en/moving-country/working-in-ireland/employment-permits/green-card-permits/" },
  { id: "ie02", phase: "0 · Reality check — read first", name: "Salary floor: €40,904/year (since 1 Mar 2026)", done: false,
    note: "Your job offer must be at or above this, with a 2-year contract. Dublin junior/mid SWE pays €40–65k, so it's realistic.",
    url: "https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/permit-types/critical-skills-employment-permit/" },
  { id: "ie03", phase: "0 · Reality check — read first", name: "⚠️ The degree catch: CSEP's listed-occupation tier requires a degree — you graduate 2027", done: false,
    note: "Until then, two real paths: (1) remote contract work for Irish/EU companies from KSA NOW → income + references + inside track, (2) time the CSEP push for graduation. Fallback: General Employment Permit (experience can substitute for a degree, but it needs a labour-market test)." },
  { id: "ie04", phase: "0 · Reality check — read first", name: "Egyptian passport = visa-required: after the permit you ALSO need a long-stay 'D' employment visa", done: false,
    note: "Apply up to 3 months before travel at the Irish embassy (Cairo, or Riyadh as KSA resident). Needs contract, qualifications, and 6-month bank statements on headed paper.",
    url: "https://www.irishimmigration.ie/coming-to-work-in-ireland/what-are-my-work-visa-options/applying-for-a-long-stay-employment-visa/employment-visa/" },

  // Phase 1 — Foundation (from KSA, this month)
  { id: "ie11", phase: "1 · Foundation (this month, from KSA)", name: "Irish-format CV: 2 pages max, no photo, no age/nationality", done: false,
    note: "Lead with projects + metrics (600+ employee HR system, 8,000+ question SMLE platform)." },
  { id: "ie12", phase: "1 · Foundation (this month, from KSA)", name: "LinkedIn: add Ireland to 'Open to Work' locations + 'open to relocation, visa sponsorship required'", done: false },
  { id: "ie13", phase: "1 · Foundation (this month, from KSA)", name: "English interview fluency — 30 min speaking practice daily", done: false,
    note: "Irish interviews are conversational; sharp English is half the battle." },

  // Phase 2 — Target list
  { id: "ie21", phase: "2 · Build the target list", name: "Mine the official sponsor register — DETE publishes every company granted permits", done: false,
    note: "The insider move: these companies are PROVEN sponsors. Search 'software' in the latest quarter.",
    url: "https://enterprise.gov.ie/en/publications/companies-issued-with-permits-2026.html" },
  { id: "ie22", phase: "2 · Build the target list", name: "Tier-1 (big sponsors, Dublin/Cork): Google, Meta, Amazon, Microsoft, Stripe, Intercom, Workday, HubSpot, Zendesk, Salesforce, Mastercard, Apple (Cork)", done: false },
  { id: "ie23", phase: "2 · Build the target list", name: "Tier-2 (Irish product companies): Fenergo, Tines, Flipdish, Wayflyer, LearnUpon, Teamwork", done: false,
    note: "Smaller = your application actually gets read." },
  { id: "ie24", phase: "2 · Build the target list", name: "Register with Irish tech recruiters: Cpl, Morgan McKinley, Reperio, Solas IT", done: false,
    note: "Recruiters know which clients sponsor — ask them directly." },

  // Phase 3 — Apply (remote-first bridge)
  { id: "ie31", phase: "3 · Apply — remote-first bridge", name: "Apply to remote roles at Irish/EU companies you can do from KSA today", done: false,
    note: "This is the bridge: income now, Irish references, and the inside track to sponsorship later. Use the Live Jobs tab + the links below." },
  { id: "ie32", phase: "3 · Apply — remote-first bridge", name: "Daily: 3 Ireland applications through the live links below", done: false },
  { id: "ie33", phase: "3 · Apply — remote-first bridge", name: "Weekly: 5 warm messages to engineers/recruiters at target companies", done: false,
    note: "Short + specific beats mass-apply. Mention one thing about their product." },

  // Phase 4 — Interviews
  { id: "ie41", phase: "4 · Interviews", name: "DSA on a schedule (LeetCode easy→medium) — same prep as the KSA plan, two markets one effort", done: false },
  { id: "ie42", phase: "4 · Interviews", name: "Timezone is your friend: Ireland is 2h behind KSA — a 2 PM Dublin interview = 4 PM Qassim", done: false,
    note: "Fits your after-3-PM rule while you're still studying." },
  { id: "ie43", phase: "4 · Interviews", name: "Negotiate ≥ €41k so the offer clears the CSEP floor", done: false },

  // Phase 5 — Offer → paperwork
  { id: "ie51", phase: "5 · Offer → paperwork", name: "CSEP application: €1,000 fee (usually employer pays), 2-year contract, ~4–8 weeks processing", done: false,
    url: "https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/permit-types/critical-skills-employment-permit/" },
  { id: "ie52", phase: "5 · Offer → paperwork", name: "Long-stay D visa at the Irish embassy (permit + contract + qualifications + 6-month bank statements)", done: false,
    url: "https://www.irishimmigration.ie/coming-to-work-in-ireland/what-are-my-work-visa-options/applying-for-a-long-stay-employment-visa/employment-visa/" },
  { id: "ie53", phase: "5 · Offer → paperwork", name: "Book flights only after the visa is in your passport", done: false },

  // Phase 6 — Landing
  { id: "ie61", phase: "6 · Landing in Ireland", name: "Register with immigration → IRP card (€300)", done: false },
  { id: "ie62", phase: "6 · Landing in Ireland", name: "Get a PPS number (needed for payroll and tax)", done: false },
  { id: "ie63", phase: "6 · Landing in Ireland", name: "At 21 months on CSEP: apply for Stamp 4 — work for anyone, no permit. Citizenship possible after 5 years", done: false },
];

const IRELAND_LINKS = [
  { label: "LinkedIn · SWE Ireland (past week)", url: "https://www.linkedin.com/jobs/search/?keywords=software%20engineer&location=Ireland&f_TPR=r604800" },
  { label: "LinkedIn · 'visa sponsorship' Ireland", url: "https://www.linkedin.com/jobs/search/?keywords=software%20engineer%20visa%20sponsorship&location=Ireland" },
  { label: "IrishJobs.ie · software engineer", url: "https://www.irishjobs.ie/jobs/software-engineer" },
  { label: "Indeed.ie · sponsorship", url: "https://ie.indeed.com/jobs?q=software+engineer+visa+sponsorship" },
  { label: "Official sponsor register (DETE)", url: "https://enterprise.gov.ie/en/publications/companies-issued-with-permits-2026.html" },
  { label: "Critical Skills Occupations List", url: "https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/employment-permit-eligibility/highly-skilled-eligible-occupations-list/" },
];

/*
 * 12-WEEK LEARNING ROADMAP — turns "things I need to learn" into a schedule.
 * Ordered for maximum hire-signal per week: tests → TS/SQL → Docker/CI →
 * cloud → system design → interview mode. Works for KSA + Ireland + remote.
 */
const SEED_ROADMAP = [
  { id: "r01", phase: "Every day — all 12 weeks", name: "3 job applications (Live Jobs tab)", done: false,
    note: "Non-negotiable. 3/day → 90/month → interviews." },
  { id: "r02", phase: "Every day — all 12 weeks", name: "2 LeetCode problems (easy → medium)", done: false,
    url: "https://leetcode.com/problemset/" },
  { id: "r03", phase: "Every day — all 12 weeks", name: "30 min English speaking out loud", done: false,
    note: "Interviews are conversations. Record yourself answering 'tell me about your HR system'." },

  { id: "r11", phase: "Weeks 1–2 · Testing (fastest red-flag fix)", name: "Learn Jest + write tests for your portfolio backend", done: false,
    note: "'No tests in projects' filters out juniors instantly. Add real tests to the HR/SMLE repos and say so in the READMEs.",
    url: "https://jestjs.io/docs/getting-started" },
  { id: "r12", phase: "Weeks 1–2 · Testing (fastest red-flag fix)", name: "HackerRank certs: JavaScript + Problem Solving", done: false,
    note: "Free, ~1h each, instant CV/LinkedIn lines.", url: "https://www.hackerrank.com/skills-verification" },

  { id: "r21", phase: "Weeks 3–4 · TypeScript + SQL depth", name: "Convert one React project to TypeScript", done: false,
    note: "TS is in almost every serious JS job post now.", url: "https://www.typescriptlang.org/docs/handbook/intro.html" },
  { id: "r22", phase: "Weeks 3–4 · TypeScript + SQL depth", name: "HackerRank SQL cert + practice joins/window functions", done: false,
    note: "You already design schemas — make the paper prove it.", url: "https://www.hackerrank.com/skills-verification" },

  { id: "r31", phase: "Weeks 5–6 · Docker + CI/CD", name: "Dockerize your portfolio backend", done: false,
    url: "https://docker-curriculum.com/" },
  { id: "r32", phase: "Weeks 5–6 · Docker + CI/CD", name: "GitHub Actions: lint + build on every push to portfolio", done: false,
    note: "A green checkmark on your repo is a hire-signal recruiters actually see.",
    url: "https://docs.github.com/en/actions/quickstart" },

  { id: "r41", phase: "Weeks 7–8 · Cloud (KSA is cloud-first)", name: "AWS Cloud Practitioner Essentials (free on Skill Builder)", done: false,
    url: "https://skillbuilder.aws/" },
  { id: "r42", phase: "Weeks 7–8 · Cloud (KSA is cloud-first)", name: "Deploy one real thing on AWS free tier (EC2 or S3+RDS)", done: false,
    note: "'I deployed X on AWS' beats any certificate in an interview." },

  { id: "r51", phase: "Weeks 9–10 · System design basics", name: "Work through system-design-primer (GitHub)", done: false,
    url: "https://github.com/donnemartin/system-design-primer" },
  { id: "r52", phase: "Weeks 9–10 · System design basics", name: "Write a 1-page design doc for your HR system (RBAC, caching, indexing)", done: false,
    note: "Interview gold: 'here's how I designed a 25-branch system' with a diagram." },

  { id: "r61", phase: "Weeks 11–12 · Interview mode", name: "3 mock interviews in English (Pramp — free peer mocks)", done: false,
    url: "https://www.pramp.com/" },
  { id: "r62", phase: "Weeks 11–12 · Interview mode", name: "Write STAR stories for your 4 featured projects", done: false,
    note: "Situation → Task → Action → Result, with the numbers (600+ employees, 8,000+ questions)." },
  { id: "r63", phase: "Weeks 11–12 · Interview mode", name: "Salary research: KSA junior SWE + Dublin junior (≥€40,904)", done: false,
    note: "Never let 'what's your expected salary?' catch you cold." },
];

/* ================= APPLY KIT — cover letters, follow-ups, resume variants ================= */

const ME = {
  name: "Mahmoud Alshraky",
  email: "alshraky3@gmail.com",
  phone: "+966 58 261 9119",
  portfolio: "https://web-dev-seven-iota.vercel.app",
  github: "https://github.com/mshraky3",
  linkedin: "https://www.linkedin.com/in/muhmod-alshraky-350b20318",
};

const PROOF_EN = `• Enterprise HR platform (healthcare): 600+ employees across 25 branches — 25-table PostgreSQL schema, JWT + role-based access control, caching and composite indexing for sub-second responses, automated document-expiry alerts, Arabic RTL reporting.
• SMLE Question Bank (my own product): 8,000+ questions with adaptive mock tests — users measured a 2.3× proficiency improvement in 3 months.`;

const SIGNATURE_EN = `Best regards,
${ME.name}
${ME.phone} · ${ME.email}
Portfolio: ${ME.portfolio}
GitHub: ${ME.github} · LinkedIn: ${ME.linkedin}`;

const team = (company, manager) => (manager ? manager : `${company || "…"} Hiring Team`);
const joinParas = (...ps) => ps.filter(Boolean).join("\n\n");

const LETTER_TEMPLATES = {
  ksa_en: {
    label: "🇸🇦 KSA (English)",
    dir: "ltr",
    build: ({ company, role, manager, custom }) => ({
      subject: `Application for ${role || "Software Engineer"} — ${ME.name}`,
      body: joinParas(
        `Dear ${team(company, manager)},`,
        `I'm applying for the ${role || "Software Engineer"} role at ${company || "your company"}. I'm a full-stack software engineer based in Qassim, Saudi Arabia (React, Node.js, PostgreSQL), and I build production systems that real organizations run on:`,
        PROOF_EN,
        custom,
        `I'm based locally, can interview any time, and can commit to consistent daily hours — full afternoons and evenings during the semester, full-time during breaks. I deliver end to end: schema design, API, front-end, deployment.`,
        SIGNATURE_EN
      ),
    }),
  },
  ksa_ar: {
    label: "🇸🇦 السعودية (عربي)",
    dir: "rtl",
    build: ({ company, role, manager, custom }) => ({
      subject: `التقديم على وظيفة ${role || "مهندس برمجيات"} — محمود الشراكي`,
      body: joinParas(
        `السلام عليكم ورحمة الله وبركاته،`,
        `${manager ? `الأستاذ/ ${manager} المحترم،` : `فريق التوظيف في ${company || "شركتكم"} المحترمين،`}`,
        `أتقدم بطلب للانضمام إلى ${company || "شركتكم"} في وظيفة ${role || "مهندس برمجيات"}. أنا مهندس برمجيات Full-Stack مقيم في القصيم، أعمل بتقنيات React وNode.js وPostgreSQL، وقمت ببناء أنظمة إنتاجية تعمل عليها منشآت حقيقية:`,
        `• نظام موارد بشرية مؤسسي لشركة رعاية صحية يخدم أكثر من 600 موظف في 25 فرعًا — تصميم قاعدة بيانات (25 جدولًا)، صلاحيات RBAC، تنبيهات آلية لانتهاء الوثائق، وتقارير عربية.
• منصة بنك أسئلة SMLE بأكثر من 8000 سؤال واختبارات محاكية — تحسّن مقاس في مستوى المستخدمين بلغ 2.3×.`,
        custom,
        `أقيم في القصيم ويمكنني الحضور للمقابلة في أي وقت، مع التزام كامل بساعات عمل ثابتة (بعد الظهر والمساء خلال الفصل الدراسي، ودوام كامل في الإجازات).`,
        `مع خالص التحية،
محمود الشراكي
${ME.phone} · ${ME.email}
${ME.portfolio}`
      ),
    }),
  },
  ireland: {
    label: "🇮🇪 Ireland (visa-honest)",
    dir: "ltr",
    build: ({ company, role, manager, custom }) => ({
      subject: `${role || "Software Engineer"} — Full-Stack Engineer (React/Node/PostgreSQL), open to sponsorship or remote start`,
      body: joinParas(
        `Dear ${team(company, manager)},`,
        `I'm applying for the ${role || "Software Engineer"} role at ${company || "your company"}. I'm a full-stack software engineer (React, Node.js, PostgreSQL) currently based in Saudi Arabia, and I build production systems end to end:`,
        PROOF_EN,
        custom,
        `On logistics, up front: I'm an Egyptian citizen. Software developer is on Ireland's Critical Skills Occupations List, so an employer-sponsored Critical Skills Employment Permit is the standard route — and I'm equally happy to start as a remote contractor first. My timezone (UTC+3) is only 2–3 hours ahead of Dublin, so I overlap your entire business day.`,
        SIGNATURE_EN
      ),
    }),
  },
  remote: {
    label: "🌍 Remote-first",
    dir: "ltr",
    build: ({ company, role, manager, custom }) => ({
      subject: `${role || "Software Engineer"} — Remote Full-Stack Engineer (React/Node/PostgreSQL, UTC+3)`,
      body: joinParas(
        `Hi ${manager || `${company || "…"} team`},`,
        `I'm applying for the ${role || "Software Engineer"} role. I'm a remote-first full-stack engineer (React, Node.js, PostgreSQL) at UTC+3 — full overlap with European hours and 6+ hours with US-East. I build and run production systems end to end:`,
        PROOF_EN,
        custom,
        `Everything above I designed, built, deployed, and operate myself (Vercel serverless, PostgreSQL) — I'm used to owning outcomes without hand-holding, and I communicate async in fluent English.`,
        SIGNATURE_EN
      ),
    }),
  },
};

function followUpEmail(j) {
  const role = j.role || "software engineer";
  const when = j.dateApplied ? ` on ${j.dateApplied}` : " recently";
  return `Subject: Following up — ${role} application (${ME.name})

Hi ${j.company} team,

I applied for the ${role} role${when} and wanted to follow up — I'm still very interested. One thing worth adding since I applied: my enterprise HR platform now serves 600+ employees across 25 branches, and I'd be glad to walk you through how I built it (React, Node.js, PostgreSQL).

Everything is here if easier — portfolio: ${ME.portfolio} · GitHub: ${ME.github}

Best regards,
${ME.name}
${ME.phone} · ${ME.email}`;
}

const researchLinks = (company) => {
  const c = encodeURIComponent(company || "");
  return [
    ["Google", `https://www.google.com/search?q=${c}`],
    ["Careers page", `https://www.google.com/search?q=${c}+careers`],
    ["LinkedIn", `https://www.linkedin.com/search/results/companies/?keywords=${c}`],
    ["Glassdoor", `https://www.glassdoor.com/Search/results.htm?keyword=${c}`],
    ["Salaries", `https://www.google.com/search?q=site%3Alevels.fyi+OR+site%3Aglassdoor.com+${c}+salary`],
    ["IE sponsor register", "https://enterprise.gov.ie/en/publications/companies-issued-with-permits-2026.html"],
  ];
};

const RESUME_VARIANTS = [
  {
    file: "Mahmoud_Alshraky_Resume_KSA.pdf",
    flag: "🇸🇦", name: "KSA / Gulf",
    when: "Saudi companies, Gulf companies, anything via Bayt or local referrals.",
    diff: "Headline: “Software Engineer | CS Student”. Leads with local presence in Qassim.",
  },
  {
    file: "Mahmoud_Alshraky_Resume_Ireland.pdf",
    flag: "🇮🇪", name: "Ireland / EU",
    when: "Irish and EU applications, anything mentioning sponsorship.",
    diff: "Summary states the Critical Skills route + open to remote start + timezone overlap.",
  },
  {
    file: "Mahmoud_Alshraky_Resume_Remote.pdf",
    flag: "🌍", name: "Remote worldwide",
    when: "RemoteOK / WWR / Jobicy / Himalayas applications — any fully-remote role.",
    diff: "Headline: “Remote Full-Stack Software Engineer”. Summary proves async + self-managed delivery.",
  },
];

const DEFAULT_DATA = {
  jobs: [],

  skills: SEED_SKILLS,
  courses: SEED_COURSES,
  ireland: SEED_IRELAND,
  learn: SEED_ROADMAP,
  settings: { targetDate: "", dailyGoal: 7 },
};

async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

const uid = () => Math.random().toString(36).slice(2, 9);
const today = () => new Date().toISOString().slice(0, 10);

function load() {
  try {
    const raw = localStorage.getItem(DATA_KEY);
    if (!raw) return { ...DEFAULT_DATA };
    const d = JSON.parse(raw);
    return {
      jobs: d.jobs || [],
      skills: d.skills || SEED_SKILLS,
      courses: d.courses || SEED_COURSES,
      ireland: d.ireland || SEED_IRELAND,
      learn: d.learn || SEED_ROADMAP,
      settings: d.settings || DEFAULT_DATA.settings,
    };
  } catch {
    return { ...DEFAULT_DATA };
  }
}

export default function Tracker() {
  const [unlocked, setUnlocked] = useState(false);
  const [hasPass, setHasPass] = useState(false);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    setHasPass(!!localStorage.getItem(PASS_KEY));
    document.title = "HQ";
  }, []);

  async function submitPass(e) {
    e.preventDefault();
    setErr("");
    if (!hasPass) {
      if (pw.length < 4) return setErr("Use at least 4 characters.");
      if (pw !== pw2) return setErr("Passphrases don't match.");
      localStorage.setItem(PASS_KEY, await sha256(pw));
      setUnlocked(true);
      return;
    }
    const h = await sha256(pw);
    if (h === localStorage.getItem(PASS_KEY)) setUnlocked(true);
    else setErr("Wrong passphrase.");
  }

  if (!unlocked) {
    return (
      <div className="hq-gate">
        <form className="hq-gate-card" onSubmit={submitPass}>
          <div className="hq-lock">🔒</div>
          <h1>{hasPass ? "Enter passphrase" : "Create a passphrase"}</h1>
          <p className="hq-muted">
            {hasPass
              ? "Private job-hunt HQ. This device only."
              : "First time here — set a passphrase. It's stored hashed in this browser only."}
          </p>
          <input type="password" autoFocus placeholder="Passphrase" value={pw}
                 onChange={(e) => setPw(e.target.value)} />
          {!hasPass && (
            <input type="password" placeholder="Confirm passphrase" value={pw2}
                   onChange={(e) => setPw2(e.target.value)} />
          )}
          {err && <div className="hq-err">{err}</div>}
          <button type="submit">{hasPass ? "Unlock" : "Create & Enter"}</button>
          {hasPass && (
            <button type="button" className="hq-gate-reset"
              onClick={() => {
                if (!window.confirm("Reset the passphrase? Your saved jobs and checklists stay — you'll just set a new passphrase.")) return;
                localStorage.removeItem(PASS_KEY);
                setHasPass(false);
                setPw(""); setPw2(""); setErr("");
              }}>
              Forgot it? Reset passphrase (keeps your data)
            </button>
          )}
        </form>
      </div>
    );
  }
  return <Board />;
}

function Board() {
  const [data, setData] = useState(load);
  const [tab, setTab] = useState("live");
  const fileRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
  }, [data]);

  const set = (patch) => setData((d) => ({ ...d, ...patch }));

  // ---- derived stats ----
  const counts = useMemo(() => {
    const c = Object.fromEntries(STATUSES.map((s) => [s, 0]));
    data.jobs.forEach((j) => (c[j.status] = (c[j.status] || 0) + 1));
    return c;
  }, [data.jobs]);

  const appliedThisWeek = useMemo(() => {
    const wk = new Date(Date.now() - 7 * 864e5).toISOString().slice(0, 10);
    return data.jobs.filter((j) => j.dateApplied && j.dateApplied >= wk && j.status !== "Wishlist").length;
  }, [data.jobs]);

  const daysLeft = useMemo(() => {
    if (!data.settings.targetDate) return null;
    return Math.ceil((new Date(data.settings.targetDate) - new Date()) / 864e5);
  }, [data.settings.targetDate]);

  // Applications going stale: follow-up date passed, or applied 7+ days ago
  // with no follow-up scheduled. Most offers come from the follow-up, not the apply.
  const followUps = useMemo(() => {
    const t = today();
    const weekAgo = new Date(Date.now() - 7 * 864e5).toISOString().slice(0, 10);
    return data.jobs.filter(
      (j) =>
        (j.status === "Applied" || j.status === "Interview") &&
        ((j.nextFollowUp && j.nextFollowUp <= t) ||
          (!j.nextFollowUp && j.dateApplied && j.dateApplied <= weekAgo))
    );
  }, [data.jobs]);
  const followUpIds = useMemo(() => new Set(followUps.map((j) => j.id)), [followUps]);

  // "✍️ Letter" on any job card jumps here with company/role prefilled
  const [letterJob, setLetterJob] = useState(null);
  const openLetter = (job) => {
    setLetterJob({ company: job.company || "", role: job.role || "" });
    setTab("kit");
  };

  // ---- export / import ----
  function exportJSON() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `job-hunt-backup-${today()}.json`;
    a.click();
  }
  function importJSON(e) {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const d = JSON.parse(r.result);
        setData({
          jobs: d.jobs || [],
          skills: d.skills || SEED_SKILLS,
          courses: d.courses || SEED_COURSES,
          ireland: d.ireland || SEED_IRELAND,
          learn: d.learn || SEED_ROADMAP,
          settings: d.settings || DEFAULT_DATA.settings,
        });
      } catch {
        alert("Invalid backup file.");
      }
    };
    r.readAsText(f);
  }

  return (
    <div className="hq">
      <header className="hq-top">
        <div>
          <h1>Job-Hunt HQ</h1>
          <span className="hq-muted">Private · saved on this device only</span>
        </div>
        <div className="hq-actions">
          <button onClick={exportJSON}>⬇ Export</button>
          <button onClick={() => fileRef.current.click()}>⬆ Import</button>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={importJSON} />
        </div>
      </header>

      {/* stat strip */}
      <div className="hq-stats">
        <Stat label="Applied / total" value={`${data.jobs.filter((j) => j.status !== "Wishlist").length} / ${data.jobs.length}`} />
        <Stat label="Applied this week" value={appliedThisWeek} sub={`goal ${data.settings.dailyGoal}/day`} />
        <Stat label="Interviews" value={counts.Interview} accent="#f5a623" />
        <Stat label="Offers" value={counts.Offer} accent="#3ecf8e" />
        <Stat label="Follow-ups due" value={followUps.length}
              accent={followUps.length > 0 ? "#e05260" : "#3ecf8e"} />
        <Stat
          label="Days to target"
          value={daysLeft === null ? "—" : daysLeft}
          accent={daysLeft !== null && daysLeft < 10 ? "#e05260" : "#C147E9"}
        />
      </div>

      {followUps.length > 0 && (
        <div className="hq-alert">
          <span>
            ⏰ <strong>{followUps.length} application{followUps.length > 1 ? "s" : ""} going stale:</strong>{" "}
            {followUps.slice(0, 4).map((j) => j.company).join(" · ")}{followUps.length > 4 ? " …" : ""}
            {" "}— a 3-line follow-up doubles your reply rate.
          </span>
          <button onClick={() => setTab("jobs")}>Handle them →</button>
        </div>
      )}

      <div className="hq-settings">
        <label>Target date:
          <input type="date" value={data.settings.targetDate}
                 onChange={(e) => set({ settings: { ...data.settings, targetDate: e.target.value } })} />
        </label>
        <label>Daily apply goal:
          <input type="number" min="1" max="50" value={data.settings.dailyGoal}
                 onChange={(e) => set({ settings: { ...data.settings, dailyGoal: +e.target.value } })} />
        </label>
      </div>

      <nav className="hq-tabs">
        {[["live", "🔴 Live Jobs"], ["jobs", "My Pipeline"], ["kit", "🧰 Apply Kit"], ["ireland", "🇮🇪 Ireland"], ["learn", "📚 Learn"]].map(([k, t]) => (
          <button key={k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{t}</button>
        ))}
      </nav>

      {tab === "live" && <LiveJobs data={data} setData={setData} onLetter={openLetter} />}
      {tab === "jobs" && <Jobs data={data} setData={setData} counts={counts} onLetter={openLetter} followUpIds={followUpIds} />}
      {tab === "kit" && <ApplyKit prefill={letterJob} />}
      {tab === "ireland" && <Ireland data={data} setData={setData} />}
      {tab === "learn" && <Learn data={data} setData={setData} />}
    </div>
  );
}

function Stat({ label, value, sub, accent = "#C147E9" }) {
  return (
    <div className="hq-stat">
      <div className="hq-stat-val" style={{ color: accent }}>{value}</div>
      <div className="hq-stat-lbl">{label}</div>
      {sub && <div className="hq-stat-sub">{sub}</div>}
    </div>
  );
}

function Jobs({ data, setData, counts, onLetter, followUpIds }) {
  const [form, setForm] = useState({ company: "", role: "", link: "", source: "LinkedIn" });
  const [filter, setFilter] = useState("All");
  const [copiedId, setCopiedId] = useState(null);
  const [researchId, setResearchId] = useState(null);

  // Copy a ready-to-send follow-up and push the next reminder 5 days out
  const copyFollowUp = (j) => {
    navigator.clipboard.writeText(followUpEmail(j));
    upd(j.id, { nextFollowUp: new Date(Date.now() + 5 * 864e5).toISOString().slice(0, 10) });
    setCopiedId(j.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const add = (e) => {
    e.preventDefault();
    if (!form.company.trim()) return;
    const job = {
      id: uid(), ...form, status: "Wishlist",
      dateApplied: "", nextFollowUp: "", notes: "",
    };
    setData((d) => ({ ...d, jobs: [job, ...d.jobs] }));
    setForm({ company: "", role: "", link: "", source: form.source });
  };
  const upd = (id, patch) =>
    setData((d) => ({ ...d, jobs: d.jobs.map((j) => (j.id === id ? { ...j, ...patch } : j)) }));
  const del = (id) =>
    setData((d) => ({ ...d, jobs: d.jobs.filter((j) => j.id !== id) }));

  const shown = filter === "All" ? data.jobs : data.jobs.filter((j) => j.status === filter);

  return (
    <div>
      <form className="hq-jobform" onSubmit={add}>
        <input placeholder="Company *" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
        <input placeholder="Role / title" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
        <input placeholder="Job link" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
        <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}>
          {["LinkedIn", "Bayt", "Company site", "Referral", "Upwork/Freelance", "Other"].map((s) => <option key={s}>{s}</option>)}
        </select>
        <button type="submit">+ Add</button>
      </form>

      <div className="hq-filters">
        <button className={filter === "All" ? "on" : ""} onClick={() => setFilter("All")}>All ({data.jobs.length})</button>
        {STATUSES.map((s) => (
          <button key={s} className={filter === s ? "on" : ""} onClick={() => setFilter(s)}
                  style={filter === s ? { borderColor: STATUS_COLOR[s], color: STATUS_COLOR[s] } : {}}>
            {s} ({counts[s] || 0})
          </button>
        ))}
      </div>

      {shown.length === 0 && <p className="hq-muted hq-empty">No jobs here yet. Add your first target above ☝️</p>}

      <div className="hq-joblist">
        {shown.map((j) => {
          const overdue = followUpIds?.has(j.id);
          return (
          <div className="hq-job" key={j.id} style={{ borderLeftColor: overdue ? "#e05260" : STATUS_COLOR[j.status] }}>
            <div className="hq-job-head">
              <div className="hq-job-title">
                <strong>{j.company}</strong>
                {j.role && <span> — {j.role}</span>}
                {j.link && <a href={j.link} target="_blank" rel="noreferrer" className="hq-job-link">↗</a>}
                {overdue && <span className="hq-tag hq-overdue">⚠ follow-up due</span>}
              </div>
              <div className="hq-job-controls">
                <select value={j.status} onChange={(e) => {
                  const patch = { status: e.target.value };
                  if (e.target.value !== "Wishlist" && !j.dateApplied) patch.dateApplied = today();
                  upd(j.id, patch);
                }} style={{ color: STATUS_COLOR[j.status] }}>
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
                <button className="hq-del" onClick={() => del(j.id)}>✕</button>
              </div>
            </div>
            <div className="hq-job-meta">
              <span className="hq-tag">{j.source}</span>
              <label>Applied: <input type="date" value={j.dateApplied} onChange={(e) => upd(j.id, { dateApplied: e.target.value })} /></label>
              <label>Follow-up: <input type="date" value={j.nextFollowUp} onChange={(e) => upd(j.id, { nextFollowUp: e.target.value })} /></label>
            </div>
            <div className="hq-live-actions">
              <button className="hq-save" title="Copies a ready follow-up email and re-schedules the reminder +5 days"
                      onClick={() => copyFollowUp(j)}>
                {copiedId === j.id ? "✓ Copied — now send it" : "📨 Copy follow-up"}
              </button>
              <button className="hq-save" onClick={() => onLetter(j)}>✍️ Letter</button>
              <button className="hq-save" onClick={() => setResearchId(researchId === j.id ? null : j.id)}>
                🔍 Research
              </button>
            </div>
            {researchId === j.id && (
              <div className="hq-research">
                <div className="hq-filters hq-ie-links">
                  {researchLinks(j.company).map(([label, url]) => (
                    <a key={label} href={url} target="_blank" rel="noreferrer">{label} ↗</a>
                  ))}
                </div>
                <textarea className="hq-job-notes"
                          placeholder="Research notes: what they do · size · sponsors visas? · salary range · why I fit"
                          defaultValue={j.research || ""} onBlur={(e) => upd(j.id, { research: e.target.value })} />
              </div>
            )}
            <textarea className="hq-job-notes" placeholder="What did I do? (tailored resume? cover note? who I contacted? interview notes?)"
                      defaultValue={j.notes} onBlur={(e) => upd(j.id, { notes: e.target.value })} />
          </div>
          );
        })}
      </div>
    </div>
  );
}

function Skills({ data, setData }) {
  const [name, setName] = useState("");
  const upd = (id, patch) =>
    setData((d) => ({ ...d, skills: d.skills.map((s) => (s.id === id ? { ...s, ...patch } : s)) }));
  const add = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setData((d) => ({ ...d, skills: [...d.skills, { id: uid(), name, priority: "Medium", done: false, note: "" }] }));
    setName("");
  };
  const del = (id) => setData((d) => ({ ...d, skills: d.skills.filter((s) => s.id !== id) }));
  const doneCount = data.skills.filter((s) => s.done).length;

  return (
    <div>
      <p className="hq-muted">Skills to close before you're a strong SWE hire in KSA. {doneCount}/{data.skills.length} done.</p>
      <form className="hq-jobform" onSubmit={add}>
        <input placeholder="Add a skill to learn" value={name} onChange={(e) => setName(e.target.value)} />
        <button type="submit">+ Add</button>
      </form>
      <div className="hq-checklist">
        {data.skills.map((s) => (
          <div className={"hq-check" + (s.done ? " done" : "")} key={s.id}>
            <input type="checkbox" checked={s.done} onChange={(e) => upd(s.id, { done: e.target.checked })} />
            <div className="hq-check-body">
              <div className="hq-check-name">{s.name}
                <select className="hq-prio" value={s.priority} onChange={(e) => upd(s.id, { priority: e.target.value })}>
                  {["High", "Medium", "Low"].map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
              {s.note && <div className="hq-muted hq-check-note">{s.note}</div>}
            </div>
            <button className="hq-del" onClick={() => del(s.id)}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Courses({ data, setData }) {
  const [form, setForm] = useState({ name: "", url: "" });
  const upd = (id, patch) =>
    setData((d) => ({ ...d, courses: d.courses.map((c) => (c.id === id ? { ...c, ...patch } : c)) }));
  const add = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setData((d) => ({ ...d, courses: [...d.courses, { id: uid(), ...form, state: "Not started", cert: "" }] }));
    setForm({ name: "", url: "" });
  };
  const del = (id) => setData((d) => ({ ...d, courses: d.courses.filter((c) => c.id !== id) }));
  const done = data.courses.filter((c) => c.state === "Done").length;

  return (
    <div>
      <p className="hq-muted">Free courses with real certificates — add the cert link when you finish. {done}/{data.courses.length} done.</p>
      <form className="hq-jobform" onSubmit={add}>
        <input placeholder="Course name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
        <button type="submit">+ Add</button>
      </form>
      <div className="hq-joblist">
        {data.courses.map((c) => (
          <div className="hq-job" key={c.id} style={{ borderLeftColor: c.state === "Done" ? "#3ecf8e" : c.state === "In progress" ? "#f5a623" : "#8a8a99" }}>
            <div className="hq-job-head">
              <div className="hq-job-title">
                <strong>{c.name}</strong>
                {c.url && <a href={c.url} target="_blank" rel="noreferrer" className="hq-job-link">↗</a>}
              </div>
              <div className="hq-job-controls">
                <select value={c.state} onChange={(e) => upd(c.id, { state: e.target.value })}>
                  {COURSE_STATES.map((s) => <option key={s}>{s}</option>)}
                </select>
                <button className="hq-del" onClick={() => del(c.id)}>✕</button>
              </div>
            </div>
            <div className="hq-job-meta">
              <label>Certificate link: <input type="text" placeholder="paste when earned" value={c.cert}
                     onChange={(e) => upd(c.id, { cert: e.target.value })} style={{ width: "16rem" }} /></label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= LIVE JOBS — aggregated remote feed from the backend ================= */

function timeAgo(iso) {
  if (!iso) return "";
  const m = Math.round((Date.now() - new Date(iso)) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

const fitOf = (score) => (score >= 10 ? ["🔥 Strong fit", "#3ecf8e"] : score >= 6 ? ["Good fit", "#C147E9"] : ["Fit", "#8a8a99"]);

const EU_RE = /(ireland|europe|emea|worldwide|anywhere|global|uk|remote)/i;

function LiveJobs({ data, setData, onLetter }) {
  const cached = useMemo(() => {
    try { return JSON.parse(localStorage.getItem(LIVE_KEY)) || null; } catch { return null; }
  }, []);
  const [jobs, setJobs] = useState(cached?.jobs || []);
  const [updatedAt, setUpdatedAt] = useState(cached?.updatedAt || "");
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [source, setSource] = useState("All");
  const [euOnly, setEuOnly] = useState(false);
  const [hideSenior, setHideSenior] = useState(true); // he's junior — senior roles hidden by default
  const [mailState, setMailState] = useState(""); // "" | "sending" | "sent" | "failed"
  const [researchId, setResearchId] = useState(null);

  async function fetchJobs() {
    setLoading(true);
    setError("");
    try {
      const { data: res } = await axios.get(`${API_BASE}/jobs?limit=80`);
      setJobs(res.jobs);
      setUpdatedAt(res.updatedAt);
      localStorage.setItem(LIVE_KEY, JSON.stringify({ jobs: res.jobs, updatedAt: res.updatedAt }));
    } catch {
      setError("Couldn't reach the job feed. Check your connection and hit Refresh.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchJobs(); }, []); // always refresh on open; cache paints instantly meanwhile

  const savedLinks = useMemo(() => new Set(data.jobs.map((j) => j.link)), [data.jobs]);

  const sourceNames = useMemo(() => ["All", ...new Set(jobs.map((j) => j.source))], [jobs]);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return jobs.filter((j) => {
      if (source !== "All" && j.source !== source) return false;
      if (euOnly && !EU_RE.test(j.location)) return false;
      if (hideSenior && j.senior) return false;
      if (needle && !(`${j.title} ${j.company} ${j.tags.join(" ")}`.toLowerCase().includes(needle))) return false;
      return true;
    });
  }, [jobs, q, source, euOnly, hideSenior]);

  function saveToPipeline(j) {
    if (savedLinks.has(j.url)) return;
    const job = {
      id: uid(), company: j.company, role: j.title, link: j.url,
      source: j.source, status: "Wishlist", dateApplied: "", nextFollowUp: "",
      notes: `Remote · ${j.location}${j.salary ? ` · ${j.salary}` : ""}${j.tags.length ? ` · ${j.tags.join(", ")}` : ""} · via ${j.source} (Live Jobs)`,
    };
    setData((d) => ({ ...d, jobs: [job, ...d.jobs] }));
  }

  async function emailMe() {
    setMailState("sending");
    try {
      await axios.post(`${API_BASE}/email-jobs`, { q });
      setMailState("sent");
    } catch {
      setMailState("failed");
    }
    setTimeout(() => setMailState(""), 4000);
  }

  return (
    <div>
      <div className="hq-rule">
        ✅ Showing <strong>online/remote roles only</strong> — every one fits your "must be online" rule.
        On-site Qassim roles are excluded. Sorted by fit to your stack.
      </div>

      <div className="hq-livebar">
        <input placeholder="Search title / company / tags…" value={q} onChange={(e) => setQ(e.target.value)} />
        <button onClick={fetchJobs} disabled={loading}>{loading ? "…" : "⟳ Refresh"}</button>
        <button className="hq-mail" onClick={emailMe} disabled={mailState === "sending"}>
          {mailState === "sending" ? "Sending…" : mailState === "sent" ? "✓ Sent to your inbox" : mailState === "failed" ? "✗ Failed — retry" : "✉️ Email me these"}
        </button>
      </div>

      <div className="hq-filters">
        {sourceNames.map((s) => (
          <button key={s} className={source === s ? "on" : ""} onClick={() => setSource(s)}>{s}</button>
        ))}
        <button className={euOnly ? "on" : ""} onClick={() => setEuOnly(!euOnly)}>🇮🇪 EU / worldwide</button>
        <button className={hideSenior ? "on" : ""} onClick={() => setHideSenior(!hideSenior)}
                title="Hide senior / staff / lead roles">🎯 My level</button>
        <span className="hq-muted hq-updated">
          {updatedAt && `updated ${timeAgo(updatedAt)}`} · {shown.length} jobs
        </span>
      </div>

      {error && <p className="hq-err hq-empty">{error}</p>}
      {loading && jobs.length === 0 && <p className="hq-muted hq-empty">Fetching live jobs…</p>}
      {!loading && !error && shown.length === 0 && (
        <p className="hq-muted hq-empty">No matches — clear the search or hit Refresh.</p>
      )}

      <div className="hq-joblist">
        {shown.map((j) => {
          const [fitLabel, fitColor] = fitOf(j.score);
          const saved = savedLinks.has(j.url);
          return (
            <div className="hq-job hq-live" key={j.id}>
              <div className="hq-job-head">
                <div className="hq-job-title">
                  <strong>{j.title}</strong>
                  <span> — {j.company}</span>
                </div>
                <div className="hq-job-controls">
                  {j.senior && <span className="hq-fit hq-senior">senior — long shot</span>}
                  <span className="hq-fit" style={{ color: fitColor, borderColor: fitColor }}>{fitLabel}</span>
                </div>
              </div>
              <div className="hq-job-meta">
                <span className="hq-tag hq-src">{j.source}</span>
                <span className="hq-tag">🌍 {j.location || "Remote"}</span>
                {j.salary && <span className="hq-tag hq-salary">💰 {j.salary}</span>}
                {j.tags.slice(0, 5).map((t) => <span key={t} className="hq-tag">{t}</span>)}
                <span className="hq-muted">{timeAgo(j.date)}</span>
              </div>
              <div className="hq-live-actions">
                <a className="hq-apply" href={j.url} target="_blank" rel="noreferrer">Apply ↗</a>
                <button className="hq-save" onClick={() => saveToPipeline(j)} disabled={saved}>
                  {saved ? "✓ Saved" : "➕ Save to pipeline"}
                </button>
                <button className="hq-save" onClick={() => onLetter({ company: j.company, role: j.title })}>✍️ Letter</button>
                <button className="hq-save" onClick={() => setResearchId(researchId === j.id ? null : j.id)}>🔍</button>
              </div>
              {researchId === j.id && (
                <div className="hq-research">
                  <div className="hq-filters hq-ie-links">
                    {researchLinks(j.company).map(([label, url]) => (
                      <a key={label} href={url} target="_blank" rel="noreferrer">{label} ↗</a>
                    ))}
                  </div>
                  <span className="hq-muted">Save to pipeline first if you want to keep research notes.</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="hq-muted hq-attrib">
        Live jobs via RemoteOK · Jobicy · Arbeitnow · Remotive · We Work Remotely · Himalayas · Telegram (قناة IT Jobs) —
        links go to the original posting.
      </p>
    </div>
  );
}

/* ============== shared: phase-grouped checklist (Ireland plan + Learn roadmap) ============== */

function GroupedChecklist({ items, onToggle }) {
  const phases = useMemo(() => {
    const m = new Map();
    items.forEach((s) => {
      if (!m.has(s.phase)) m.set(s.phase, []);
      m.get(s.phase).push(s);
    });
    return [...m.entries()];
  }, [items]);

  return phases.map(([phase, steps]) => (
    <div key={phase} className="hq-ie-phase">
      <h3>{phase} <span className="hq-muted">({steps.filter((s) => s.done).length}/{steps.length})</span></h3>
      <div className="hq-checklist">
        {steps.map((s) => (
          <div className={"hq-check" + (s.done ? " done" : "")} key={s.id}>
            <input type="checkbox" checked={s.done} onChange={(e) => onToggle(s.id, e.target.checked)} />
            <div className="hq-check-body">
              <div className="hq-check-name">
                {s.name}
                {s.url && <a href={s.url} target="_blank" rel="noreferrer" className="hq-job-link">↗</a>}
              </div>
              {s.note && <div className="hq-muted hq-check-note">{s.note}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  ));
}

/* ================= IRELAND — full plan from 0 (Egyptian, living in KSA) ================= */

function Ireland({ data, setData }) {
  const items = useMemo(() => data.ireland || [], [data.ireland]);
  const toggle = (id, done) =>
    setData((d) => ({ ...d, ireland: d.ireland.map((s) => (s.id === id ? { ...s, done } : s)) }));

  const done = items.filter((s) => s.done).length;
  const pct = items.length ? Math.round((done / items.length) * 100) : 0;

  return (
    <div>
      <div className="hq-rule hq-ie-head">
        <div>
          🇮🇪 <strong>Ireland from 0</strong> — Egyptian passport, living in KSA, graduating 2027.
          Route: employer-sponsored <strong>Critical Skills Employment Permit</strong> (software dev is on the list)
          → long-stay D visa → Stamp 4 after 2 years. English-speaking, EU tech capital, and its timezone
          fits your after-3-PM rule while you study.
        </div>
        <div className="hq-ie-progress">
          <div className="hq-ie-bar"><div style={{ width: `${pct}%` }} /></div>
          <span className="hq-muted">{done}/{items.length} done</span>
        </div>
      </div>

      <div className="hq-filters hq-ie-links">
        {IRELAND_LINKS.map((l) => (
          <a key={l.url} href={l.url} target="_blank" rel="noreferrer">{l.label} ↗</a>
        ))}
      </div>

      <GroupedChecklist items={items} onToggle={toggle} />

      <p className="hq-muted hq-attrib">
        Figures verified July 2026 — citizensinformation.ie · enterprise.gov.ie (DETE) · irishimmigration.ie.
        Rules change; re-check official pages before paperwork.
      </p>
    </div>
  );
}

/* ================= LEARN — 12-week roadmap + skills gap + courses ================= */

function Learn({ data, setData }) {
  const [sub, setSub] = useState("roadmap");
  const items = useMemo(() => data.learn || [], [data.learn]);
  const toggle = (id, done) =>
    setData((d) => ({ ...d, learn: d.learn.map((s) => (s.id === id ? { ...s, done } : s)) }));

  const done = items.filter((s) => s.done).length;
  const pct = items.length ? Math.round((done / items.length) * 100) : 0;

  return (
    <div>
      <div className="hq-rule hq-ie-head">
        <div>
          📚 <strong>12 weeks to a stronger hire.</strong> One focus per two weeks, ordered by
          hire-signal: tests → TypeScript/SQL → Docker/CI → cloud → system design → interview mode.
          The daily block never changes. Same prep works for KSA, remote, and Ireland.
        </div>
        <div className="hq-ie-progress">
          <div className="hq-ie-bar"><div style={{ width: `${pct}%` }} /></div>
          <span className="hq-muted">{done}/{items.length} done</span>
        </div>
      </div>

      <div className="hq-filters">
        {[["roadmap", "🗓️ Roadmap"], ["skills", "Skills gap"], ["courses", "Certificates & courses"]].map(([k, t]) => (
          <button key={k} className={sub === k ? "on" : ""} onClick={() => setSub(k)}>{t}</button>
        ))}
      </div>

      {sub === "roadmap" && <GroupedChecklist items={items} onToggle={toggle} />}
      {sub === "skills" && <Skills data={data} setData={setData} />}
      {sub === "courses" && <Courses data={data} setData={setData} />}
    </div>
  );
}

/* ================= APPLY KIT — cover letter generator + resume variants ================= */

function ApplyKit({ prefill }) {
  const [sub, setSub] = useState("letter");
  return (
    <div>
      <div className="hq-filters">
        {[["letter", "✍️ Cover letter"], ["resumes", "📄 Resume variants"]].map(([k, t]) => (
          <button key={k} className={sub === k ? "on" : ""} onClick={() => setSub(k)}>{t}</button>
        ))}
      </div>
      {sub === "letter" && <CoverLetter prefill={prefill} />}
      {sub === "resumes" && <Resumes />}
    </div>
  );
}

function CoverLetter({ prefill }) {
  const [tpl, setTpl] = useState("ksa_en");
  const [fields, setFields] = useState({ company: "", role: "", manager: "", custom: "" });
  const [copied, setCopied] = useState(""); // "" | "subject" | "body"

  // A "✍️ Letter" click on any job card lands here with company/role filled in
  useEffect(() => {
    if (prefill) setFields((f) => ({ ...f, company: prefill.company || "", role: prefill.role || "" }));
  }, [prefill]);

  const template = LETTER_TEMPLATES[tpl];
  const gen = useMemo(() => template.build(fields), [template, fields]);
  const [body, setBody] = useState(gen.body);
  useEffect(() => setBody(gen.body), [gen.body]); // regenerate when fields/template change

  const setF = (k) => (e) => setFields((f) => ({ ...f, [k]: e.target.value }));
  const copy = (what, text) => {
    navigator.clipboard.writeText(text);
    setCopied(what);
    setTimeout(() => setCopied(""), 2000);
  };
  const mailto = `mailto:?subject=${encodeURIComponent(gen.subject)}&body=${encodeURIComponent(body)}`;

  return (
    <div>
      <div className="hq-rule">
        ✍️ Pick a template, fill company + role, add <strong>one honest line about why them</strong> (it's what
        separates you from mass-appliers), then copy. Editing the preview is fine — it regenerates when fields change.
      </div>

      <div className="hq-letter-form">
        <select value={tpl} onChange={(e) => setTpl(e.target.value)}>
          {Object.entries(LETTER_TEMPLATES).map(([k, t]) => <option key={k} value={k}>{t.label}</option>)}
        </select>
        <input placeholder="Company *" value={fields.company} onChange={setF("company")} />
        <input placeholder="Role / title *" value={fields.role} onChange={setF("role")} />
        <input placeholder="Hiring manager name (optional)" value={fields.manager} onChange={setF("manager")} />
        <input className="hq-letter-custom" value={fields.custom} onChange={setF("custom")}
               placeholder="Why this company? One specific sentence — e.g. 'I've used your product X and …'" />
      </div>

      <div className="hq-subject-row">
        <strong className="hq-subject" dir={template.dir}>{gen.subject}</strong>
        <button className="hq-save" onClick={() => copy("subject", gen.subject)}>
          {copied === "subject" ? "✓" : "Copy subject"}
        </button>
      </div>

      <textarea className="hq-letter-body" dir={template.dir} value={body}
                onChange={(e) => setBody(e.target.value)} spellCheck={false} />

      <div className="hq-live-actions">
        <button className="hq-apply hq-apply-btn" onClick={() => copy("body", body)}>
          {copied === "body" ? "✓ Copied — paste it in the application" : "📋 Copy letter"}
        </button>
        <a className="hq-save" href={mailto}>📧 Open in email app</a>
      </div>
    </div>
  );
}

function Resumes() {
  return (
    <div>
      <div className="hq-rule">
        📄 <strong>Three targeted one-pagers, same facts, different emphasis.</strong> A Saudi HR screener and a
        Dublin recruiter scan for different things — send each one the version written for them.
        (Regenerate after edits: <code>python resume-src/gen_resume.py &lt;out.pdf&gt; ksa|ireland|remote</code>)
      </div>
      <div className="hq-kit-grid">
        {RESUME_VARIANTS.map((v) => (
          <div className="hq-kit-card" key={v.file}>
            <div className="hq-kit-flag">{v.flag}</div>
            <strong>{v.name}</strong>
            <div className="hq-muted"><strong>Use for:</strong> {v.when}</div>
            <div className="hq-muted">{v.diff}</div>
            <a className="hq-apply hq-kit-dl" href={`/resumes/${v.file}`} download>⬇ Download PDF</a>
          </div>
        ))}
      </div>
      <p className="hq-muted hq-attrib">
        Rule of thumb: KSA version for anything Gulf · Ireland version when sponsorship might come up ·
        Remote version for every job in the Live Jobs feed.
      </p>
    </div>
  );
}
