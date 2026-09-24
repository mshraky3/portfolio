import { useEffect, useRef, useState } from "react";
import { replyLock, tryLock, track } from "../../utils/api";

// A combination lock with a number only one person knows. Anyone can try it;
// only the right number opens it, shows a message and lets that person write
// back. The number is checked on the server and never ships in the page.

const STEP = 36; // degrees per digit on the wheel
const FACE_H = 64; // px, height of one digit face
const RADIUS = Math.round(FACE_H / 2 / Math.tan(Math.PI / 10)); // 10 faces round the drum

function Dial({ value, onChange, index, disabled }) {
  const drag = useRef(null);
  const turn = (d) => !disabled && onChange((value + d + 10) % 10);

  const onPointerDown = (e) => {
    if (disabled) return;
    drag.current = { y: e.clientY, v: value };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!drag.current) return;
    const steps = Math.round((drag.current.y - e.clientY) / 26);
    onChange((((drag.current.v + steps) % 10) + 10) % 10);
  };
  const end = () => {
    drag.current = null;
  };
  const onKey = (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      turn(1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      turn(-1);
    } else if (/^[0-9]$/.test(e.key)) {
      onChange(Number(e.key));
    }
  };

  return (
    <div className="dial">
      <button type="button" className="dial-arrow" onClick={() => turn(1)} disabled={disabled} aria-label={`Digit ${index + 1} up`}>
        ▲
      </button>
      <div
        className="dial-window"
        role="spinbutton"
        tabIndex={disabled ? -1 : 0}
        aria-label={`Digit ${index + 1}`}
        aria-valuemin={0}
        aria-valuemax={9}
        aria-valuenow={value}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={end}
        onPointerCancel={end}
        onKeyDown={onKey}
      >
        <div className="dial-drum" style={{ transform: `translateZ(-${RADIUS}px) rotateX(${value * STEP}deg)` }}>
          {Array.from({ length: 10 }, (_, d) => (
            <span key={d} className="dial-face" style={{ transform: `rotateX(${-d * STEP}deg) translateZ(${RADIUS}px)` }} aria-hidden="true">
              {d}
            </span>
          ))}
        </div>
      </div>
      <button type="button" className="dial-arrow" onClick={() => turn(-1)} disabled={disabled} aria-label={`Digit ${index + 1} down`}>
        ▼
      </button>
    </div>
  );
}

export default function Lock({ digits = 4, tries = 0, online }) {
  const [code, setCode] = useState(() => Array(digits).fill(0));
  const [state, setState] = useState("idle"); // idle | trying | miss | open | slow | error
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [sent, setSent] = useState("idle");
  const [typed, setTyped] = useState("");

  // The number of dials follows the server (it only says how many digits).
  useEffect(() => {
    setCode((c) => (c.length === digits ? c : Array(digits).fill(0)));
  }, [digits]);

  // Type the message out once the lock opens.
  useEffect(() => {
    if (state !== "open" || !message) return undefined;
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setTyped(message.slice(0, i));
      if (i >= message.length) window.clearInterval(id);
    }, 45);
    return () => window.clearInterval(id);
  }, [state, message]);

  const setDigit = (i) => (v) => {
    setCode((c) => c.map((x, k) => (k === i ? v : x)));
    if (state === "miss") setState("idle");
  };

  async function onTry(e) {
    e.preventDefault();
    setState("trying");
    try {
      const res = await tryLock(code.join(""));
      if (res?.open) {
        setMessage(res.message || "");
        setState("open");
        track("react", "lock-open");
      } else {
        setState("miss");
      }
    } catch (err) {
      setState(String(err?.message) === "429" ? "slow" : "error");
    }
  }

  async function onReply(e) {
    e.preventDefault();
    if (!reply.trim()) return;
    setSent("sending");
    try {
      await replyLock(code.join(""), reply.trim());
      setSent("sent");
      setReply("");
    } catch {
      setSent("error");
    }
  }

  const open = state === "open";
  return (
    <div className="lock-card" data-state={state}>
      <div className="lock-head">
        <p className="eyebrow">A number between us</p>
        <h3 className="lock-title">{open ? "It opened." : "Only one person knows this number."}</h3>
        {!open ? <p className="lock-sub">If that's you, dial it in. Everyone else is welcome to guess.</p> : null}
      </div>

      <form className="lock-body" onSubmit={onTry}>
        <div className="lock-shackle" aria-hidden="true" />
        <div className="lock-case">
          <div className="dials" data-miss={state === "miss" || undefined}>
            {code.map((v, i) => (
              <Dial key={i} index={i} value={v} onChange={setDigit(i)} disabled={open || state === "trying"} />
            ))}
          </div>
          {!open ? (
            <button className="btn btn-primary lock-go" type="submit" disabled={state === "trying" || !online}>
              {state === "trying" ? "Checking..." : "Unlock"}
            </button>
          ) : null}
        </div>
      </form>

      <p className="lock-status" role="status">
        {state === "miss" && "Not this one."}
        {state === "slow" && "Too many tries. Come back in a few minutes."}
        {state === "error" && "The lock is not answering right now."}
        {state === "idle" && online && tries > 0 && `${tries} ${tries === 1 ? "try" : "tries"} so far.`}
        {!online && "The lock wakes up in a moment."}
      </p>

      {open ? (
        <div className="lock-open">
          {message ? (
            <p className="lock-message">
              {typed}
              <span className="lock-caret" aria-hidden="true" />
            </p>
          ) : null}
          <form className="lock-reply" onSubmit={onReply}>
            <label htmlFor="lock-reply">Say something back. Only I will see it.</label>
            <textarea id="lock-reply" rows={3} maxLength={1000} value={reply} onChange={(e) => setReply(e.target.value)} />
            <button className="btn btn-primary" type="submit" disabled={sent === "sending" || !reply.trim()}>
              {sent === "sending" ? "Sending..." : "Send"}
            </button>
            <p className="lock-status" role="status">
              {sent === "sent" && "Sent. I'll see it."}
              {sent === "error" && "It didn't send. Try again in a minute."}
            </p>
          </form>
        </div>
      ) : null}
    </div>
  );
}
