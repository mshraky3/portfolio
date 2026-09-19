import { HEADLINE_METRICS, METRICS_AS_OF, SCALE_FACTS, TRAFFIC_ROWS } from "../../data/content";
import "./Proof.css";

export default function Proof() {
  return (
    <section className="section proof" id="proof" aria-labelledby="proof-title">
      <div className="wrap">
        <div className="section-head">
          <h2 id="proof-title">Numbers from systems that are running</h2>
          <p>
            Every figure was read from a Google or Vercel dashboard on {METRICS_AS_OF}, and the source is under it. Where a site has no
            analytics yet, the table says so instead of guessing.
          </p>
        </div>

        <ul className="proof-headline">
          {HEADLINE_METRICS.map((m) => (
            <li key={m.label}>
              <span className="proof-value">{m.value}</span>
              <span className="proof-label">{m.label}</span>
              <span className="proof-detail">{m.detail}</span>
              <span className="proof-source">
                {m.source.by}, <span className="mono">{m.source.site}</span>, {m.source.when}
              </span>
            </li>
          ))}
        </ul>

        <div className="proof-table-wrap">
          <table className="proof-table">
            <caption>Visits and search visibility by site</caption>
            <thead>
              <tr>
                <th scope="col">Site</th>
                <th scope="col">Visitors</th>
                <th scope="col">Google search</th>
                <th scope="col">Source</th>
              </tr>
            </thead>
            <tbody>
              {TRAFFIC_ROWS.map((r) => (
                <tr key={r.site}>
                  <th scope="row">
                    <span className="mono">{r.site}</span>
                    <span>{r.what}</span>
                  </th>
                  <td data-label="Visitors">{r.visitors}</td>
                  <td data-label="Google search">{r.search}</td>
                  <td data-label="Source" className="proof-note">
                    {r.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <dl className="proof-scale">
          {SCALE_FACTS.map((f) => (
            <div key={f.label}>
              <dt>{f.value}</dt>
              <dd>
                {f.label}
                <span>{f.evidence}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
