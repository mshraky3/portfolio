import { NEUROLINK } from "../../data/content";
import AssemblyStage from "../Assembly/AssemblyStage";
import "./NeuroLink.css";

export default function NeuroLink() {
  return (
    <>
      <AssemblyStage
        id="neurolink"
        data={NEUROLINK}
        layers={NEUROLINK.layers}
        label="NeuroLink, built part by part"
        intro={
          <>
            <p className="nl-tag">{NEUROLINK.name}</p>
            <h2 className="nl-headline">{NEUROLINK.headline}</h2>
            <p className="nl-intro">{NEUROLINK.intro}</p>
            <p className="nl-context">{NEUROLINK.context}</p>
            <p className="nl-cue">{NEUROLINK.scrollCue}</p>
          </>
        }
        outroAction={
          <a className="btn btn-primary" href="#contact">
            Ask for a live demo
          </a>
        }
      />
      <div className="nl-after">
        <div className="wrap">
          <dl className="nl-facts">
            {NEUROLINK.facts.map((f) => (
              <div key={f.label}>
                <dt>{f.value}</dt>
                <dd>{f.label}</dd>
              </div>
            ))}
          </dl>
          <p className="nl-note">{NEUROLINK.context} The repository is private; I run it live in an interview or a call.</p>
        </div>
      </div>
    </>
  );
}
