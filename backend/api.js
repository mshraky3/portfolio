import express from "express"
import cors from "cors";
import nodemailer from "nodemailer"
import { getJobs, buildDigestHtml, buildCheckinHtml, esc } from "./jobs.js";

const app = express()

const OWNER_EMAIL = "alshraky3@gmail.com";
const SITE_URL = "https://web-dev-seven-iota.vercel.app";

// SECURITY: Restrict CORS to your actual domains
const corsOptions = {
    origin: [
        'https://web-dev-seven-iota.vercel.app',
        'https://alshraky.com',
        'http://localhost:5173', // local dev
        process.env.ALLOWED_ORIGIN,
    ].filter(Boolean),
    methods: ['POST', 'GET'],
    allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "32kb" }));

// SECURITY: Credentials loaded from environment variables (set in Vercel dashboard)
const Email = nodemailer.createTransport(
    {
        host: "smtp.gmail.com",
        port: 587,
        tls: true,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    }
)

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

app.post("/send-email", rateLimit(5, 15 * 60 * 1000), async (req, res) => {
    const data = req.body || {};

    // ---- validation ----
    const firstName = String(data.firstName || "").trim();
    const email = String(data.email || "").trim();
    const subject = String(data.subject || "").trim();
    const message = String(data.message || "").trim();
    if (!firstName || firstName.length > 100) return res.status(400).json({ error: "Invalid name" });
    if (!EMAIL_RE.test(email) || email.length > 200) return res.status(400).json({ error: "Invalid email" });
    if (!subject || subject.length > 200) return res.status(400).json({ error: "Invalid subject" });
    if (!message || message.length > 5000) return res.status(400).json({ error: "Invalid message" });

    try {
        const result = await Email.sendMail({
            from: process.env.EMAIL_USER || "alshrakynodeapp@gmail.com",
            to: OWNER_EMAIL,
            replyTo: email, // hit "Reply" in Gmail → goes straight to the sender
            subject: `📬 ${subject} — from ${firstName}`,
            text: `Message from ${firstName} (${email}):\n\n${message}`,
            html: `
              <div style="font-family:Segoe UI,system-ui,sans-serif;max-width:640px;margin:0 auto;">
                <h2 style="color:#6a1b9a;margin:8px 0;">📬 New contact message</h2>
                <p style="margin:4px 0;"><strong>From:</strong> ${esc(firstName)} &lt;${esc(email)}&gt;</p>
                <p style="margin:4px 0;"><strong>Subject:</strong> ${esc(subject)}</p>
                <div style="border:1px solid #e5e0ee;border-left:4px solid #C147E9;border-radius:10px;padding:14px 16px;margin-top:12px;white-space:pre-wrap;">${esc(message)}</div>
              </div>`,
        });

        console.log("Email sent:", result.messageId);
        res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Failed to send email" });
    }
});

app.post("/resume-downloaded", rateLimit(10, 15 * 60 * 1000), async (req, res) => {
    const { timestamp } = req.body || {};

    try {
        await Email.sendMail({
            from: process.env.EMAIL_USER || "alshrakynodeapp@gmail.com",
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
        await Email.sendMail({
            from: process.env.EMAIL_USER || "alshrakynodeapp@gmail.com",
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
        await Email.sendMail({
            from: process.env.EMAIL_USER || "alshrakynodeapp@gmail.com",
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
        await Email.sendMail({
            from: process.env.EMAIL_USER || "alshrakynodeapp@gmail.com",
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
