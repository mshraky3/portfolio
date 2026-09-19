import { SITE } from "../../data/content";
import Form from "./Form";
import "./Contact.css";

const API_URL = "https://portfolio-api-rose.vercel.app";
const RESUME = "/Mahmoud_Ahmed%20El-Sharaky_Resume.pdf";

// Tells the backend someone opened the CV. Never blocks the download.
function pingResume() {
  fetch(`${API_URL}/resume-downloaded`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ timestamp: new Date().toISOString() }),
    keepalive: true,
  }).catch(() => {});
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        © {new Date().getFullYear()} {SITE.name}
      </div>
    </footer>
  );
}

export default function Contact() {
  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="wrap contact-grid">
        <div className="contact-info">
          <h2 id="contact-title">Let's talk</h2>
          <p>I am looking for a software engineer role and I take freelance projects. I usually reply the same day.</p>

          <dl className="contact-list">
            <div>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </dd>
            </div>
            <div>
              <dt>Phone and WhatsApp</dt>
              <dd>
                <a href={SITE.whatsapp} target="_blank" rel="noreferrer">
                  {SITE.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt>GitHub</dt>
              <dd>
                <a href={SITE.github} target="_blank" rel="noreferrer">
                  github.com/mshraky3
                </a>
              </dd>
            </div>
            <div>
              <dt>LinkedIn</dt>
              <dd>
                <a href={SITE.linkedin} target="_blank" rel="noreferrer">
                  linkedin.com/in/mahmoud-alshraky
                </a>
              </dd>
            </div>
            <div>
              <dt>Based in</dt>
              <dd>{SITE.city}</dd>
            </div>
          </dl>

          <a className="btn" href={RESUME} download="Mahmoud_Alshraky_Resume.pdf" onClick={pingResume}>
            Download CV (PDF)
          </a>
        </div>

        <Form />
      </div>
    </section>
  );
}
