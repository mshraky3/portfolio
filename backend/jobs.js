import axios from "axios";

/*
 * Live job aggregator.
 * Sources (all free; every card/email links back to the original posting):
 *   - RemoteOK    https://remoteok.com/api
 *   - Jobicy      https://jobicy.com/api/v2/remote-jobs
 *   - Arbeitnow   https://www.arbeitnow.com/api/job-board-api   (remote === true only)
 *   - Remotive    https://remotive.com/api/remote-jobs          (ToS: attribute + max ~4 calls/day → 6h cache complies)
 *   - WWR         https://weworkremotely.com/...remote-programming-jobs.rss
 *   - Himalayas   https://himalayas.app/jobs/api
 *   - Telegram    https://t.me/s/IT_jobs_coop                   (public channel web preview)
 * Jobs are normalized, deduped by URL, scored against Mahmoud's stack
 * (senior/staff/lead roles are penalized — he's junior), and cached in
 * memory for CACHE_TTL (best-effort on serverless).
 */

const TIMEOUT = 8000;
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours
const UA = "Mozilla/5.0 (portfolio job digest; contact: alshraky3@gmail.com)";

// Stack keywords → relevance score. Title hit is worth more than a tag/body hit.
const KEYWORDS = [
    ["react", 3], ["node", 3], ["javascript", 3], ["typescript", 2],
    ["full stack", 3], ["fullstack", 3], ["full-stack", 3],
    ["frontend", 2], ["front end", 2], ["front-end", 2],
    ["backend", 2], ["back end", 2], ["back-end", 2],
    ["software engineer", 3], ["software developer", 3], ["web developer", 3],
    ["express", 2], ["next", 1], ["postgres", 2], ["sql", 1], ["python", 2],
    ["api", 1], ["junior", 2], ["entry level", 2], ["entry-level", 2],
];

// He's a junior — de-rank roles he can't land yet (still visible, just lower).
const SENIOR_RE = /\b(senior|staff|principal|lead|architect|head of|vp|director)\b/i;

function scoreJob(job) {
    const title = (job.title || "").toLowerCase();
    const rest = ((job.tags || []).join(" ") + " " + (job._body || "")).toLowerCase();
    let score = 0;
    for (const [kw, w] of KEYWORDS) {
        if (title.includes(kw)) score += w * 2;
        else if (rest.includes(kw)) score += w;
    }
    if (job.senior) score -= 5;
    score += job._bonus || 0;
    return score;
}

// Stable id from URL (djb2 hash) so the frontend can dedupe across refreshes.
function hashId(str) {
    let h = 5381;
    for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
    return h.toString(36);
}

// Some sources (RemoteOK) occasionally serve corrupted text (mojibake / U+FFFD).
// If a field is irreparably mangled, fall back rather than render garbage.
const safeText = (s, fallback = "") => {
    if (!s) return fallback;
    s = String(s).trim();
    return /[\uFFFD\u0080-\u009F]/.test(s) ? fallback : s;
};

const unescapeXml = (s = "") =>
    s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
        .replace(/&#0?39;/g, "'").replace(/&rlm;|&lrm;/g, "").replace(/&amp;/g, "&");

const fmtSalary = (min, max, cur = "USD") => {
    min = Number(min) || 0;
    max = Number(max) || 0;
    if (!min && !max) return "";
    const k = (n) => (n >= 1000 ? `${Math.round(n / 1000)}k` : n);
    const sym = cur === "USD" ? "$" : cur === "EUR" ? "€" : cur === "GBP" ? "£" : `${cur} `;
    if (min && max) return `${sym}${k(min)}–${k(max)}`;
    return `${sym}${k(min || max)}`;
};

async function fetchRemoteOK() {
    const { data } = await axios.get("https://remoteok.com/api", {
        timeout: TIMEOUT,
        headers: { "User-Agent": UA },
    });
    // element [0] is RemoteOK's legal notice, not a job
    return (Array.isArray(data) ? data.slice(1) : [])
        .filter((j) => j.url && j.position)
        .map((j) => ({
            id: hashId(j.url),
            title: safeText(j.position, "Untitled role"),
            company: safeText(j.company, "—"),
            location: safeText(j.location, "Remote"),
            url: j.url,
            tags: (j.tags || []).slice(0, 6),
            salary: fmtSalary(j.salary_min, j.salary_max),
            source: "RemoteOK",
            date: j.date ? new Date(j.date).toISOString() : new Date().toISOString(),
        }));
}

async function fetchJobicy() {
    const { data } = await axios.get(
        "https://jobicy.com/api/v2/remote-jobs?count=50&industry=dev",
        { timeout: TIMEOUT }
    );
    return (data.jobs || [])
        .filter((j) => j.url && j.jobTitle)
        .map((j) => ({
            id: hashId(j.url),
            title: safeText(j.jobTitle, "Untitled role"),
            company: safeText(j.companyName, "—"),
            location: safeText(j.jobGeo, "Remote"),
            url: j.url,
            tags: [...(Array.isArray(j.jobType) ? j.jobType : []), j.jobLevel].filter(Boolean).slice(0, 6),
            salary: fmtSalary(j.annualSalaryMin, j.annualSalaryMax, j.salaryCurrency || "USD"),
            source: "Jobicy",
            date: j.pubDate ? new Date(j.pubDate).toISOString() : new Date().toISOString(),
        }));
}

async function fetchArbeitnow() {
    const { data } = await axios.get("https://www.arbeitnow.com/api/job-board-api", {
        timeout: TIMEOUT,
    });
    return (data.data || [])
        .filter((j) => j.remote === true && j.url && j.title)
        .map((j) => ({
            id: hashId(j.url),
            title: safeText(j.title, "Untitled role"),
            company: safeText(j.company_name, "—"),
            location: safeText(j.location, "Remote"),
            url: j.url,
            tags: [...(j.tags || []), ...(j.job_types || [])].slice(0, 6),
            salary: "",
            source: "Arbeitnow",
            date: j.created_at ? new Date(j.created_at * 1000).toISOString() : new Date().toISOString(),
        }));
}

async function fetchRemotive() {
    const { data } = await axios.get(
        "https://remotive.com/api/remote-jobs?category=software-dev&limit=50",
        { timeout: TIMEOUT }
    );
    return (data.jobs || [])
        .filter((j) => j.url && j.title)
        .map((j) => ({
            id: hashId(j.url),
            title: safeText(j.title, "Untitled role"),
            company: safeText(j.company_name, "—"),
            location: safeText(j.candidate_required_location, "Remote"),
            url: j.url,
            tags: (j.tags || []).slice(0, 6),
            salary: safeText(j.salary, ""),
            source: "Remotive",
            date: j.publication_date ? new Date(j.publication_date).toISOString() : new Date().toISOString(),
        }));
}

async function fetchWWR() {
    const { data: xml } = await axios.get(
        "https://weworkremotely.com/categories/remote-programming-jobs.rss",
        { timeout: TIMEOUT, headers: { "User-Agent": UA } }
    );
    const items = [...String(xml).matchAll(/<item>([\s\S]*?)<\/item>/g)];
    return items
        .map((m) => {
            const pick = (tag) => {
                const r = m[1].match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
                return r ? unescapeXml(r[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim()) : "";
            };
            const rawTitle = pick("title");
            const link = pick("link");
            // WWR titles come as "Company: Job Title"
            const sep = rawTitle.indexOf(": ");
            const company = sep > 0 ? rawTitle.slice(0, sep) : "—";
            const title = sep > 0 ? rawTitle.slice(sep + 2) : rawTitle;
            const pub = pick("pubDate");
            return {
                id: hashId(link),
                title: safeText(title, "Untitled role"),
                company: safeText(company, "—"),
                location: safeText(pick("region"), "Remote"),
                url: link,
                tags: [pick("category")].filter(Boolean),
                salary: "",
                source: "WWR",
                date: pub ? new Date(pub).toISOString() : new Date().toISOString(),
            };
        })
        .filter((j) => j.url && j.title);
}

async function fetchHimalayas() {
    const { data } = await axios.get("https://himalayas.app/jobs/api?limit=60", {
        timeout: TIMEOUT,
    });
    return (data.jobs || [])
        .filter((j) => (j.applicationLink || j.guid) && j.title)
        .map((j) => ({
            id: hashId(j.applicationLink || j.guid),
            title: safeText(j.title, "Untitled role"),
            company: safeText(j.companyName, "—"),
            location: safeText((j.locationRestrictions || []).join(", "), "Worldwide"),
            url: j.applicationLink || j.guid,
            tags: [...(Array.isArray(j.parentCategories) ? j.parentCategories : []), j.employmentType]
                .filter(Boolean).slice(0, 6),
            salary: fmtSalary(j.minSalary, j.maxSalary, j.currency && j.currency !== "None" ? j.currency : "USD"),
            source: "Himalayas",
            date: j.pubDate ? new Date(Number(j.pubDate) * 1000).toISOString() : new Date().toISOString(),
        }));
}

// Public Telegram channels expose a scrape-friendly web preview at t.me/s/<channel>.
// IT_jobs_coop's usual format is just "#وظيفة" + a direct LinkedIn job URL, so we
// deep-link to the actual posting, keep only real job posts (#وظيفة tag or a
// job-site link), and give them a curated-source bonus since keywords are sparse.
const JOB_HASHTAGS = /^(وظيفة|وظائف|تدريب|تدريب_تعاوني|تعاوني|remote|hiring|job|jobs)$/i;
const JOB_URL_RE = /https?:\/\/(?:[\w.]*\.)?(linkedin\.com|indeed\.com|bayt\.com|wuzzuf\.net|glassdoor\.\w+|forasna\.com|jobs\.\w+)\/\S*/i;

async function fetchTelegram() {
    const CHANNEL = "IT_jobs_coop";
    const { data: html } = await axios.get(`https://t.me/s/${CHANNEL}`, {
        timeout: TIMEOUT, headers: { "User-Agent": UA },
    });
    const chunks = String(html).split('class="tgme_widget_message_wrap').slice(1);
    return chunks
        .map((chunk) => {
            const post = chunk.match(/data-post="([^"]+)"/)?.[1];
            const rawText = chunk.match(
                /class="tgme_widget_message_text js-message_text"[^>]*>([\s\S]*?)<\/div>/
            )?.[1];
            if (!post || !rawText) return null;
            const text = unescapeXml(
                rawText.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "")
            ).trim();
            const hashtags = [...text.matchAll(/#([\p{L}\p{N}_]+)/gu)].map((m) => m[1]).slice(0, 5);
            const jobLink = text.match(JOB_URL_RE)?.[0];
            const isJobPost = hashtags.some((h) => JOB_HASHTAGS.test(h)) || !!jobLink;
            if (!isJobPost) return null; // events / courses / announcements
            const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
            const titleLine = lines.find((l) => !l.startsWith("#") && !/^https?:\/\//.test(l));
            const title = (titleLine || "وظيفة تقنية جديدة — افتح الإعلان").slice(0, 90);
            const when = chunk.match(/datetime="([^"]+)"/)?.[1];
            return {
                id: hashId(`https://t.me/${post}`),
                title,
                company: "قناة IT Jobs (Telegram)",
                location: jobLink ? "See posting" : "See post",
                url: jobLink || `https://t.me/${post}`,
                tags: hashtags,
                salary: "",
                source: "Telegram",
                date: when ? new Date(when).toISOString() : new Date().toISOString(),
                _body: text.slice(0, 1500), // scored, then stripped before serving
                _bonus: 3, // curated IT-jobs channel — relevant even without keyword hits
            };
        })
        .filter(Boolean);
}

let cache = { jobs: null, updatedAt: 0, sources: [] };

const SOURCES = [
    ["RemoteOK", fetchRemoteOK],
    ["Jobicy", fetchJobicy],
    ["Arbeitnow", fetchArbeitnow],
    ["Remotive", fetchRemotive],
    ["WWR", fetchWWR],
    ["Himalayas", fetchHimalayas],
    ["Telegram", fetchTelegram],
];

async function fetchAllJobs() {
    const results = await Promise.allSettled(SOURCES.map(([, fn]) => fn()));
    const sources = [];
    const all = [];
    results.forEach((r, i) => {
        if (r.status === "fulfilled") {
            sources.push(SOURCES[i][0]);
            all.push(...r.value);
        } else {
            console.error(`Job source ${SOURCES[i][0]} failed:`, r.reason?.message);
        }
    });

    // dedupe by URL, flag seniority, score, keep relevant only, best first / freshest first
    const seen = new Set();
    const jobs = [];
    for (const j of all) {
        if (seen.has(j.url)) continue;
        seen.add(j.url);
        j.senior = SENIOR_RE.test(j.title);
        const score = scoreJob(j);
        delete j._body;
        delete j._bonus;
        if (score > 0) jobs.push({ ...j, score });
    }
    jobs.sort((a, b) => b.score - a.score || new Date(b.date) - new Date(a.date));
    return { jobs, sources };
}

export async function getJobs({ q = "", limit = 60 } = {}) {
    const now = Date.now();
    if (!cache.jobs || now - cache.updatedAt > CACHE_TTL) {
        const { jobs, sources } = await fetchAllJobs();
        // keep stale cache if every source failed
        if (jobs.length > 0 || !cache.jobs) {
            cache = { jobs, updatedAt: now, sources };
        }
    }
    let jobs = cache.jobs || [];
    if (q) {
        const needle = q.toLowerCase();
        jobs = jobs.filter(
            (j) =>
                j.title.toLowerCase().includes(needle) ||
                j.company.toLowerCase().includes(needle) ||
                j.tags.join(" ").toLowerCase().includes(needle)
        );
    }
    return {
        updatedAt: new Date(cache.updatedAt).toISOString(),
        sources: cache.sources,
        count: Math.min(jobs.length, limit),
        jobs: jobs.slice(0, limit),
    };
}

/* ============================ emails ============================ */

const esc = (s = "") =>
    String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const SITE_URL_DEFAULT = "https://web-dev-seven-iota.vercel.app";

// One line a day, rotating — written for Mahmoud's exact situation.
const MOTIVATION = [
    "The job you don't apply to is a guaranteed no. Print your lottery tickets.",
    "3 real applications today beat 30 planned for tomorrow.",
    "You built a system that runs 25+ branches. Act like it in every cover note.",
    "Rejection is data, not a verdict. Log it in HQ and fire again.",
    "Somewhere a team is stuck on a bug you'd fix in an hour. Go find them.",
    "Consistency compounds: 3/day → 90/month → interviews.",
    "Every English rep, every LeetCode rep — it all shows up in next month's interviews.",
    "Freelance client or full-time offer — both start with a message you send today.",
    "Dublin is 2 hours behind you. Your evening is their working day. Use it.",
    "Nobody is coming to discover you. Knock.",
];
const motivationOfToday = () => {
    const day = Math.floor(Date.now() / 864e5);
    return MOTIVATION[day % MOTIVATION.length];
};

const btn = (href, label) =>
    `<a href="${esc(href)}" style="display:inline-block;background:#C147E9;color:#fff;text-decoration:none;font-size:13px;font-weight:600;padding:8px 18px;border-radius:7px;">${label}</a>`;

const jobRow = (j) => `
      <div style="border:1px solid #e5e0ee;border-left:4px solid #C147E9;border-radius:10px;padding:14px 16px;margin:0 0 12px;">
        <div style="font-size:16px;font-weight:700;color:#1a1024;">${esc(j.title)}${j.senior ? ` <span style="font-size:11px;color:#b08c00;">(senior — long shot)</span>` : ""}</div>
        <div style="font-size:13px;color:#6a5f7a;margin:4px 0 8px;">
          ${esc(j.company)} · 🌍 ${esc(j.location)} · via ${esc(j.source)}
          ${j.salary ? ` · 💰 ${esc(j.salary)}` : ""}
        </div>
        ${j.tags.length ? `<div style="font-size:12px;color:#8a7f9a;margin-bottom:10px;">${esc(j.tags.join(" · "))}</div>` : ""}
        ${btn(j.url, "Apply ↗")}
      </div>`;

const missionBlock = `
    <div style="background:#f7f2fb;border:1px solid #e5d5f0;border-radius:10px;padding:14px 16px;margin:0 0 16px;">
      <div style="font-size:13px;font-weight:700;color:#6a1b9a;margin-bottom:6px;">🎯 Today's mission</div>
      <div style="font-size:13px;color:#4a3f5a;line-height:1.9;">
        ☐ 3 applications (any mix: remote / Ireland / Telegram)<br/>
        ☐ 1 follow-up on something you already applied to<br/>
        ☐ 2 LeetCode problems &nbsp;·&nbsp; ☐ 30 min English out loud
      </div>
    </div>`;

const quickLinks = (siteUrl) => `
    <div style="font-size:12px;color:#8a7f9a;margin:14px 0;">
      Quick links:
      <a href="${siteUrl}/#/hq" style="color:#C147E9;">HQ</a> ·
      <a href="https://www.linkedin.com/jobs/search/?keywords=software%20engineer&location=Ireland&f_TPR=r604800" style="color:#C147E9;">LinkedIn Ireland (past week)</a> ·
      <a href="https://t.me/IT_jobs_coop" style="color:#C147E9;">Telegram channel</a> ·
      <a href="https://enterprise.gov.ie/en/publications/companies-issued-with-permits-2026.html" style="color:#C147E9;">IE sponsor register</a>
    </div>`;

export function buildDigestHtml(jobs, { siteUrl = SITE_URL_DEFAULT } = {}) {
    return `
  <div style="font-family:Segoe UI,system-ui,sans-serif;max-width:640px;margin:0 auto;padding:8px;">
    <h2 style="color:#6a1b9a;margin:8px 0 2px;">🔴 ${jobs.length} fresh jobs for you</h2>
    <p style="color:#6a5f7a;font-size:13px;margin:0 0 6px;">
      Remote-first, sorted by fit to your stack. Senior roles de-ranked.
    </p>
    <p style="color:#1a1024;font-size:14px;font-style:italic;margin:0 0 16px;">“${motivationOfToday()}”</p>
    ${missionBlock}
    ${jobs.map(jobRow).join("") || `<p style="color:#6a5f7a;">No matching jobs today — check again tomorrow.</p>`}
    ${quickLinks(siteUrl)}
    <p style="color:#a99fb8;font-size:11px;margin-top:16px;">
      Live jobs via RemoteOK · Jobicy · Arbeitnow · Remotive · We Work Remotely · Himalayas · Telegram — links go to the original posting.
    </p>
  </div>`;
}

// Evening accountability email — did today count? Plus a teaser of the newest
// postings so tomorrow starts with a reason to open HQ.
export function buildCheckinHtml(newestJobs, { siteUrl = SITE_URL_DEFAULT } = {}) {
    return `
  <div style="font-family:Segoe UI,system-ui,sans-serif;max-width:640px;margin:0 auto;padding:8px;">
    <h2 style="color:#6a1b9a;margin:8px 0 2px;">🌙 Evening check-in</h2>
    <p style="color:#1a1024;font-size:14px;margin:4px 0 16px;">
      Before you close the day — be honest with yourself:
    </p>
    <div style="background:#f7f2fb;border:1px solid #e5d5f0;border-radius:10px;padding:14px 16px;margin:0 0 16px;">
      <div style="font-size:13px;color:#4a3f5a;line-height:2;">
        ☐ Did you send your 3 applications?<br/>
        ☐ Did you log them in HQ? (What isn't logged didn't happen.)<br/>
        ☐ One Ireland-plan step checked off?<br/>
        ☐ LeetCode + English done?
      </div>
      <div style="margin-top:10px;">${btn(`${siteUrl}/#/hq`, "Open HQ & log today →")}</div>
    </div>
    <p style="color:#1a1024;font-size:13px;font-weight:700;margin:18px 0 8px;">
      👀 Newest postings — first come, first interviewed:
    </p>
    ${newestJobs.map(jobRow).join("") || ""}
    <p style="color:#6a5f7a;font-size:13px;font-style:italic;">“${motivationOfToday()}”</p>
  </div>`;
}

export { esc };
