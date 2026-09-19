import { useEffect, useState } from "react";
import { SITE } from "../../data/content";
import "./Nav.css";

const LINKS = [
  ["#work", "Systems"],
  ["#neurolink", "NeuroLink"],
  ["#experience", "Experience"],
  ["#about", "About"],
  ["#contact", "Contact"],
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
      <div className="wrap nav-row">
        <a className="nav-brand" href="#top" aria-label={`${SITE.name}, back to top`}>
          <img src="/logo.png" alt="" width="32" height="32" />
          <span>{SITE.name}</span>
        </a>

        <nav className="nav-links" aria-label="Sections" data-open={open}>
          {LINKS.map(([href, label]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
        </nav>

        <a className="btn btn-primary nav-cta" href={`mailto:${SITE.email}`}>
          Email me
        </a>

        <button
          type="button"
          className="nav-menu"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
