import { NEUROLINK } from "../../data/content";
import TeardownStage from "../Teardown/TeardownStage";
import "./NeuroLink.css";

// Plate 0 gets a 21-landmark hand, plate 1 a head-pose rig. Both live in the lazy
// 3D chunk; they are named here so this file never imports three.js.
const EXTRAS = { 0: "hand", 1: "head" };

export default function NeuroLink() {
  return (
    <>
      <TeardownStage
        id="neurolink"
        data={NEUROLINK}
        layers={NEUROLINK.layers}
        label="NeuroLink, one frame through five stages"
        extras={EXTRAS}
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
      <div className="nl-after on-dark">
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
