import { SITE } from "../../data/content";
import { API_URL, track } from "../../utils/api";
import Form from "./Form";
import "./Contact.css";

const RESUME = "/Mahmoud_Ahmed%20El-Sharaky_Resume.pdf";

// Tells the backend someone opened the CV. Never blocks the download.
function pingResume() {
  track("cv", "contact");
  fetch(`${API_URL}/resume-downloaded`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ timestamp: new Date().toISOString() }),
    keepalive: true,
  }).catch(() => {});
}

const Icon = {
  whatsapp: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 8.5c.3-.6.8-.6 1.1 0l.6 1.4c.1.3 0 .6-.2.8l-.5.5c.5 1.1 1.4 2 2.5 2.6l.5-.5c.2-.2.6-.3.8-.2l1.4.6c.6.3.6.8 0 1.2-.7.6-1.6.8-2.5.4A8 8 0 0 1 8.6 11c-.4-.9-.2-1.8.4-2.5Z" fill="currentColor" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="m4 7 8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 10.5V17M8 7.5v.01M11.5 17v-6.5M11.5 13c0-1.8 1.1-2.6 2.3-2.6 1.3 0 2.2.8 2.2 2.7V17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 19c-4 1.3-4-2-6-2.5m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

const WAYS = [
  { key: "whatsapp", label: "WhatsApp", sub: SITE.phone, href: SITE.whatsapp, primary: true },
  { key: "mail", label: "Email", sub: SITE.email, href: `mailto:${SITE.email}` },
  { key: "linkedin", label: "LinkedIn", sub: "mahmoud-alshraky", href: SITE.linkedin },
  { key: "github", label: "GitHub", sub: "mshraky3", href: SITE.github },
];

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
          <p>Hiring, or have a project? Pick whatever is quickest. I usually reply the same day.</p>

          <ul className="ways">
            {WAYS.map((w) => (
              <li key={w.key}>
                <a
                  className="way"
                  data-primary={w.primary || undefined}
                  href={w.href}
                  target={w.key === "mail" ? undefined : "_blank"}
                  rel="noreferrer"
                  onClick={() => track("contact", w.key)}
                >
                  <span className="way-icon">{Icon[w.key]}</span>
                  <span className="way-text">
                    <strong>{w.label}</strong>
                    <span>{w.sub}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <p className="contact-meta">
            {SITE.city} ·{" "}
            <a href={RESUME} download="Mahmoud_Alshraky_Resume.pdf" onClick={pingResume}>
              Download my CV (PDF)
            </a>
          </p>
        </div>

        <Form />
      </div>
    </section>
  );
}
