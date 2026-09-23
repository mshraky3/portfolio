import { EXPERIENCE } from "../../data/content";
import "./Experience.css";

export default function Experience() {
  return (
    <section className="section experience" id="experience" aria-labelledby="exp-title">
      <div className="wrap">
        <div className="section-head">
          <h2 id="exp-title">Experience</h2>
          <p>Two ongoing roles and two freelance sites.</p>
        </div>

        <ol className="exp-list">
          {EXPERIENCE.map((job) => (
            <li key={job.id} className="exp-item">
              <div className="exp-when">{job.dates}</div>
              <div className="exp-what">
                <h3>{job.role}</h3>
                <p className="exp-org">
                  {job.org}
                  {job.note && <span>. {job.note}</span>}
                </p>
                <ul>
                  {job.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
