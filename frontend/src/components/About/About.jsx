import { ABOUT, SITE, SKILLS } from "../../data/content";
import photo from "../../assets/me.webp";
import "./About.css";

export default function About() {
  return (
    <section className="section about" id="about" aria-labelledby="about-title">
      <div className="wrap">
        <div className="about-top">
          <img className="about-photo" src={photo} alt="My logo: a serpent inside a circuit-board pyramid" width="560" height="456" loading="lazy" />
          <div className="about-text">
            <h2 id="about-title">About me</h2>
            <p className="about-lead">{ABOUT.lead}</p>
            {ABOUT.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p className="about-degree">{SITE.degree}</p>
          </div>
        </div>

        <dl className="about-habits">
          {ABOUT.habits.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>

        <div className="about-skills">
          <h3>Skills, and where I used each</h3>
          <div className="skills-grid">
            {SKILLS.map((g) => (
              <section key={g.group} aria-label={g.group}>
                <h4>{g.group}</h4>
                <dl>
                  {g.items.map(([name, where]) => (
                    <div key={name}>
                      <dt>{name}</dt>
                      <dd>{where}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
