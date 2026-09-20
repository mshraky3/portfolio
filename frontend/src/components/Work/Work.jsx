import { HERO, PROJECTS } from "../../data/content";
import { IMAGES } from "../../data/images";
import TechDetails from "../Assembly/TechDetails";
import Diagram from "./Diagrams";
import "./Work.css";

// Screens sit on a small stack of panels, a nod to the exploded view above.
function Shot({ image, title }) {
  return (
    <div className="shot" aria-hidden={false}>
      <span className="shot-back shot-back-2" aria-hidden="true" />
      <span className="shot-back shot-back-1" aria-hidden="true" />
      <img src={IMAGES[image]} alt={`Screenshot of ${title}`} loading="lazy" width="1280" height="800" />
    </div>
  );
}

function Sheet({ project }) {
  const layers = project.layers || HERO.layers;
  const host = project.href ? project.href.replace(/^https?:\/\/(www\.)?/, "") : "";

  return (
    <article className="sheet" aria-labelledby={`sheet-${project.id}`}>
      <div className="sheet-media">
        {project.image ? <Shot image={project.image} title={project.title} /> : <Diagram kind={project.diagram} />}
      </div>

      <div className="sheet-text">
        <p className="eyebrow">{project.meta.status}</p>
        <h3 id={`sheet-${project.id}`}>{project.title}</h3>
        <p className="sheet-sub">{project.subtitle}</p>
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
        <dl className="sheet-block">
          <div>
            <dt>Role</dt>
            <dd>{project.meta.role}</dd>
          </div>
          <div>
            <dt>Period</dt>
            <dd>{project.meta.period}</dd>
          </div>
        </dl>
        {project.href ? (
          <a className="btn btn-primary sheet-link" href={project.href} target="_blank" rel="noopener noreferrer">
            Visit <span className="mono">{host}</span>
          </a>
        ) : (
          <p className="sheet-private">{project.private}</p>
        )}
      </div>

      <div className="sheet-tech">
        <TechDetails layers={layers} />
      </div>
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
