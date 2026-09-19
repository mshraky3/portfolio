import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { canRun3D } from "../../utils/capabilities";
import LayerInspector from "./LayerInspector";
import { useScrollProgress } from "./useScrollProgress";
import { progressForLayer, T } from "./timeline";
import "./Teardown.css";

const TeardownScene = lazy(() => import("./TeardownScene"));

// A tall section with a sticky 3D stage. Scrolling explodes the system, then
// flies the camera through its layers one at a time; each layer shows its real
// content and a caption written from the code. Without WebGL it falls back to
// the layer inspector plus the same captions as a plain list.
export default function TeardownStage({ id, data, layers, intro, dark = true, extras, outroAction, label }) {
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
    const total = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + total * progressForLayer(i, n) });
  };

  if (!use3D) {
    return (
      <section id={id} className={`td-static ${dark ? "td-dark on-dark" : ""}`} aria-label={label}>
        <div className="wrap">
          <div className="td-static-intro">{intro}</div>
          <LayerInspector layers={layers} label={label} />
          <ol className="td-steps-list">
            {layers.map((l) => (
              <li key={l.name}>
                <h3>{l.step.title}</h3>
                <p>{l.step.text}</p>
                <ul>{l.step.facts.map((f) => <li key={f}>{f}</li>)}</ul>
              </li>
            ))}
          </ol>
          {outroAction}
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} id={id} className={`td ${dark ? "td-dark on-dark" : ""}`} style={{ "--n": n }} aria-label={label}>
      <div className="td-sticky">
        <div className="td-canvas">
          <Suspense fallback={<div className="td-loading">Loading 3D scene</div>}>
            <TeardownScene layers={layers} progress={progress} visible={visible} hotIndex={phase.i} extras={extras} />
          </Suspense>
        </div>

        <div className="td-copy">
          <div className="wrap td-copy-in">
            <div className="td-item td-item-intro" data-active={phase.key === "intro"}>
              {intro}
            </div>
            <div className="td-item" data-active={phase.key === "overview"}>
              <p className="td-big">{data.overview}</p>
            </div>
            {layers.map((l, i) => (
              <div className="td-item" key={l.name} data-active={phase.i === i}>
                <p className="td-count">
                  Layer {i + 1} of {n}: {l.name}
                </p>
                <h2 className="td-title">{l.step.title}</h2>
                <p className="td-text">{l.step.text}</p>
                <ul className="td-facts">
                  {l.step.facts.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="td-item" data-active={phase.key === "outro"}>
              <p className="td-big">{data.outro}</p>
              {outroAction}
            </div>
          </div>
        </div>

        <nav className="td-dots" aria-label={`${label} layers`}>
          {layers.map((l, i) => (
            <button key={l.name} type="button" data-active={phase.i === i} aria-label={`Go to layer ${i + 1}: ${l.name}`} onClick={() => jump(i)}>
              <span>{l.name}</span>
            </button>
          ))}
        </nav>
        <div className="td-bar" aria-hidden="true">
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
  );
}

export { T };
