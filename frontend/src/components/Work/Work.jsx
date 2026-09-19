import { HERO, PROJECTS } from "../../data/content";
import LayerInspector from "../Teardown/LayerInspector";
import "./Work.css";

function Sheet({ project }) {
  const layers = project.layers || HERO.layers;
  const host = project.href ? project.href.replace(/^https?:\/\/(www\.)?/, "") : "";

  return (
    <article className="sheet" aria-labelledby={`sheet-${project.id}`}>
      <header className="sheet-head">
        <h3 id={`sheet-${project.id}`}>{project.title}</h3>
        <span className="sheet-sub">{project.subtitle}</span>
      </header>

      <div className="sheet-body">
        <div className="sheet-text">
          <p className="sheet-summary">{project.summary}</p>
          <ul className="sheet-facts">
            {project.facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <ul className="sheet-stack" aria-label="Technologies">
            {project.stack.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          {project.href ? (
            <a className="btn sheet-link" href={project.href} target="_blank" rel="noopener noreferrer">
              Visit <span className="mono">{host}</span>
            </a>
          ) : (
            <p className="sheet-private">{project.private}</p>
          )}
        </div>
        <LayerInspector layers={layers} label={project.id} />
      </div>

      <dl className="sheet-block">
        <div>
          <dt>Role</dt>
          <dd>{project.meta.role}</dd>
        </div>
        <div>
          <dt>Period</dt>
          <dd>{project.meta.period}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{project.meta.status}</dd>
        </div>
      </dl>
    </article>
  );
}

export default function Work({ id, group, title, lead }) {
  const items = PROJECTS.filter((p) => p.group === group);
  return (
    <section className="section work" id={id} aria-labelledby={`${id}-title`}>
      <div className="wrap">
        <div className="section-head">
          <h2 id={`${id}-title`}>{title}</h2>
          <p>{lead}</p>
        </div>
        <div className="work-list">
          {items.map((p) => (
            <Sheet key={p.id} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
