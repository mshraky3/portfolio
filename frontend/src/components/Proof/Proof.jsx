import { HEADLINE_METRICS, METRICS_AS_OF, SCALE_FACTS } from "../../data/content";
import "./Proof.css";

export default function Proof() {
  return (
    <section className="section proof" id="proof" aria-labelledby="proof-title">
      <div className="wrap">
        <div className="section-head">
          <h2 id="proof-title">Numbers from systems that are running</h2>
          <p>Read from Google Search Console and Vercel on {METRICS_AS_OF}.</p>
        </div>

        <ul className="proof-headline">
          {HEADLINE_METRICS.map((m) => (
            <li key={m.label}>
              <span className="proof-value">{m.value}</span>
              <span className="proof-label">{m.label}</span>
              <span className="proof-source">
                <span className="mono">{m.source.site}</span> · {m.source.by} · {m.source.when}
              </span>
            </li>
          ))}
        </ul>

        <dl className="proof-scale">
          {SCALE_FACTS.map((f) => (
            <div key={f.label} title={`Source: ${f.evidence}`}>
              <dt>{f.value}</dt>
              <dd>{f.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
