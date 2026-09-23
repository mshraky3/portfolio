import { HERO, SITE } from "../../data/content";
import AssemblyStage from "../Assembly/AssemblyStage";
import { track } from "../../utils/api";
import "./Hero.css";

const RESUME = "/Mahmoud_Ahmed%20El-Sharaky_Resume.pdf";

export default function Hero() {
  return (
    <AssemblyStage
      id="top"
      data={HERO}
      layers={HERO.layers}
      label="How I build a system, part by part"
      tech={false}
      intro={
        <>
          <p className="hero-status">
            <span className="hero-dot" aria-hidden="true" />
            {HERO.eyebrow}
          </p>
          <h1 className="hero-name">{SITE.name}</h1>
          <p className="hero-line">{HERO.headline}</p>
          <p className="hero-meta">
            {SITE.city}. {SITE.degree}.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#work">
              See the systems
            </a>
            <a className="btn" href={RESUME} download="Mahmoud_Alshraky_Resume.pdf" onClick={() => track("cv", "hero")}>
              Download CV
            </a>
          </div>
          <p className="hero-cue">{HERO.scrollCue}</p>
        </>
      }
      outroAction={
        <a className="btn btn-primary" href="#work">
          See the systems
        </a>
      }
    />
  );
}
