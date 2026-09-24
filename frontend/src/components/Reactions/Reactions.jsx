import { useEffect, useRef, useState } from "react";
import { getSummary, sendReaction, sendShare, sendWhisper, track } from "../../utils/api";
import "./Reactions.css";

// The end of the page is for the visitor, especially one arriving from a
// social-media story: tap what brought you here, tell me one thing, or share
// your work (an image or a link). Everything reaches only me.

const INTENTS = [
  { id: "hiring", icon: "💼", label: "I'm hiring" },
  { id: "project", icon: "💡", label: "I have a project" },
  { id: "looking", icon: "👀", label: "Just looking" },
  { id: "friend", icon: "👋", label: "I know you" },
];

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
      <p className="rx-hint">Something you did today, a tip, a hello. Only I see it.</p>
      <textarea id="rx-note" rows={3} maxLength={280} placeholder="Type it here..." value={note} onChange={(e) => setNote(e.target.value)} />
      <button className="btn btn-primary" type="submit" disabled={state === "sending" || !note.trim()}>
        {state === "sending" ? "Sending..." : "Send"}
      </button>
      <p className="rx-hint" role="status" data-state={state}>
        {state === "sent" && "Got it. Thank you!"}
        {state === "error" && "Didn't send. WhatsApp works too."}
      </p>
    </form>
  );
}

// Shrinks a photo in the browser (longest side 1280 px, JPEG) before it is sent,
// so it uploads fast on a phone and stays well under the email size limit.
async function shrink(file) {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, 1280 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close?.();
  return canvas.toDataURL("image/jpeg", 0.8);
}

const isLink = (v) => {
  try {
    const u = new URL(v.trim());
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
};

// "Share your work with me": a photo (camera or upload) and/or a link to
// something worth watching, with a line about it.
function Share() {
  const camera = useRef(null);
  const library = useRef(null);
  const [image, setImage] = useState(null);
  const [showLink, setShowLink] = useState(false);
  const [link, setLink] = useState("");
  const [caption, setCaption] = useState("");
  const [state, setState] = useState("idle"); // idle | reading | sending | sent | error | unreadable

  async function onFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setState("reading");
    try {
      setImage(await shrink(file));
      setState("idle");
    } catch {
      setState("unreadable");
    }
  }

  const linkOk = link.trim() === "" || isLink(link);
  const ready = (image || isLink(link)) && linkOk;

  async function onSend(e) {
    e.preventDefault();
    if (!ready) return;
    setState("sending");
    try {
      await sendShare({ image, link: link.trim() || undefined, caption: caption.trim() });
      track("share", image && link.trim() ? "photo+link" : image ? "photo" : "link");
      setState("sent");
      setImage(null);
      setLink("");
      setShowLink(false);
      setCaption("");
    } catch {
      setState("error");
    }
  }

  const hintState = state === "sent" ? "sent" : state === "error" || state === "unreadable" ? "error" : undefined;
  return (
    <form className="rx-card rx-share" onSubmit={onSend}>
      <p className="rx-q">Share your work with me</p>
      <p className="rx-hint">A project, a design, a demo you want me to see. It comes straight to me.</p>

      <input ref={camera} type="file" accept="image/*" capture="environment" hidden onChange={onFile} />
      <input ref={library} type="file" accept="image/*" hidden onChange={onFile} />

      {image ? (
        <div className="rx-preview">
          <img src={image} alt="The image you are about to share" />
          <button type="button" className="rx-remove" onClick={() => setImage(null)} aria-label="Remove this image">
            ✕
          </button>
        </div>
      ) : null}

      <div className="rx-pick">
        {!image ? (
          <>
            <button type="button" className="rx-pick-btn" onClick={() => camera.current?.click()}>
              <span aria-hidden="true">📷</span> Open camera
            </button>
            <button type="button" className="rx-pick-btn" onClick={() => library.current?.click()}>
              <span aria-hidden="true">🖼️</span> Upload an image
            </button>
          </>
        ) : null}
        {!showLink ? (
          <button type="button" className="rx-pick-btn" onClick={() => setShowLink(true)}>
            <span aria-hidden="true">🔗</span> Add a link
          </button>
        ) : null}
      </div>

      {showLink ? (
        <input
          className="rx-caption"
          type="url"
          inputMode="url"
          placeholder="https://... (a repo, a demo, a video)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          aria-label="Link to your work"
          aria-invalid={!linkOk || undefined}
        />
      ) : null}

      {image || showLink ? (
        <>
          <textarea className="rx-caption" rows={2} maxLength={500} placeholder="What should I look at? (optional)" value={caption} onChange={(e) => setCaption(e.target.value)} aria-label="A line about it" />
          <button className="btn btn-primary" type="submit" disabled={state === "sending" || !ready}>
            {state === "sending" ? "Sending..." : "Share"}
          </button>
        </>
      ) : null}

      <p className="rx-hint" role="status" data-state={hintState}>
        {state === "reading" && "Getting it ready..."}
        {state === "sent" && "Got it. I'll take a look."}
        {state === "error" && "Didn't send. Try again in a minute."}
        {state === "unreadable" && "Couldn't read that image. Try another one."}
        {state !== "sent" && !linkOk && "That link doesn't look right. Start it with https://"}
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

  return (
    <section className="section rx" id="react" ref={ref} aria-labelledby="rx-title">
      <div className="wrap rx-in">
        <div className="section-head">
          <p className="eyebrow">Before you go</p>
          <h2 id="rx-title">Your turn</h2>
          <p>A tap, a line, or something you made. No sign-up, and it only reaches me.</p>
        </div>

        <div className="rx-grid">
          <Intent summary={online ? summary : null} onSaved={setSummary} />
          <Whisper />
          <Share />
        </div>

      </div>
    </section>
  );
}
