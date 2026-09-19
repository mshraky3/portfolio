import { useEffect, useRef } from "react";
import { phaseAt } from "./timeline";

// Scroll progress of a tall section, 0 when its top meets the viewport and 1
// when its bottom does. Writes a ref (read every frame by the 3D scene) and
// reports the caption phase to React only when it changes.
export function useScrollProgress(sectionRef, n, onPhase) {
  const progress = useRef(0);
  const last = useRef("");

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = sectionRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
      progress.current = p;
      el.style.setProperty("--p", p.toFixed(4));
      const phase = phaseAt(p, n);
      if (phase.key !== last.current) {
        last.current = phase.key;
        onPhase(phase);
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [sectionRef, n, onPhase]);

  return progress;
}
