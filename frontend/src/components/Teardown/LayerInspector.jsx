import { useState } from "react";
import { IMAGES } from "../../data/images";
import "./LayerInspector.css";

// Compact exploded view for project sheets: a CSS-3D stack of the layers beside
// an inspector that shows the real content of whichever layer is selected.
export default function LayerInspector({ layers, label }) {
  const [active, setActive] = useState(0);
  const layer = layers[active];
  const n = layers.length;

  return (
    <div className="li" aria-label={label}>
      <div className="li-stage">
        <ol className="li-stack">
          {layers.map((l, i) => (
            <li key={l.name} className="li-plate" data-active={i === active} style={{ "--i": n - 1 - i }}>
              <button type="button" tabIndex={-1} aria-hidden="true" onClick={() => setActive(i)}>
                <span className="li-num">{i + 1}</span>
                {l.kind === "image" ? <img src={IMAGES[l.image]} alt="" /> : <span className="li-lines" />}
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="li-panel">
        <div className="li-tabs" role="tablist" aria-label="Layers">
          {layers.map((l, i) => (
            <button
              key={l.name}
              id={`li-tab-${label}-${i}`}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-controls={`li-body-${label}`}
              onClick={() => setActive(i)}
            >
              <span className="li-tabnum">{i + 1}</span>
              {l.name}
            </button>
          ))}
        </div>

        <div className="li-body" id={`li-body-${label}`} role="tabpanel" aria-labelledby={`li-tab-${label}-${active}`}>
          <h4>{layer.name}</h4>
          <p className="li-role">{layer.role}</p>
          {layer.kind === "image" ? (
            <img className="li-shot" src={IMAGES[layer.image]} alt={`Screenshot: ${layer.note}`} width="1200" height="680" loading="lazy" />
          ) : (
            <ul className="li-rows">
              {layer.rows.map(([tag, text]) => (
                <li key={`${tag}${text}`}>
                  <span className="li-chip">{tag}</span>
                  <span className="li-text">{text}</span>
                </li>
              ))}
            </ul>
          )}
          {layer.note && <p className="li-note">{layer.note}</p>}
        </div>
      </div>
    </div>
  );
}
