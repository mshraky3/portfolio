// Anonymous visitor data for the portfolio: visits, a few events, and the
// "How did it land?" section (an emoji-slider reaction, what brought someone
// here, and an optional one-line note that only the owner sees). Stored in the
// `portfolio` schema (see schema.sql) through DATABASE_URL. Without DATABASE_URL
// every route answers 503 and the page keeps working without the shared numbers.
//
// What is stored: a random id the browser made up, the country Vercel derives
// from the request, device and browser family, where the visit came from.
// Never an IP address, a name or an email.
import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import crypto from "node:crypto";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const INTENTS = ["hiring", "project", "looking", "friend"];
const EVENTS = new Set(["section", "cv", "contact", "react", "share"]); // "lock" is written by /unlock only

// The lock: a number only one person knows, set on Vercel as SPECIAL_NUMBER
// (digits only) with an optional SPECIAL_MESSAGE shown when it opens. Neither
// ever reaches the browser; the page only learns how many digits to show.
const secret = () => String(process.env.SPECIAL_NUMBER || "").replace(/\D/g, "");
function matches(code) {
  const want = secret();
  const got = String(code || "").replace(/\D/g, "");
  if (!want || got.length !== want.length) return false;
  return crypto.timingSafeEqual(Buffer.from(got), Buffer.from(want));
}

let pool = null;
function db() {
  if (!process.env.DATABASE_URL) return null;
  if (!pool) {
    const caFile = path.join(HERE, "supabase-ca.crt");
    pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: fs.existsSync(caFile) ? { ca: fs.readFileSync(caFile, "utf8") } : { rejectUnauthorized: false },
      max: 3,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 8000,
    });
    pool.on("error", (e) => console.warn("[visitors] pool", e.message));
  }
  return pool;
}

const clip = (v, n) => (typeof v === "string" && v ? v.slice(0, n) : null);
const countryOf = (req) => clip(String(req.headers["x-vercel-ip-country"] || "").toUpperCase(), 2);

function sourceOf(referrer, inApp, utm) {
  const s = `${utm || ""} ${inApp || ""} ${referrer || ""}`.toLowerCase();
  if (s.includes("instagram") || /\big\b/.test(s)) return "instagram";
  if (s.includes("linkedin")) return "linkedin";
  if (s.includes("google")) return "google";
  if (s.includes("github")) return "github";
  if (s.includes("facebook") || s.includes("fb")) return "facebook";
  if (s.includes("whatsapp") || s.includes("wa.me")) return "whatsapp";
  return referrer ? "other" : "direct";
}

function deviceOf(ua) {
  if (/ipad|tablet/i.test(ua)) return "tablet";
  if (/mobi|android|iphone/i.test(ua)) return "mobile";
  return "desktop";
}

function browserOf(ua) {
  if (/edg\//i.test(ua)) return "edge";
  if (/firefox|fxios/i.test(ua)) return "firefox";
  if (/chrome|crios/i.test(ua)) return "chrome";
  if (/safari/i.test(ua)) return "safari";
  return "other";
}

function inAppOf(ua) {
  if (/instagram/i.test(ua)) return "instagram";
  if (/fban|fbav/i.test(ua)) return "facebook";
  if (/linkedinapp/i.test(ua)) return "linkedin";
  return null;
}

// Everything the section shows: counts, the average reaction, why people came,
// and the latest reactions (score and country only).
async function summary(client, vid) {
  const [visits, avg, intents, recent, mine, tries] = await Promise.all([
    client.query(`select count(distinct vid)::int visitors,
                         count(distinct vid) filter (where source = 'instagram')::int instagram,
                         count(distinct country)::int countries
                  from portfolio.visits`),
    client.query("select count(score)::int reactions, coalesce(round(avg(score)), 0)::int average from portfolio.reactions"),
    client.query("select intent, count(*)::int n from portfolio.reactions where intent is not null group by intent"),
    client.query(`select score, country, extract(epoch from now() - updated_at)::int ago
                  from portfolio.reactions where score is not null order by updated_at desc limit 14`),
    vid ? client.query("select score, intent from portfolio.reactions where vid = $1", [vid]) : { rows: [] },
    client.query("select count(*)::int n from portfolio.events where kind = 'lock'"),
  ]);
  const split = Object.fromEntries(INTENTS.map((k) => [k, 0]));
  for (const r of intents.rows) if (r.intent in split) split[r.intent] = r.n;
  const lock = { digits: secret().length || 4, tries: tries.rows[0].n };
  return { ...visits.rows[0], ...avg.rows[0], intents: split, recent: recent.rows, mine: mine.rows[0] || null, lock };
}

// `notify({ kind, ... })` emails the owner (wired in api.js): kind is "note"
// (a visitor's one-liner), "unlock" (someone opened the lock) or "reply"
// (their message back).
export function visitorsRouter(rateLimit, notify = async () => {}) {
  const r = express.Router();

  r.use((req, res, next) => {
    if (!db()) return res.status(503).json({ enabled: false });
    next();
  });

  // One row per page load.
  r.post("/visit", rateLimit(30, 15 * 60 * 1000), async (req, res) => {
    const b = req.body || {};
    if (!UUID.test(b.vid || "")) return res.status(400).json({ error: "bad id" });
    const ua = String(req.headers["user-agent"] || "");
    let refHost = null;
    try {
      refHost = b.referrer ? new URL(b.referrer).hostname.replace(/^www\./, "").slice(0, 80) : null;
    } catch {
      refHost = null;
    }
    const inApp = inAppOf(ua);
    try {
      await db().query(
        `insert into portfolio.visits (vid, source, referrer, country, device, browser, in_app, lang, screen_w)
         values ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          b.vid,
          sourceOf(refHost, inApp, clip(b.utm, 40)),
          refHost,
          countryOf(req),
          deviceOf(ua),
          browserOf(ua),
          inApp,
          clip(b.lang, 12),
          Number.isFinite(b.w) ? Math.max(0, Math.min(10000, Math.round(b.w))) : null,
        ],
      );
      res.status(204).end();
    } catch (e) {
      console.warn("[visitors] visit", e.message);
      res.status(500).json({ error: "not saved" });
    }
  });

  // Small events: which chapter was reached, CV opened, contact tapped.
  r.post("/event", rateLimit(80, 15 * 60 * 1000), async (req, res) => {
    const b = req.body || {};
    if (!UUID.test(b.vid || "") || !EVENTS.has(b.kind)) return res.status(400).json({ error: "bad event" });
    try {
      await db().query("insert into portfolio.events (vid, kind, detail, value) values ($1, $2, $3, $4)", [
        b.vid,
        b.kind,
        clip(b.detail, 60),
        Number.isFinite(b.value) ? Math.round(b.value) : null,
      ]);
      res.status(204).end();
    } catch (e) {
      console.warn("[visitors] event", e.message);
      res.status(500).json({ error: "not saved" });
    }
  });

  // The reaction: a slider score and/or what brought them here. One per
  // visitor; sending again changes it. Answers with the fresh summary.
  r.post("/react", rateLimit(30, 15 * 60 * 1000), async (req, res) => {
    const b = req.body || {};
    const score = b.score == null ? null : Math.round(Number(b.score));
    const intent = b.intent == null ? null : String(b.intent);
    if (!UUID.test(b.vid || "")) return res.status(400).json({ error: "bad id" });
    if (score != null && !(score >= 0 && score <= 100)) return res.status(400).json({ error: "bad score" });
    if (intent != null && !INTENTS.includes(intent)) return res.status(400).json({ error: "bad intent" });
    if (score == null && intent == null) return res.status(400).json({ error: "nothing to save" });
    try {
      await db().query(
        `insert into portfolio.reactions (vid, score, intent, country) values ($1, $2, $3, $4)
         on conflict (vid) do update set
           score = coalesce(excluded.score, portfolio.reactions.score),
           intent = coalesce(excluded.intent, portfolio.reactions.intent),
           country = coalesce(excluded.country, portfolio.reactions.country),
           updated_at = now()`,
        [b.vid, score, intent, countryOf(req)],
      );
      res.json(await summary(db(), b.vid));
    } catch (e) {
      console.warn("[visitors] react", e.message);
      res.status(500).json({ error: "not saved" });
    }
  });

  // A one-line note to the owner. Stored, emailed to the owner, never shown.
  r.post("/note", rateLimit(4, 15 * 60 * 1000), async (req, res) => {
    const b = req.body || {};
    const note = String(b.note || "").trim().slice(0, 280);
    if (!UUID.test(b.vid || "") || !note) return res.status(400).json({ error: "bad note" });
    const country = countryOf(req);
    try {
      await db().query("insert into portfolio.notes (vid, note, country) values ($1, $2, $3)", [b.vid, note, country]);
      const mine = await db().query("select score, intent from portfolio.reactions where vid = $1", [b.vid]);
      // Awaited: on Vercel the function is frozen once the response is sent, so
      // an email started after that never leaves.
      try {
        await notify({ kind: "note", note, country, reaction: mine.rows[0] || null });
      } catch (e) {
        console.warn("[visitors] notify", e.message);
        return res.status(502).json({ error: "not sent" });
      }
      res.status(204).end();
    } catch (e) {
      console.warn("[visitors] note", e.message);
      res.status(500).json({ error: "not saved" });
    }
  });

  // Try the lock. Only whether it opened is stored, never the digits tried.
  // Slow on purpose: 8 tries per 15 minutes, so the number cannot be guessed
  // by brute force.
  r.post("/unlock", rateLimit(8, 15 * 60 * 1000), async (req, res) => {
    const b = req.body || {};
    if (!UUID.test(b.vid || "")) return res.status(400).json({ error: "bad id" });
    // A global brake as well, since a visitor id is easy to change.
    try {
      const recent = await db().query("select count(*)::int n from portfolio.events where kind = 'lock' and created_at > now() - interval '1 minute'");
      if (recent.rows[0].n >= 30) return res.status(429).json({ error: "slow down" });
    } catch (e) {
      console.warn("[visitors] lock brake", e.message);
    }
    const open = matches(b.code);
    const country = countryOf(req);
    try {
      await db().query("insert into portfolio.events (vid, kind, detail) values ($1, 'lock', $2)", [b.vid, open ? "open" : "miss"]);
    } catch (e) {
      console.warn("[visitors] lock", e.message);
    }
    if (!open) return res.json({ open: false });
    try {
      await notify({ kind: "unlock", country });
    } catch (e) {
      console.warn("[visitors] notify", e.message);
    }
    res.json({ open: true, message: process.env.SPECIAL_MESSAGE || "Well done. You found the way in." });
  });

  // A message back, only for someone who opened the lock (the code is checked again).
  r.post("/unlock/reply", rateLimit(4, 15 * 60 * 1000), async (req, res) => {
    const b = req.body || {};
    const message = String(b.message || "").trim().slice(0, 1000);
    if (!UUID.test(b.vid || "") || !message || !matches(b.code)) return res.status(400).json({ error: "bad reply" });
    const country = countryOf(req);
    try {
      await db().query("insert into portfolio.notes (vid, note, country) values ($1, $2, $3)", [b.vid, `[lock] ${message}`.slice(0, 280), country]);
    } catch (e) {
      console.warn("[visitors] reply", e.message);
    }
    try {
      await notify({ kind: "reply", note: message, country });
      res.status(204).end();
    } catch (e) {
      console.warn("[visitors] reply notify", e.message);
      res.status(502).json({ error: "not sent" });
    }
  });

  r.get("/summary", rateLimit(60, 15 * 60 * 1000), async (req, res) => {
    const vid = UUID.test(String(req.query.vid || "")) ? String(req.query.vid) : null;
    try {
      res.set("Cache-Control", "no-store");
      res.json(await summary(db(), vid));
    } catch (e) {
      console.warn("[visitors] summary", e.message);
      res.status(500).json({ error: "unavailable" });
    }
  });

  return r;
}
