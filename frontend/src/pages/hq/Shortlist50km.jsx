import { useMemo, useState } from "react";
import { EMPLOYERS, FIT_LABEL, RINGS, SECTOR_LABEL, ringOf } from "./data/shortlist50km";
import { copyText, useMarks } from "./useMarks";

const STORAGE_KEY = "qassim50_v1";
const SECTORS = ["all", "software", "edu", "health", "industry"];

function EmployerCard({ employer, mark, onToggle }) {
  const state = mark || "";
  const [fitClass, fitLabel] = FIT_LABEL[employer.fit] || FIT_LABEL.good;
  return (
    <article className="card" data-state={state}>
      <div className="top">
        <div className="name">
          <h3>{employer.n}</h3>
          <span className="arname ar" dir="rtl">
            {employer.ar}
          </span>
          <div className="where">{employer.city}</div>
        </div>
        <div className="tags">
          {employer.isNew ? <span className="tag new">NEW</span> : null}
          <span className="tag km">{employer.km} km</span>
          <span className="tag est">{employer.gps ? "GPS" : "est"}</span>
          <span className="tag">{SECTOR_LABEL[employer.sec]}</span>
          <span className={`tag ${fitClass}`}>{fitLabel}</span>
        </div>
      </div>

      <dl className="cardbody">
        <div className="row">
          <dt>What</dt>
          <dd>{employer.what}</dd>
        </div>
        <div className="row">
          <dt>Role</dt>
          <dd>
            <b>{employer.role}</b>
          </dd>
        </div>
        <div className="row">
          <dt>How</dt>
          <dd>{employer.how}</dd>
        </div>
        <div className="row">
          <dt>Angle</dt>
          <dd>{employer.why}</dd>
        </div>
        {employer.links?.length ? (
          <div className="row">
            <dt>Links</dt>
            <dd>
              <div className="links">
                {employer.links.map(([text, url]) => (
                  <a key={url} href={url} target="_blank" rel="noopener noreferrer">
                    {text}
                  </a>
                ))}
              </div>
            </dd>
          </div>
        ) : null}
      </dl>

      <div className="acts">
        <button
          type="button"
          className="btn t"
          aria-pressed={state === "target"}
          onClick={() => onToggle(employer.id, "target")}
        >
          ✓ Target
        </button>
        <button
          type="button"
          className="btn s"
          aria-pressed={state === "skip"}
          onClick={() => onToggle(employer.id, "skip")}
        >
          ✗ Skip
        </button>
        <span className="cv">
          CV: <b>{employer.cv}</b>
        </span>
      </div>
    </article>
  );
}

export default function Shortlist50km() {
  const { marks, toggle, reset } = useMarks(STORAGE_KEY);
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("all");
  const [undecidedOnly, setUndecidedOnly] = useState(false);
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState(null);

  const rings = useMemo(() => {
    const q = query.trim().toLowerCase();
    const shown = EMPLOYERS.filter((e) => {
      if (sector !== "all" && e.sec !== sector) return false;
      if (undecidedOnly && marks[e.id]) return false;
      if (q) {
        const hay = `${e.n} ${e.ar} ${e.city} ${SECTOR_LABEL[e.sec]} ${e.what} ${e.role}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    return RINGS.map((ring) => ({
      ring,
      items: shown.filter((e) => ringOf(e.km) === ring.key).sort((a, b) => a.km - b.km),
    })).filter((g) => g.items.length);
  }, [query, sector, undecidedOnly, marks]);

  const targetCount = EMPLOYERS.filter((e) => marks[e.id] === "target").length;
  const skipCount = EMPLOYERS.filter((e) => marks[e.id] === "skip").length;

  function showAll() {
    setQuery("");
    setSector("all");
    setUndecidedOnly(false);
  }

  function resetMarks() {
    if (window.confirm("Clear every Target/Skip mark?")) {
      reset();
      setStatus(null);
    }
  }

  async function copySelection() {
    const pick = (kind) =>
      EMPLOYERS.filter((e) => marks[e.id] === kind)
        .sort((a, b) => a.km - b.km)
        .map(
          (e) =>
            `- ${e.n} (${e.ar}) — ${e.km} km — ${SECTOR_LABEL[e.sec].replace(/^\S+\s/, "")} — CV: ${e.cv}`
        );
    const targets = pick("target");
    const skips = pick("skip");
    const undecided = EMPLOYERS.filter((e) => !marks[e.id]).map((e) => `- ${e.n}`);
    const text = [
      `QASSIM 50 km — MY SELECTION (${new Date().toISOString().slice(0, 10)})`,
      "",
      `## TARGET — write a CV for these (${targets.length})`,
      targets.length ? targets.join("\n") : "(none marked)",
      "",
      `## SKIP (${skips.length})`,
      skips.length ? skips.join("\n") : "(none marked)",
      "",
      `## UNDECIDED (${undecided.length})`,
      undecided.length ? undecided.join("\n") : "(none)",
    ].join("\n");

    setOutput(text);
    setStatus((await copyText(text)) ? "copied" : "manual");
  }

  return (
    <>
      <header>
        <div className="wrap">
          <h1>
            Employers within <span>50 km</span> of Al-Bukayriyah
          </h1>
          <p className="sub">
            Every employer a non-Saudi can realistically work at, inside a 50 km straight-line radius of your pin.
            Government bodies, Ministry-of-Health hospitals and military entities are stripped out — they&rsquo;re listed
            at the bottom with the reason, so you can see what was removed rather than wonder. Mark each one{" "}
            <b>Target</b> or <b>Skip</b>, then hit <b>Copy selection</b> and paste it back to me — I&rsquo;ll write a CV
            per target.
          </p>
          <div className="pin">
            📍 <b>Al-Bukayriyah · البكيرية</b> — 26°07&apos;55.6&quot;N 43°38&apos;37.7&quot;E
            <span style={{ opacity: 0.6 }}>·</span> distances are straight-line, not driving
          </div>
        </div>
      </header>

      <div className="bar">
        <div className="wrap bar-in">
          <input
            type="search"
            placeholder="Search name, city, sector…"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {SECTORS.map((s) => (
            <button
              key={s}
              type="button"
              className="chip"
              aria-pressed={sector === s}
              onClick={() => setSector(s)}
            >
              {s === "all" ? "All" : SECTOR_LABEL[s]}
            </button>
          ))}
          <button
            type="button"
            className="chip"
            aria-pressed={undecidedOnly}
            onClick={() => setUndecidedOnly((v) => !v)}
          >
            Undecided only
          </button>
          <div className="counts">
            <span className="ct">
              Target <b>{targetCount}</b>
            </span>
            <span className="cs">
              Skip <b>{skipCount}</b>
            </span>
            <span className="cu">
              Left <b>{EMPLOYERS.length - targetCount - skipCount}</b>
            </span>
          </div>
        </div>
      </div>

      <main className="wrap">
        {rings.length === 0 ? (
          <div className="empty">Nothing matches that filter.</div>
        ) : (
          rings.map(({ ring, items }) => (
            <section className="ring" key={ring.key}>
              <div className="ring-h">
                <h2>{ring.label}</h2>
                <span className="n">{items.length}</span>
                <span className="ring-note">{ring.note}</span>
              </div>
              <div className="grid">
                {items.map((e) => (
                  <EmployerCard key={e.id} employer={e} mark={marks[e.id]} onToggle={toggle} />
                ))}
              </div>
            </section>
          ))
        )}
      </main>

      <div className="wrap">
        <details>
          <summary>❌ Removed on purpose — and why (15)</summary>
          <div className="inner">
            <p>You said to drop anything a non-Saudi can&rsquo;t work at. These were in the 50 km radius and were cut:</p>
            <ul>
              <li>
                <b>Al-Bukayriyah General Hospital</b> · <b>Riyadh Al-Khabra General Hospital</b> ·{" "}
                <b>Qassim Health Cluster</b> — Ministry of Health. Permanent posts are Saudi-national only.{" "}
                <em>
                  The useful move instead: ask their IT office which company maintains their systems, then apply to that
                  vendor.
                </em>
              </li>
              <li>
                <b>Qassim Military Hospital</b> — Ministry of Defense; nationality + security clearance.
              </li>
              <li>
                <b>Al-Bukayriyah Municipality</b> · <b>Amanat Al-Qassim</b> — government employment. Same trick applies:
                their software is built by contractors you <em>can</em> work for, and the winners are public on{" "}
                <a href="https://tenders.etimad.sa/" target="_blank" rel="noopener noreferrer">
                  Etimad
                </a>
                .
              </li>
              <li>
                <b>Unaizah Technical College (TVTC)</b> · <b>Saudi Railway Polytechnic</b> — government training
                corporations.
              </li>
              <li>
                <b>KACST Qassim</b> · <b>SAGO (Grains Org.)</b> · <b>Saudi Post</b> — government / state bodies.
              </li>
              <li>
                <b>Saudi Electricity</b> · <b>National Water Company</b> — the nearby offices are customer-service
                counters; all technical hiring is centralised in Riyadh.
              </li>
              <li>
                <b>STC · Mobily · Zain Qassim branches</b> — retail shops. They do hire non-Saudis, but only through the
                national portals for Riyadh roles. Not a local job.
              </li>
              <li>
                <b>Buraydah Women&rsquo;s Industrial City</b> — factories staffed by women.
              </li>
            </ul>
            <p>
              <b>Kept despite being public:</b> Qassim University — not as a normal job. You&rsquo;re enrolled there, and
              paid work on funded research projects goes through your professors, not through nationality-filtered HR.
              That route is genuinely open to you.
            </p>
            <p>
              <b>Not an employer, but keep it:</b>{" "}
              <a href="https://qcci.org.sa/" target="_blank" rel="noopener noreferrer">
                Qassim Chamber of Commerce
              </a>{" "}
              — its member directory is the most complete list of local companies in existence, and its events put you in
              a room with owners.
            </p>
          </div>
        </details>

        <details>
          <summary>📍 Just outside 50 km — but apply anyway (1)</summary>
          <div className="inner">
            <ul>
              <li>
                <b>Al-Watania Poultry · دواجن الوطنية</b> — the mapped plant sits at <b>~63 km</b> (26.686, 43.769, north
                Buraydah), so it fails your radius on paper. It&rsquo;s still on this page because it&rsquo;s the largest
                employer in the region by a distance: <b>~7,500 staff</b>, the biggest poultry operation in the Middle
                East, HQ in Buraydah, and part of the same Sulaiman Al Rajhi group as the university 9 km from your door.
                Multi-site production, logistics and workforce data — the exact shape of your HR platform. Their offices
                are spread around Buraydah, so a role may well land inside your radius even though the plant
                doesn&rsquo;t.
                <div className="links" style={{ marginTop: 8 }}>
                  <a href="https://careers.al-watania.com/en/main/index" target="_blank" rel="noopener noreferrer">
                    Careers portal
                  </a>
                  <a href="https://alwatania.sa/en/jobs/" target="_blank" rel="noopener noreferrer">
                    Jobs page
                  </a>
                  <a href="https://www.linkedin.com/company/al-watania-poultry" target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </details>

        <details>
          <summary>⚠️ How accurate is this list?</summary>
          <div className="inner">
            <ul>
              <li>
                <b>Distances marked &ldquo;GPS&rdquo;</b> come from real OpenStreetMap / Nominatim coordinates for that
                exact site — trust them to ~100 m.
              </li>
              <li>
                <b>Distances marked &ldquo;est&rdquo;</b> are city-centre estimates. Buraydah centre is 39.5 km from you
                and the city is ~15 km across, so a Buraydah address is anywhere from <b>36 to 48 km</b>. Check the
                address before you drive.
              </li>
              <li>
                Google Maps can&rsquo;t be scraped from my sandbox (it returns a sign-in-gated view), so this was built
                from OpenStreetMap, Nominatim, Arabic Wikipedia&rsquo;s &ldquo;companies headquartered in Qassim&rdquo;
                category, MODON, and each company&rsquo;s own site.
              </li>
              <li>
                Company details change. <b>Re-check before applying</b> — especially the small software houses, which
                appear and vanish.
              </li>
              <li>
                Two things to verify yourself: whether <b>Buraydah Private Colleges</b> still exists separately (Qassim
                Private Colleges became Mustaqbal University in 2019), and the street address of <b>Radic IT</b>, which
                publishes no physical address.
              </li>
            </ul>
          </div>
        </details>
      </div>

      <div className="dock">
        <div className="wrap dock-in">
          <span className="msg">
            {status === "copied" ? (
              <>
                <b>Copied.</b> Paste it into the chat and I&rsquo;ll write the CVs.
              </>
            ) : status === "manual" ? (
              <>
                Couldn&rsquo;t reach the clipboard — the text is in the box below, press <b>Ctrl+C</b>.
              </>
            ) : targetCount ? (
              <>
                <b>{targetCount}</b> target{targetCount > 1 ? "s" : ""} marked — copy the selection and paste it back to
                me for the CVs.
              </>
            ) : (
              <>
                Mark each employer, then copy your selection. <b>{EMPLOYERS.length}</b> employers listed.
              </>
            )}
          </span>
          <button type="button" className="ghost" onClick={showAll}>
            Show all
          </button>
          <button type="button" className="ghost" onClick={resetMarks}>
            Reset marks
          </button>
          <button type="button" className="primary" onClick={copySelection}>
            📋 Copy selection
          </button>
        </div>
      </div>

      {output ? (
        <div className="wrap">
          <textarea className="out" readOnly spellCheck="false" value={output} />
        </div>
      ) : null}
    </>
  );
}
