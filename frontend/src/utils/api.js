// Talks to the portfolio API: the contact note, and the anonymous visitor data
// behind the reactions section and its live numbers (backend/visitors.js).
// Every call is best-effort: if the API or its database is down, the page
// carries on and the shared numbers simply do not show.

export const API_URL = import.meta.env.VITE_API_BASE || "https://portfolio-api-rose.vercel.app";

const KEY = "pf-vid";

// A random id made up by this browser, so repeat visits and one vote per person
// can be told apart. It identifies nobody.
export function visitorId() {
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

async function call(path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method: body ? "POST" : "GET",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    keepalive: Boolean(body),
  });
  if (res.status === 204) return null;
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

let visited = false;
export function trackVisit() {
  if (visited || typeof window === "undefined") return;
  visited = true;
  const q = new URLSearchParams(window.location.search);
  call("/v/visit", {
    vid: visitorId(),
    referrer: document.referrer || null,
    utm: q.get("utm_source") || q.get("from") || null,
    lang: navigator.language || null,
    w: window.innerWidth,
  }).catch(() => {});
}

const sent = new Set();
// Sends an event; `once` keeps it to one per page load (e.g. "reached a chapter").
export function track(kind, detail, { value, once = false } = {}) {
  const key = `${kind}:${detail}`;
  if (once && sent.has(key)) return;
  sent.add(key);
  call("/v/event", { vid: visitorId(), kind, detail, value }).catch(() => {});
}

export const getSummary = () => call(`/v/summary?vid=${visitorId()}`);
export const sendReaction = (fields) => call("/v/react", { vid: visitorId(), ...fields });
export const sendWhisper = (note) => call("/v/note", { vid: visitorId(), note });
export const sendNote = (message, reply) => call("/send-email", { message, reply });
export const tryLock = (code) => call("/v/unlock", { vid: visitorId(), code });
export const replyLock = (code, message) => call("/v/unlock/reply", { vid: visitorId(), code, message });
