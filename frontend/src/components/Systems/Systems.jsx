import { PROJECTS } from "../../data/content";
import AssemblyStage from "../Assembly/AssemblyStage";
import TechDetails from "../Assembly/TechDetails";
import "./Systems.css";

const SYSTEMS = PROJECTS.filter((p) => p.group === "prod");
const pad = (k) => String(k).padStart(2, "0");
const hostOf = (href) => href.replace(/^https?:\/\/(www\.)?/, "");

// What a system is made of, under its scroll story: facts, stack, role, link and
// the folded technical details.
function Strip({ project: p }) {
  return (
    <div className="ch-strip">
      <div className="wrap ch-strip-in">
        <div className="ch-strip-main">
          <p className="ch-strip-summary">{p.summary}</p>
          {p.stats ? (
            <dl className="ch-stats">
              {p.stats.map((f) => (
                <div key={f.label}>
                  <dt>{f.value}</dt>
                  <dd>{f.label}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          <ul className="ch-facts">
            {p.facts.slice(0, 2).map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
        <div className="ch-strip-side">
          <dl className="ch-meta">
            <div>
              <dt>Role</dt>
              <dd>{p.meta.role}</dd>
            </div>
            <div>
              <dt>Period</dt>
              <dd>{p.meta.period}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{p.meta.status}</dd>
            </div>
          </dl>
          <ul className="chips" aria-label="Technologies">
            {p.stack.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          {p.href ? (
            <a className="btn btn-primary ch-link" href={p.href} target="_blank" rel="noopener noreferrer">
              Visit <span className="mono">{hostOf(p.href)}</span>
            </a>
          ) : (
            <p className="ch-private">{p.private}</p>
          )}
        </div>
        <div className="ch-strip-tech">
          <TechDetails layers={[...(p.extraTech || []), ...p.layers]} />
        </div>
      </div>
    </div>
  );
}

function Chapter({ project: p, index }) {
  return (
    <>
      <AssemblyStage
        id={`sys-${p.id}`}
        data={p}
        layers={p.layers}
        size="chapter"
        turn={p.turn}
        rig={p.rig}
        tech={false}
        badge={`System ${pad(index + 1)} of ${pad(SYSTEMS.length)}`}
        label={`${p.title}, built part by part`}
        intro={
          <>
            <h2 className="ch-title">{p.title}</h2>
            <p className="ch-sub">{p.subtitle}</p>
            <p className="ch-summary">{p.summary}</p>
            {p.note ? <p className="ch-note">{p.note}</p> : null}
            <p className="ch-cue">{p.cue}</p>
          </>
        }
        outroAction={
          p.href ? (
            <a className="btn btn-primary" href={p.href} target="_blank" rel="noopener noreferrer">
              Visit <span className="mono">{hostOf(p.href)}</span>
            </a>
          ) : (
            <a className="btn" href="#contact">
              Ask for a walkthrough
            </a>
          )
        }
      />
      <Strip project={p} />
    </>
  );
}

export default function Systems() {
  return (
    <>
      <section className="section systems" id="work" aria-labelledby="work-title">
        <div className="wrap">
          <div className="section-head">
            <h2 id="work-title">Systems in production</h2>
            <p>
              Four systems, each shown its own way. The engineering is folded under each one.
            </p>
          </div>
          <ol className="sys-index">
            {SYSTEMS.map((p, i) => (
              <li key={p.id}>
                <a href={`#sys-${p.id}`}>
                  <span className="sys-num">{pad(i + 1)}</span>
                  <span className="sys-name">{p.title}</span>
                  <span className="sys-sub">{p.subtitle}</span>
                  <span className="sys-parts">{p.layers.map((l) => l.name).join(" · ")}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>
      {SYSTEMS.map((p, i) => (
        <Chapter key={p.id} project={p} index={i} />
      ))}
    </>
  );
}
