import "dotenv/config";
import express from "express"
import cors from "cors";
import { getJobs, buildDigestHtml, buildCheckinHtml, esc } from "./jobs.js";
import { createEmailClient } from "./email-client.js";
import { profileOf, visitorsRouter } from "./visitors.js";

const app = express()

const OWNER_EMAIL = "alshraky3@gmail.com";

// ── central email gateway ───────────────────────────────────────────────────
//
// Every email this backend sends goes through the shared email gateway
// (email-system), and only through it: there is no SMTP or nodemailer here any
// more. All of it is mail to me, so it is `audience: 'owner'`, which the gateway
// routes over its Gmail transport: it is logged with every other project's mail
// and costs none of the shared Resend budget.
//
// Needs EMAIL_GATEWAY_URL and EMAIL_GATEWAY_KEY on Vercel `portfolio-api`.
const gateway = createEmailClient({
  baseUrl: process.env.EMAIL_GATEWAY_URL,
  apiKey: process.env.EMAIL_GATEWAY_KEY,
  mode: "on",
  log: (m, e) => console.warn("[gateway]", m, e ?? ""),
});

/** Sends one email to me through the gateway. Returns the gateway's outcome. */
async function sendMail(opts) {
  const res = await gateway.send({ fromName: "Portfolio", audience: "owner", ...opts });
  if (res?.status && res.status !== "sent") console.warn("[gateway] not sent:", res.status, opts.event);
  return res;
}
const SITE_URL = "https://alshraky.xyz";

// SECURITY: Restrict CORS to your actual domains
const corsOptions = {
    origin: [
        'https://alshraky.xyz',
        'https://www.alshraky.xyz',
        'https://web-dev-seven-iota.vercel.app', // the Vercel address keeps working
        'https://alshraky.com',
        'http://localhost:5173', // local dev
        process.env.ALLOWED_ORIGIN,
    ].filter(Boolean),
    methods: ['POST', 'GET'],
    allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));
// Small bodies everywhere, except the "share your work" route, which parses its own.
const smallJson = express.json({ limit: "32kb" });
app.use((req, res, next) => (req.path === "/v/share" ? next() : smallJson(req, res, next)));

// ---- light in-memory rate limiter (best-effort on serverless) ----
const RATE = new Map();
function rateLimit(max, windowMs) {
    return (req, res, next) => {
        const ip = (req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "?")
            .split(",")[0].trim();
        const now = Date.now();
        const hits = (RATE.get(ip) || []).filter((t) => now - t < windowMs);
        if (hits.length >= max) {
            return res.status(429).json({ error: "Too many requests — try again later" });
        }
        hits.push(now);
        RATE.set(ip, hits);
        next();
    };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9][0-9\s-]{6,19}$/;

// ── visitor notifications ───────────────────────────────────────────────────
// Every interaction on the site emails me (visitors.js calls this): who it
// was as far as the site can tell (a running visitor number, city and country,
// device, app or browser, where they came from, how often they visited, which
// systems they scrolled through) and what they did.
const INTENT_LABEL = { hiring: "💼 is hiring", project: "💡 has a project", looking: "👀 is just looking", friend: "👋 knows you" };
const CONTACT_LABEL = { whatsapp: "WhatsApp", mail: "Email", linkedin: "LinkedIn", github: "GitHub" };
const SECTION_LABEL = { top: "How I build", "sys-sqb": "SQB", "sys-hr": "HR", "sys-neurolink": "NeuroLink", "sys-email": "Email gateway" };
const flagOf = (cc) => (cc && /^[A-Z]{2}$/.test(cc) ? String.fromCodePoint(...[...cc].map((c) => 0x1f1a5 + c.charCodeAt(0))) : "🌍");

function whoLine(p) {
    if (!p) return "A visitor";
    const place = [p.city, p.country].filter(Boolean).join(", ");
    return `Visitor #${p.number ?? "?"}${place ? ` from ${place}` : ""}`;
}

function profileRows(p) {
    if (!p) return [];
    const when = (d) => (d ? new Date(d).toLocaleString("en-GB", { timeZone: "Asia/Riyadh", dateStyle: "medium", timeStyle: "short" }) : "");
    const app = p.in_app ? `${p.in_app} in-app browser` : p.browser;
    const came = [p.source, p.referrer && p.referrer !== p.source ? `(${p.referrer})` : null].filter(Boolean).join(" ");
    return [
        ["Visitor", `#${p.number ?? "?"} · id ${p.tag}`],
        ["Where", `${flagOf(p.country)} ${[p.city, p.region, p.country].filter(Boolean).join(", ") || "unknown"}`],
        ["Device", [p.device, p.os, app].filter(Boolean).join(" · ")],
        ["Came from", came || "direct"],
        ["Language", p.lang || "?"],
        ["Screen width", p.screen_w ? `${p.screen_w}px` : "?"],
        ["Visits", `${p.visits} (first ${when(p.first_seen)} Riyadh time)`],
        ["Why here", p.intent ? INTENT_LABEL[p.intent].replace(/^\S+ /, "") : "not said"],
        ["Scrolled through", p.sections?.length ? p.sections.map((s) => SECTION_LABEL[s] || s).join(", ") : "nothing yet"],
    ];
}

function visitorMail({ event, subject, title, body = "", text = "", profile, attachments }) {
    const rows = profileRows(profile);
    return sendMail({
        event,
        to: OWNER_EMAIL,
        subject,
        text: [text, ...rows.map(([k, v]) => `${k}: ${v}`)].filter(Boolean).join("\n"),
        html: `
              <div style="font-family:Segoe UI,system-ui,sans-serif;max-width:640px;margin:0 auto;">
                <h2 style="color:#6a1b9a;margin:8px 0;">${esc(title)}</h2>
                ${body}
                <table style="margin-top:14px;border-collapse:collapse;font-size:14px;width:100%;">
                  ${rows.map(([k, v]) => `<tr><td style="padding:5px 10px 5px 0;color:#6a5f7a;white-space:nowrap;vertical-align:top;">${esc(k)}</td><td style="padding:5px 0;">${esc(v)}</td></tr>`).join("")}
                </table>
              </div>`,
        attachments,
    });
}

const quote = (s) => `<div style="border:1px solid #e5e0ee;border-left:4px solid #C147E9;border-radius:10px;padding:14px 16px;white-space:pre-wrap;">${esc(s)}</div>`;

app.use(
    "/v",
    visitorsRouter(rateLimit, ({ kind, profile, note, image, link, intent, detail }) => {
        const who = whoLine(profile);
        switch (kind) {
            case "visit-new":
                return visitorMail({ event: "portfolio.owner.visit_new", subject: `👀 New visitor: ${who.replace(/^Visitor #\d+ /, "")} · ${profile?.device || ""}${profile?.in_app ? ` · ${profile.in_app}` : ""}`, title: `👀 ${who} opened your portfolio`, profile });
            case "visit-back":
                return visitorMail({ event: "portfolio.owner.visit_back", subject: `🔁 ${who} came back (visit ${profile?.visits ?? ""})`, title: `🔁 ${who} came back`, profile });
            case "intent":
                return visitorMail({ event: "portfolio.owner.visitor_intent", subject: `🧭 ${who} ${INTENT_LABEL[intent]?.replace(/^\S+ /, "") || "answered"}`, title: `🧭 ${who} ${INTENT_LABEL[intent] || "answered"}`, profile });
            case "contact":
                return visitorMail({ event: "portfolio.owner.visitor_contact", subject: `📲 ${who} tapped ${CONTACT_LABEL[detail] || detail}`, title: `📲 ${who} tapped ${CONTACT_LABEL[detail] || detail}`, profile });
            case "cv":
                return visitorMail({ event: "portfolio.owner.visitor_cv", subject: `📄 ${who} downloaded your CV`, title: `📄 ${who} downloaded your CV`, profile });
            case "note":
                return visitorMail({ event: "portfolio.owner.visitor_note", subject: `💬 ${who} told you something`, title: `💬 ${who} told you something`, body: quote(note), text: note, profile });
            case "share": {
                const what = [image ? "an image" : null, link ? "a link" : null].filter(Boolean).join(" and ");
                return visitorMail({
                    event: "portfolio.owner.visitor_share",
                    subject: `📎 ${who} shared ${what} with you`,
                    title: `📎 ${who} shared ${what} with you`,
                    body: `${note ? quote(note) : ""}${link ? `<p style="margin:12px 0;"><a href="${esc(link)}" style="color:#6a1b9a;font-weight:600;">${esc(link)}</a></p>` : ""}${image ? `<p style="color:#6a5f7a;">The image is attached.</p>` : ""}`,
                    text: [note, link].filter(Boolean).join("\n"),
                    profile,
                    attachments: image ? [{ filename: `shared.${image.type.split("/")[1].replace("jpeg", "jpg")}`, content: image.base64, content_type: image.type }] : undefined,
                });
            }
            default:
                return Promise.resolve();
        }
    }),
);

app.post("/send-email", rateLimit(5, 15 * 60 * 1000), async (req, res) => {
    const data = req.body || {};

    // ---- validation ----
    // The quick form sends a message and one way to reply: an email or a phone
    // number (answered on WhatsApp). Name and subject are optional.
    const firstName = String(data.firstName || "").trim() || "Portfolio visitor";
    const reply = String(data.email || data.reply || "").trim();
    const subject = String(data.subject || "").trim() || "Quick note from the portfolio";
    const message = String(data.message || "").trim();
    const isEmail = EMAIL_RE.test(reply);
    const isPhone = PHONE_RE.test(reply);
    const email = isEmail ? reply : "";
    if (firstName.length > 100) return res.status(400).json({ error: "Invalid name" });
    if ((!isEmail && !isPhone) || reply.length > 200) return res.status(400).json({ error: "Invalid email or phone" });
    if (subject.length > 200) return res.status(400).json({ error: "Invalid subject" });
    if (!message || message.length > 5000) return res.status(400).json({ error: "Invalid message" });

    try {
        const profile = await profileOf(String(data.vid || ""), req).catch(() => null);
        const rows = profile ? profileRows(profile) : [];
        const result = await sendMail({
            event: "portfolio.owner.contact_form",
            to: OWNER_EMAIL,
            replyTo: email || undefined, // hit "Reply" in Gmail → goes straight to the sender
            subject: `📬 ${subject} — from ${firstName}`,
            text: `Message from ${firstName} (${reply}${isPhone ? ", phone" : ""}):\n\n${message}`,
            html: `
              <div style="font-family:Segoe UI,system-ui,sans-serif;max-width:640px;margin:0 auto;">
                <h2 style="color:#6a1b9a;margin:8px 0;">📬 New contact message</h2>
                <p style="margin:4px 0;"><strong>From:</strong> ${esc(firstName)} &lt;${esc(reply)}&gt;${isPhone ? " (phone: reply on WhatsApp)" : ""}</p>
                <p style="margin:4px 0;"><strong>Subject:</strong> ${esc(subject)}</p>
                <div style="border:1px solid #e5e0ee;border-left:4px solid #C147E9;border-radius:10px;padding:14px 16px;margin-top:12px;white-space:pre-wrap;">${esc(message)}</div>
                <table style="margin-top:14px;border-collapse:collapse;font-size:14px;">
                  ${rows.map(([k, v]) => `<tr><td style="padding:5px 10px 5px 0;color:#6a5f7a;white-space:nowrap;">${esc(k)}</td><td style="padding:5px 0;">${esc(v)}</td></tr>`).join("")}
                </table>
              </div>`,
        });

        console.log("Contact note:", result?.status, result?.id);
        res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Failed to send email" });
    }
});

app.post("/resume-downloaded", rateLimit(10, 15 * 60 * 1000), async (req, res) => {
    const { timestamp } = req.body || {};

    try {
        await sendMail({
            event: "portfolio.owner.resume_download",
            dedupeKey: "portfolio.resume",
            to: OWNER_EMAIL,
            subject: "📄 Someone downloaded your Resume!",
            text: `Your resume was downloaded.\n\nTime: ${timestamp || new Date().toISOString()}`,
            html: `
              <div style="font-family:Segoe UI,system-ui,sans-serif;">
                <h2 style="color:#6a1b9a;">📄 Resume downloaded</h2>
                <p>Someone just downloaded your resume.</p>
                <p style="color:#6a5f7a;">Time: ${esc(timestamp || new Date().toISOString())}</p>
              </div>`,
        });

        res.status(200).json({ message: "Notification sent" });
    } catch (error) {
        console.error("Resume notification error:", error);
        res.status(500).json({ error: "Failed to send notification" });
    }
});

// ---- live job feed (aggregated + cached in jobs.js) ----
app.get("/jobs", async (req, res) => {
    try {
        const q = String(req.query.q || "").slice(0, 100);
        const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 60, 1), 100);
        const result = await getJobs({ q, limit });
        res.status(200).json(result);
    } catch (error) {
        console.error("Jobs fetch error:", error);
        res.status(500).json({ error: "Failed to fetch jobs" });
    }
});

// ---- daily digest (Vercel Cron sends Authorization: Bearer CRON_SECRET;
//      external schedulers can use ?key=DIGEST_SECRET) ----
app.get("/job-digest", async (req, res) => {
    const bearerOk =
        process.env.CRON_SECRET &&
        req.headers.authorization === `Bearer ${process.env.CRON_SECRET}`;
    const keyOk =
        process.env.DIGEST_SECRET && req.query.key === process.env.DIGEST_SECRET;
    if (!bearerOk && !keyOk) return res.status(401).json({ error: "Unauthorized" });

    try {
        const { jobs } = await getJobs({ limit: 12 });
        await sendMail({
            event: "portfolio.owner.job_digest",
            to: OWNER_EMAIL,
            subject: `🔴 ${jobs.length} fresh remote jobs — daily digest`,
            html: buildDigestHtml(jobs, { siteUrl: SITE_URL }),
        });
        res.status(200).json({ message: "Digest sent", count: jobs.length });
    } catch (error) {
        console.error("Digest error:", error);
        res.status(500).json({ error: "Failed to send digest" });
    }
});

// ---- evening accountability email (second cron, 16:00 UTC = 19:00 KSA) ----
app.get("/evening-checkin", async (req, res) => {
    const bearerOk =
        process.env.CRON_SECRET &&
        req.headers.authorization === `Bearer ${process.env.CRON_SECRET}`;
    const keyOk =
        process.env.DIGEST_SECRET && req.query.key === process.env.DIGEST_SECRET;
    if (!bearerOk && !keyOk) return res.status(401).json({ error: "Unauthorized" });

    try {
        const { jobs } = await getJobs({ limit: 100 });
        // digest shows best-fit; the check-in teases the NEWEST postings instead
        const newest = [...jobs]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3);
        await sendMail({
            event: "portfolio.owner.evening_checkin",
            to: OWNER_EMAIL,
            subject: "🌙 Evening check-in — did today count?",
            html: buildCheckinHtml(newest, { siteUrl: SITE_URL }),
        });
        res.status(200).json({ message: "Check-in sent" });
    } catch (error) {
        console.error("Check-in error:", error);
        res.status(500).json({ error: "Failed to send check-in" });
    }
});

// ---- on-demand "Email me these" button in HQ.
//      Content is always re-fetched server-side; body is ignored → can't be abused
//      to send arbitrary content, and rate-limiting stops inbox spam. ----
app.post("/email-jobs", rateLimit(5, 15 * 60 * 1000), async (req, res) => {
    try {
        const q = String(req.body?.q || "").slice(0, 100);
        const { jobs } = await getJobs({ q, limit: 15 });
        await sendMail({
            event: "portfolio.owner.email_jobs",
            to: OWNER_EMAIL,
            subject: `✉️ ${jobs.length} remote jobs${q ? ` matching “${q}”` : ""} — sent from HQ`,
            html: buildDigestHtml(jobs, { siteUrl: SITE_URL }),
        });
        res.status(200).json({ message: "Jobs emailed", count: jobs.length });
    } catch (error) {
        console.error("Email-jobs error:", error);
        res.status(500).json({ error: "Failed to email jobs" });
    }
});

app.get("/api", (req, res) => {
    res.send("app is working")
})




app.listen(3000, () => {
    console.log("app is working")
})
