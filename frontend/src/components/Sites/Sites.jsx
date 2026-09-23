import { PROJECTS, SITES } from "../../data/content";
import { IMAGES } from "../../data/images";
import AssemblyStage from "../Assembly/AssemblyStage";
import TechDetails from "../Assembly/TechDetails";
import "../Systems/Systems.css";
import "./Sites.css";

const CARDS = PROJECTS.filter((p) => p.group === "sites");

// A screenshot on a small stack of panels, a nod to the trays above.
function Shot({ image, title }) {
  return (
    <div className="shot">
      <span className="shot-back shot-back-2" aria-hidden="true" />
      <span className="shot-back shot-back-1" aria-hidden="true" />
      <img src={IMAGES[image]} alt={`Screenshot of the ${title} website`} loading="lazy" width="1280" height="800" />
    </div>
  );
}

function Card({ project: p }) {
  const host = p.href.replace(/^https?:\/\/(www\.)?/, "");
  return (
    <article className="site-card" aria-labelledby={`site-${p.id}`}>
      <Shot image={p.image} title={p.title} />
      <div className="site-text">
        <p className="eyebrow">
          {p.meta.role}, {p.meta.period}
        </p>
        <h3 id={`site-${p.id}`}>{p.title}</h3>
        <p className="site-summary">{p.summary}</p>
        <ul className="chips" aria-label="Technologies">
          {p.stack.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <a className="btn btn-primary ch-link" href={p.href} target="_blank" rel="noopener noreferrer">
          Visit <span className="mono">{host}</span>
        </a>
        <TechDetails layers={p.layers} />
      </div>
    </article>
  );
}

export default function Sites() {
  return (
    <>
      <AssemblyStage
        id="sites"
        data={SITES}
        layers={SITES.layers}
        size="compact"
        turn={-0.15}
        rig="gallery"
        tech={false}
        badge="Client work"
        label="Client sites, part by part"
        intro={
          <>
            <h2 className="ch-title">{SITES.title}</h2>
            <p className="ch-sub">{SITES.lead}</p>
            <p className="ch-cue">Scroll for a quick look at each.</p>
          </>
        }
        outroAction={
          <a className="btn btn-primary" href="#site-cards">
            See both sites
          </a>
        }
      />
      <section className="site-cards" id="site-cards" aria-label="Client sites">
        <div className="wrap site-grid">
          {CARDS.map((p) => (
            <Card key={p.id} project={p} />
          ))}
        </div>
      </section>
    </>
  );
}
