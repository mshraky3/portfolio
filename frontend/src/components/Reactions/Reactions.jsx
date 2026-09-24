import { useEffect, useRef, useState } from "react";
import { getSummary, sendReaction, sendWhisper, track } from "../../utils/api";
import Lock from "./Lock";
import "./Reactions.css";

// The end of the page is for the visitor, especially one arriving from a
// social-media story: drag an emoji to react, try to crack the code, tap what
// brought you here, leave me a line. Quick touches, no sign-up.

const FACES = ["😐", "🙂", "😊", "😍", "🔥"];
const faceFor = (v) => FACES[Math.min(FACES.length - 1, Math.floor(v / 20))];
const WORDS = ["Meh", "Nice", "Really good", "Love it", "On fire"];
const wordFor = (v) => WORDS[Math.min(WORDS.length - 1, Math.floor(v / 20))];

const INTENTS = [
  { id: "hiring", icon: "💼", label: "I'm hiring" },
  { id: "project", icon: "💡", label: "I have a project" },
  { id: "looking", icon: "👀", label: "Just looking" },
  { id: "friend", icon: "👋", label: "I know you" },
];

// Two-letter country code to its flag emoji.
const flag = (cc) => (cc && /^[A-Z]{2}$/.test(cc) ? String.fromCodePoint(...[...cc].map((c) => 0x1f1a5 + c.charCodeAt(0))) : "🌍");
function ago(s) {
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function Slider({ summary, onSaved }) {
  const [value, setValue] = useState(70);
  const [dragging, setDragging] = useState(false);
  const [sent, setSent] = useState(false);
  const [bursts, setBursts] = useState([]);
  const timer = useRef(0);
  const touched = useRef(false);

  // Show the visitor's earlier reaction if they come back.
  useEffect(() => {
    if (!touched.current && summary?.mine?.score != null) {
      setValue(summary.mine.score);
      setSent(true);
    }
  }, [summary]);

  const submit = (v) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(async () => {
      setSent(true);
      setBursts((b) => [...b.slice(-3), { id: Date.now(), v }]);
      track("react", "slider", { value: v });
      try {
        onSaved(await sendReaction({ score: v }));
      } catch {
        // no database: the reaction still shows locally
      }
    }, 450);
  };

  const onInput = (e) => {
    touched.current = true;
    const v = Number(e.target.value);
    setValue(v);
    submit(v);
  };

  const avg = summary?.reactions ? summary.average : null;
  return (
    <div className="rx-slider-card">
      <p className="rx-q">How did this portfolio land?</p>
      <div className="rx-slider" data-dragging={dragging || undefined} style={{ "--v": value / 100 }}>
        <div className="rx-track" aria-hidden="true">
          <span className="rx-fill" />
          {avg != null && sent ? (
            <span className="rx-avg" style={{ "--a": avg / 100 }}>
              <span>{faceFor(avg)}</span>
            </span>
          ) : null}
        </div>
        <span className="rx-thumb" aria-hidden="true">
          {faceFor(value)}
          {bursts.map((b) => (
            <span key={b.id} className="rx-burst">
              {[0, 1, 2, 3, 4, 5].map((k) => (
                <span key={k} style={{ "--k": k }}>
                  {faceFor(b.v)}
                </span>
              ))}
            </span>
          ))}
        </span>
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={onInput}
          onPointerDown={() => setDragging(true)}
          onPointerUp={() => setDragging(false)}
          onPointerCancel={() => setDragging(false)}
          aria-label="Your reaction, from meh to on fire"
          aria-valuetext={wordFor(value)}
        />
      </div>
      <p className="rx-word" aria-live="polite">
        {sent ? (
          <>
            You: <strong>{wordFor(value)}</strong>
            {avg != null ? (
              <>
                {" "}
                · Everyone: <strong>{wordFor(avg)} {faceFor(avg)}</strong> from {summary.reactions} {summary.reactions === 1 ? "person" : "people"}
              </>
            ) : null}
          </>
        ) : (
          "Drag the emoji. Let go to send."
        )}
      </p>
    </div>
  );
}

function Intent({ summary, onSaved }) {
  const [picked, setPicked] = useState(null);
  const chosen = picked || summary?.mine?.intent || null;
  const split = summary?.intents;
  const total = split ? Object.values(split).reduce((a, b) => a + b, 0) : 0;

  async function pick(id) {
    setPicked(id);
    track("react", `intent:${id}`);
    try {
      onSaved(await sendReaction({ intent: id }));
    } catch {
      // no database: the choice still shows as picked
    }
  }

  return (
    <div className="rx-card">
      <p className="rx-q">What brought you here?</p>
      <ul className="rx-intents">
        {INTENTS.map((o) => {
          const pct = total ? Math.round(((split?.[o.id] || 0) / total) * 100) : 0;
          const show = Boolean(chosen && split && total);
          return (
            <li key={o.id}>
              <button type="button" className="rx-intent" data-picked={chosen === o.id || undefined} aria-pressed={chosen === o.id} onClick={() => pick(o.id)}>
                <span className="rx-bar" style={{ transform: `scaleX(${show ? pct / 100 : 0})` }} aria-hidden="true" />
                <span className="rx-icon" aria-hidden="true">
                  {o.icon}
                </span>
                <span className="rx-label">{o.label}</span>
                {show ? <span className="rx-pct">{pct}%</span> : null}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Whisper() {
  const [note, setNote] = useState("");
  const [state, setState] = useState("idle"); // idle | sending | sent | error

  async function onSubmit(e) {
    e.preventDefault();
    if (!note.trim()) return;
    setState("sending");
    try {
      await sendWhisper(note.trim());
      track("react", "note");
      setState("sent");
      setNote("");
    } catch {
      setState("error");
    }
  }

  return (
    <form className="rx-card rx-note" onSubmit={onSubmit}>
      <label className="rx-q" htmlFor="rx-note">
        Tell me one thing
      </label>
      <p className="rx-hint">A tip, a question, a hello. Only I see it.</p>
      <div className="rx-note-row">
        <input id="rx-note" maxLength={280} placeholder="Type it here..." value={note} onChange={(e) => setNote(e.target.value)} />
        <button className="btn btn-primary" type="submit" disabled={state === "sending" || !note.trim()}>
          {state === "sending" ? "..." : "Send"}
        </button>
      </div>
      <p className="rx-hint" role="status" data-state={state}>
        {state === "sent" && "Sent. Thank you!"}
        {state === "error" && "Didn't send. WhatsApp works too."}
      </p>
    </form>
  );
}

export default function Reactions() {
  const ref = useRef(null);
  const [near, setNear] = useState(false);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: "50% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!near || summary) return;
    getSummary().then(setSummary).catch(() => {});
  }, [near, summary]);

  const online = Boolean(summary && !summary.error);
  const recent = online ? summary.recent || [] : [];

  return (
    <section className="section rx" id="react" ref={ref} aria-labelledby="rx-title">
      {recent.length ? (
        <div className="rx-float" aria-hidden="true">
          {recent.map((r, i) => (
            <span key={i} style={{ "--i": i, "--x": `${(i * 37) % 100}%` }}>
              {faceFor(r.score)}
            </span>
          ))}
        </div>
      ) : null}
      <div className="wrap rx-in">
        <div className="section-head">
          <p className="eyebrow">Before you go</p>
          <h2 id="rx-title">Your turn</h2>
          <p>Slide, tap, done. No sign-up, nothing personal stored.</p>
        </div>

        <Slider summary={online ? summary : null} onSaved={setSummary} />

        <Lock digits={summary?.lock?.digits || 4} tries={summary?.lock?.tries || 0} online={online} />

        <div className="rx-grid">
          <Intent summary={online ? summary : null} onSaved={setSummary} />
          <Whisper />
        </div>

        {online ? (
          <div className="rx-live">
            <p className="rx-stats">
              <strong>{summary.visitors}</strong> visitors · <strong>{summary.instagram}</strong> from Instagram · <strong>{summary.countries}</strong>{" "}
              {summary.countries === 1 ? "country" : "countries"}
            </p>
            {recent.length ? (
              <ul className="rx-recent" aria-label="Latest reactions">
                {recent.slice(0, 8).map((r, i) => (
                  <li key={i}>
                    <span aria-hidden="true">{flag(r.country)}</span> {faceFor(r.score)} <span className="rx-ago">{ago(r.ago)}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
