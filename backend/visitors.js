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

const HERE = path.dirname(fileURLToPath(import.meta.url));
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const INTENTS = ["hiring", "project", "looking", "friend"];
const EVENTS = new Set(["section", "cv", "contact", "react", "share"]);

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
  const [visits, avg, intents, recent, mine] = await Promise.all([
    client.query(`select count(distinct vid)::int visitors,
                         count(distinct vid) filter (where source = 'instagram')::int instagram,
                         count(distinct country)::int countries
                  from portfolio.visits`),
    client.query("select count(score)::int reactions, coalesce(round(avg(score)), 0)::int average from portfolio.reactions"),
    client.query("select intent, count(*)::int n from portfolio.reactions where intent is not null group by intent"),
    client.query(`select score, country, extract(epoch from now() - updated_at)::int ago
                  from portfolio.reactions where score is not null order by updated_at desc limit 14`),
    vid ? client.query("select score, intent from portfolio.reactions where vid = $1", [vid]) : { rows: [] },
  ]);
  const split = Object.fromEntries(INTENTS.map((k) => [k, 0]));
  for (const r of intents.rows) if (r.intent in split) split[r.intent] = r.n;
  return { ...visits.rows[0], ...avg.rows[0], intents: split, recent: recent.rows, mine: mine.rows[0] || null };
}

// `notify({ kind, ... })` emails the owner (wired in api.js): kind is "note"
// (a visitor's one-liner) or "share" (a photo and/or a link, with a caption).
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

  // "Share your work": a photo and/or a link, with an optional line, emailed
  // to the owner (the photo as an attachment). The browser shrinks photos
  // first; all that is stored here is a line saying something was shared.
  // Large bodies are accepted on this route only (see api.js).
  r.post("/share", express.json({ limit: "3mb" }), rateLimit(4, 60 * 60 * 1000), async (req, res) => {
    const b = req.body || {};
    if (!UUID.test(b.vid || "")) return res.status(400).json({ error: "bad id" });
    let image = null;
    if (b.image) {
      const m = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(String(b.image));
      if (!m) return res.status(400).json({ error: "bad photo" });
      if (m[2].length > 1900 * 1024) return res.status(413).json({ error: "photo too large" });
      image = { type: m[1], base64: m[2] };
    }
    let link = null;
    if (b.link) {
      try {
        const u = new URL(String(b.link).trim());
        if (!/^https?:$/.test(u.protocol)) throw new Error("protocol");
        link = u.toString().slice(0, 500);
      } catch {
        return res.status(400).json({ error: "bad link" });
      }
    }
    if (!image && !link) return res.status(400).json({ error: "nothing to share" });
    const caption = String(b.caption || "").trim().slice(0, 500);
    const country = countryOf(req);
    try {
      await db().query("insert into portfolio.notes (vid, note, country) values ($1, $2, $3)", [
        b.vid,
        `[share${image ? " photo" : ""}${link ? " link" : ""}] ${caption}`.slice(0, 280),
        country,
      ]);
    } catch (e) {
      console.warn("[visitors] share row", e.message);
    }
    try {
      await notify({ kind: "share", note: caption, country, image, link });
      res.status(204).end();
    } catch (e) {
      console.warn("[visitors] share notify", e.message);
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
