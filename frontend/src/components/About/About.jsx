import { useEffect, useRef, useState } from "react";
import { ABOUT, SKILLS } from "../../data/content";
import "./About.css";

// The logo as an exploded view, like the rest of the site: its triangle, its
// circuitry and its teal details lift apart into layers when the section comes
// into view, and the stack tilts a little toward the pointer.
const LAYERS = ["frame", "circuit", "accent"];

function Logo() {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([e]) => setOpen(e.isIntersecting), { threshold: 0.45 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--px", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    el.style.setProperty("--py", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  };
  const reset = () => {
    ref.current?.style.setProperty("--px", "0");
    ref.current?.style.setProperty("--py", "0");
  };

  return (
    <div className="about-logo" ref={ref} data-open={open} onPointerMove={onMove} onPointerLeave={reset} role="img" aria-label="My logo, a serpent inside a circuit-board pyramid, shown as an exploded view">
      <div className="logo-stack">
        <svg className="logo-layer logo-plate" viewBox="0 0 512 417" aria-hidden="true">
          <polygon points="253.5,15 85,397 424,397" />
        </svg>
        {LAYERS.map((name, i) => (
          <img key={name} className="logo-layer" style={{ "--z": i + 1 }} src={`/about/logo-${name}.webp`} alt="" width="512" height="417" loading="lazy" decoding="async" />
        ))}
      </div>
    </div>
  );
}

export default function About() {
  return (
    <section className="section about" id="about" aria-labelledby="about-title">
      <div className="wrap about-grid">
        <Logo />
        <div className="about-text">
          <p className="eyebrow">About me</p>
          <h2 id="about-title">{ABOUT.lead}</h2>
          <ul className="about-chips">
            {ABOUT.chips.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <dl className="about-skills">
            {SKILLS.map((g) => (
              <div key={g.group}>
                <dt>{g.group}</dt>
                <dd>
                  {g.items.map(([name, where]) => (
                    <span key={name} title={`Used in: ${where}`}>
                      {name}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
