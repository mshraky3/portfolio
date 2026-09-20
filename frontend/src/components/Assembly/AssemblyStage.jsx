import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { canRun3D } from "../../utils/capabilities";
import { useScrollProgress } from "./useScrollProgress";
import { progressForLayer } from "./timeline";
import TechDetails from "./TechDetails";
import "./Assembly.css";

const AssemblyScene = lazy(() => import("./AssemblyScene"));

// A tall section with a sticky 3D stage. Scrolling builds the system: each
// module flies in and snaps onto the stack, then plays a small story about what
// it does. Captions are plain language; the routes, tables and files behind each
// module are in the collapsible "Technical details" underneath.
export default function AssemblyStage({ id, data, layers, intro, outroAction, label, tech = true }) {
  const n = layers.length;
  const ref = useRef(null);
  const [use3D] = useState(() => canRun3D());
  const [phase, setPhase] = useState({ key: "intro", i: -1 });
  const [visible, setVisible] = useState(true);
  const onPhase = useCallback((p) => setPhase(p), []);
  const progress = useScrollProgress(ref, n, onPhase);

  useEffect(() => {
    const el = ref.current;
    if (!el || !use3D) return undefined;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "80px" });
    io.observe(el);
    return () => io.disconnect();
  }, [use3D]);

  const jump = (i) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (el.offsetHeight - window.innerHeight) * progressForLayer(i, n) });
  };

  if (!use3D) {
    return (
      <section id={id} className="as-static" aria-label={label}>
        <div className="wrap">
          <div className="as-static-intro">{intro}</div>
          <ol className="as-steps-list">
            {layers.map((l) => (
              <li key={l.name}>
                <h3>{l.step.title}</h3>
                <p>{l.step.text}</p>
                <ul>{l.step.facts.map((f) => <li key={f}>{f}</li>)}</ul>
              </li>
            ))}
          </ol>
          {outroAction}
          {tech ? <TechDetails layers={layers} /> : null}
        </div>
      </section>
    );
  }

  return (
    <>
      <section ref={ref} id={id} className="as" style={{ "--n": n }} aria-label={label}>
        <div className="as-sticky">
          <div className="as-canvas">
            <Suspense fallback={<div className="as-loading">Loading 3D scene</div>}>
              <AssemblyScene layers={layers} progress={progress} visible={visible} />
            </Suspense>
          </div>

          <div className="as-copy">
            <div className="wrap as-copy-in">
              <div className="as-item as-item-intro" data-active={phase.key === "intro"}>
                {intro}
              </div>
              {layers.map((l, i) => (
                <div className="as-item" key={l.name} data-active={phase.i === i}>
                  <p className="as-count">
                    Part {i + 1} of {n}
                  </p>
                  <h2 className="as-title">{l.step.title}</h2>
                  <p className="as-text">{l.step.text}</p>
                  <ul className="as-facts">
                    {l.step.facts.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="as-item" data-active={phase.key === "outro"}>
                <p className="as-big">{data.outro}</p>
                {outroAction}
              </div>
            </div>
          </div>

          <nav className="as-dots" aria-label={`${label}, parts`}>
            {layers.map((l, i) => (
              <button key={l.name} type="button" data-active={phase.i === i} aria-label={`Go to part ${i + 1}: ${l.name}`} onClick={() => jump(i)}>
                <span>{l.name}</span>
              </button>
            ))}
          </nav>
          <div className="as-bar" aria-hidden="true">
            <span />
          </div>
        </div>
        <ol className="visually-hidden">
          {layers.map((l) => (
            <li key={l.name}>
              {l.step.title}. {l.step.text} {l.step.facts.join(". ")}
            </li>
          ))}
        </ol>
      </section>
      {tech ? (
        <div className="as-tech-wrap">
          <div className="wrap">
            <TechDetails layers={layers} />
          </div>
        </div>
      ) : null}
    </>
  );
}
