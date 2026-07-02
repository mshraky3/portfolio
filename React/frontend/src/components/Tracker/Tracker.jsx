import { useState, useEffect, useMemo, useRef } from "react";
import "./Tracker.css";

/*
 * PRIVATE JOB-HUNT TRACKER — local-only, passphrase-gated.
 * Reached at:  <site>/#/hq   (see SECRET_HASH in main.jsx)
 * All data lives in this browser's localStorage. Nothing is sent anywhere.
 * Use Export/Import (top-right) to back up or move to another device.
 */

const DATA_KEY = "jht_data_v1";
const PASS_KEY = "jht_pass_v1";

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

const DEFAULT_DATA = {
  jobs: [],
  skills: SEED_SKILLS,
  courses: SEED_COURSES,
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
        </form>
      </div>
    );
  }
  return <Board />;
}

function Board() {
  const [data, setData] = useState(load);
  const [tab, setTab] = useState("jobs");
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
        <Stat
          label="Days to target"
          value={daysLeft === null ? "—" : daysLeft}
          accent={daysLeft !== null && daysLeft < 10 ? "#e05260" : "#C147E9"}
        />
      </div>

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
        {[["jobs", "Jobs"], ["skills", "Skills gap"], ["courses", "Courses"]].map(([k, t]) => (
          <button key={k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{t}</button>
        ))}
      </nav>

      {tab === "jobs" && <Jobs data={data} setData={setData} counts={counts} />}
      {tab === "skills" && <Skills data={data} setData={setData} />}
      {tab === "courses" && <Courses data={data} setData={setData} />}
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

function Jobs({ data, setData, counts }) {
  const [form, setForm] = useState({ company: "", role: "", link: "", source: "LinkedIn" });
  const [filter, setFilter] = useState("All");

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
        {shown.map((j) => (
          <div className="hq-job" key={j.id} style={{ borderLeftColor: STATUS_COLOR[j.status] }}>
            <div className="hq-job-head">
              <div className="hq-job-title">
                <strong>{j.company}</strong>
                {j.role && <span> — {j.role}</span>}
                {j.link && <a href={j.link} target="_blank" rel="noreferrer" className="hq-job-link">↗</a>}
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
            <textarea className="hq-job-notes" placeholder="What did I do? (tailored resume? cover note? who I contacted? interview notes?)"
                      defaultValue={j.notes} onBlur={(e) => upd(j.id, { notes: e.target.value })} />
          </div>
        ))}
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
