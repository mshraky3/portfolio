import { useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import "./hq-pages.css";

const HQ_PAGES = [
  { to: "/hq/route", label: "Buraydah visit run", short: "🗺️ Route" },
  { to: "/hq/companies", label: "Tech companies", short: "Companies" },
  { to: "/hq/targets", label: "Ranked targets", short: "Targets" },
  { to: "/hq/shortlist", label: "50 km shortlist", short: "50 km" },
  { to: "/hq/it-jobs", label: "Employers hiring IT", short: "IT jobs" },
];

/**
 * Shell for the private research pages at /hq/*.
 *
 * The Job-Hunt HQ tracker at /hq keeps its own layout and passphrase gate —
 * it is deliberately not nested here, since .hq-page sets page-wide typography
 * and colours that would override Tracker.css.
 *
 * Each of these pages carried `<meta name="robots" content="noindex">` as a
 * standalone file; that tag is reapplied for the subtree and removed on exit so
 * the public portfolio stays indexable.
 */
export default function HqLayout() {
  const { pathname } = useLocation();

  // index.html ships `robots: index, follow` for the public portfolio. Override
  // that tag in place rather than appending a second, conflicting one, and put
  // the original value back when leaving the /hq subtree.
  useEffect(() => {
    const existing = document.querySelector('meta[name="robots"]');
    const meta = existing || document.createElement("meta");
    const previous = existing ? existing.content : null;
    if (!existing) {
      meta.name = "robots";
      document.head.appendChild(meta);
    }
    meta.content = "noindex, nofollow";
    return () => {
      if (previous === null) meta.remove();
      else meta.content = previous;
    };
  }, []);

  // index.html carries the portfolio's title; give each research page its own
  // and restore the original when leaving the /hq subtree.
  useEffect(() => {
    const previous = document.title;
    const page = HQ_PAGES.find((p) => p.to === pathname);
    document.title = page ? `${page.label} · HQ` : "HQ";
    return () => {
      document.title = previous;
    };
  }, [pathname]);

  return (
    <div className="hq-page">
      <nav className="hq-nav">
        <div className="wrap hq-nav-in">
          <NavLink to="/hq">⌂ Tracker</NavLink>
          {HQ_PAGES.map((p) => (
            <NavLink
              key={p.to}
              to={p.to}
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              {p.short}
            </NavLink>
          ))}
          <NavLink className="home" to="/">
            ← Portfolio
          </NavLink>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}
