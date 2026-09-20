// The engineering detail behind a system, kept out of the visual story and
// folded away by default: the routes, tables, files and tests it is made of.
export default function TechDetails({ layers }) {
  const rows = layers.filter((l) => l.rows && l.rows.length);
  if (!rows.length) return null;
  return (
    <details className="tech">
      <summary>
        <span>Technical details</span>
        <span className="tech-hint">The routes, tables and files behind each part</span>
      </summary>
      <div className="tech-grid">
        {rows.map((l) => (
          <section key={l.name} className="tech-part">
            <h3>{l.name}</h3>
            {l.note ? <p className="tech-note">{l.note}</p> : null}
            <ul>
              {l.rows.map(([tag, text]) => (
                <li key={`${tag}-${text}`}>
                  <span className="tech-tag">{tag}</span>
                  <span className="tech-text mono">{text}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </details>
  );
}
