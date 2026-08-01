import { useMemo, useState } from "react";
import { COMPANIES, KM, TIERS, kmOf } from "./data/techCompanies";
import { copyText, useMarks } from "./useMarks";

const STORAGE_KEY = "qassim_tech_v1";
const PRECISION_NOTE = { exact: "exact", street: "±3 km", town: "town centre", city: "±5 km" };
const CITIES = ["all", "Buraydah", "Unaizah", "Ar-Rass", "Riyadh Al-Khabra", "Al-Bukayriyah"];
const CITY_LABEL = { all: "All", "Riyadh Al-Khabra": "R. Al-Khabra" };

function DistanceTags({ id }) {
  const entry = KM[id];
  if (!entry) return <span className="tag km-unknown">? km — unplaceable</span>;
  const [km, precision] = entry;
  return (
    <>
      <span className="tag km">{km} km</span>
      <span className="tag prec">{PRECISION_NOTE[precision]}</span>
    </>
  );
}

function RatingTag({ rating }) {
  if (!rating) return null;
  const [stars, count] = rating;
  const cls = stars >= 4.5 ? "r-hi" : stars >= 3.5 ? "r-mid" : "r-lo";
  return (
    <span className={`tag ${cls}`}>
      ★ {stars}
      {count ? ` (${count})` : ""}
    </span>
  );
}

function CompanyCard({ company, mark, onToggle }) {
  const state = mark || "";
  return (
    <article className="card" data-state={state}>
      <div className="top">
        <div className="name">
          <h3>{company.n}</h3>
          <span className="arname ar" dir="rtl">
            {company.ar}
          </span>
        </div>
        <div className="tags">
          <DistanceTags id={company.id} />
          <span className="tag city">{company.city}</span>
          <RatingTag rating={company.r} />
          {company.own ? <span className="tag own">♻ your old DB</span> : null}
          <span className="tag src">{company.src}</span>
        </div>
      </div>

      <dl className="cardbody">
        <div className="row tight">
          <dt>Does</dt>
          <dd>{company.does}</dd>
        </div>
        <div className="row tight">
          <dt>Angle</dt>
          {/* `why` is authored copy that intentionally contains <b> emphasis. */}
          <dd dangerouslySetInnerHTML={{ __html: company.why }} />
        </div>
        {company.ph ? (
          <div className="row tight">
            <dt>Phone</dt>
            <dd>
              <span className="ph">{company.ph}</span>
            </dd>
          </div>
        ) : null}
        {company.addr && company.addr !== "—" ? (
          <div className="row tight">
            <dt>Where</dt>
            <dd>{company.addr}</dd>
          </div>
        ) : null}
        {company.q ? (
          <div className="quote ar" dir="rtl">
            {company.q}
          </div>
        ) : null}
      </dl>

      <div className="acts">
        <button
          type="button"
          className="btn t"
          aria-pressed={state === "target"}
          onClick={() => onToggle(company.id, "target")}
        >
          ✓ Target
        </button>
        <button
          type="button"
          className="btn s"
          aria-pressed={state === "skip"}
          onClick={() => onToggle(company.id, "skip")}
        >
          ✗ Skip
        </button>
        {company.links?.length ? (
          <div className="links right">
            {company.links.map(([text, url]) => (
              <a key={url} href={url} target="_blank" rel="noopener noreferrer">
                {text}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}

export default function TechCompanies() {
  const { marks, toggle, reset } = useMarks(STORAGE_KEY);
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("all");
  const [nearOnly, setNearOnly] = useState(false);
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState(null);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const shown = COMPANIES.filter((c) => {
      if (city !== "all" && c.city !== city) return false;
      if (nearOnly && kmOf(c.id) > 35) return false;
      if (q) {
        const hay = `${c.n} ${c.ar} ${c.city} ${c.does} ${c.addr || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    return TIERS.map((tier) => ({
      tier,
      items: shown
        .filter((c) => c.tier === tier.k)
        .sort((a, b) => kmOf(a.id) - kmOf(b.id)),
    })).filter((g) => g.items.length);
  }, [query, city, nearOnly]);

  const targetCount = COMPANIES.filter((c) => marks[c.id] === "target").length;
  const skipCount = COMPANIES.filter((c) => marks[c.id] === "skip").length;

  function showAll() {
    setQuery("");
    setCity("all");
    setNearOnly(false);
  }

  function resetMarks() {
    if (window.confirm("Clear every Target/Skip mark?")) {
      reset();
      setStatus(null);
    }
  }

  async function copySelection() {
    const tierName = (k) => (TIERS.find((t) => t.k === k)?.t || k).replace(/^\S+\s/, "");
    const pick = (kind) =>
      COMPANIES.filter((c) => marks[c.id] === kind)
        .sort((a, b) => kmOf(a.id) - kmOf(b.id))
        .map(
          (c) =>
            `- ${c.n} (${c.ar}) — ${KM[c.id] ? `${KM[c.id][0]} km` : "km unknown"} — ${c.city} — ${tierName(c.tier)}${c.ph ? ` — ${c.ph}` : ""}`
        );
    const targets = pick("target");
    const skips = pick("skip");
    const undecided = COMPANIES.filter((c) => !marks[c.id]).map((c) => `- ${c.n}`);
    const text = [
      `QASSIM TECH COMPANIES — MY SELECTION (${new Date().toISOString().slice(0, 10)})`,
      "",
      `## TARGET — write a CV for these (${targets.length})`,
      targets.length ? targets.join("\n") : "(none)",
      "",
      `## SKIP (${skips.length})`,
      skips.length ? skips.join("\n") : "(none)",
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
        <div className="wrap narrow">
          <h1>
            Qassim tech companies — <span>the long list</span>
          </h1>
          <p className="sub">
            Every software house, web/app agency, and IT office I could find inside <b>50 km</b> of your pin — swept
            through Google Maps (many query variations × every city), the dlilsa.com Saudi business directory, Sabbar
            and Bayt job boards, and each company&rsquo;s own site. Small offices and one-to-ten-person shops are the
            focus, because that&rsquo;s where a junior who can ship end-to-end actually gets hired. Universities,
            schools, factories, hospitals and retail are all out.
          </p>
          <p className="sub" style={{ color: "var(--dim2)" }}>
            <b style={{ color: "var(--ink)" }}>Every distance below is measured from your pin</b> — plus codes decoded
            exactly where Google published one, street geocoded otherwise. Nearest is{" "}
            <b style={{ color: "var(--ink)" }}>2.9 km</b>, furthest is <b style={{ color: "var(--ink)" }}>43.5 km</b>.
            Nothing here is outside 50 km.
          </p>
          <div className="stat-row">
            <span className="stat">
              📍 <b>26°07&apos;55.6&quot;N 43°38&apos;37.7&quot;E</b> — Al-Bukayriyah
            </span>
            <span className="stat">
              <b>{COMPANIES.length}</b> companies
            </span>
            <span className="stat">
              range <b>2.9 – 43.5 km</b>
            </span>
            <span className="stat">
              ♻ <b>{COMPANIES.filter((c) => c.own).length}</b> recovered from your old app
            </span>
          </div>
        </div>
      </header>

      <div className="bar">
        <div className="wrap narrow bar-in">
          <input
            type="search"
            placeholder="Search name, city, service…"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {CITIES.map((c) => (
            <button
              key={c}
              type="button"
              className="chip"
              aria-pressed={city === c}
              onClick={() => setCity(c)}
            >
              {CITY_LABEL[c] || c}
            </button>
          ))}
          <button
            type="button"
            className="chip"
            aria-pressed={nearOnly}
            onClick={() => setNearOnly((v) => !v)}
          >
            ≤ 35 km only
          </button>
          <div className="counts">
            <span className="ct">
              Target <b>{targetCount}</b>
            </span>
            <span className="cs">
              Skip <b>{skipCount}</b>
            </span>
            <span className="cu">
              Left <b>{COMPANIES.length - targetCount - skipCount}</b>
            </span>
          </div>
        </div>
      </div>

      <main className="wrap narrow">
        {groups.length === 0 ? (
          <div className="empty">Nothing matches that filter.</div>
        ) : (
          groups.map(({ tier, items }) => (
            <section className="tier" key={tier.k}>
              <div className="tier-h">
                <h2>
                  {tier.t}
                  <span className="n">{items.length}</span>
                </h2>
                <p>{tier.d}</p>
              </div>
              <div className="grid">
                {items.map((c) => (
                  <CompanyCard key={c.id} company={c} mark={marks[c.id]} onToggle={toggle} />
                ))}
              </div>
            </section>
          ))
        )}
      </main>

      <div className="wrap narrow">
        <details>
          <summary>⚠️ Read this before you call anyone</summary>
          <div className="inner">
            <ul>
              <li>
                <b>How each distance was measured.</b> Straight-line from 26.132111, 43.643809 — not driving distance,
                which will be longer. <b>exact</b> means I decoded the business&rsquo;s own Google plus code (accurate to
                ~15 m). <b>±3 km</b> means I geocoded its street, and Buraydah&rsquo;s main roads run for kilometres, so
                the shop sits somewhere along that line. <b>±5 km</b> means only the city was known, so I used Buraydah
                centre (39.5 km) — the city is ~15 km across, so treat those as 35–48 km.{" "}
                <b>Worst case anywhere on this page is roughly 46 km. Nothing exceeds 50.</b>
              </li>
              <li>
                <b>Only one company can&rsquo;t be placed:</b> Radic IT publishes no address in any country. It&rsquo;s
                tagged <b>? km</b> and sits in the verify tier.
              </li>
              <li>
                <b>Star ratings are a signal, not a verdict.</b> &ldquo;★5.0 (2 reviews)&rdquo; means almost nothing.
                &ldquo;★4.1 (62 reviews)&rdquo; is far more trustworthy. I&rsquo;ve shown the review count everywhere so
                you can judge.
              </li>
              <li>
                <b>Google Maps mixes in national results.</b> Several accounting-software and web-design companies that
                surfaced in Buraydah searches are actually Riyadh companies (Al-Malaz, Yamamah Tower, King Fahd Rd are
                Riyadh addresses) or even Egypt-based (+20 numbers). I removed those. If a company here has no local
                address shown, treat the location as unconfirmed.
              </li>
              <li>
                <b>&ldquo;مؤسسة&rdquo; (establishment) usually means 1–3 people.</b> That is not a downside for you — it
                means the owner makes the decision, there&rsquo;s no HR filter, and one good conversation settles it. But
                don&rsquo;t expect a formal job posting, salary band, or visa sponsorship.
              </li>
              <li>
                <b>Al-Bukayriyah and Al-Badayea have no software companies.</b> I searched specifically; the only
                tech-adjacent results were technical colleges and phone-repair shops. Your nearest real software work is
                Riyadh Al-Khabra (~12 km, unconfirmed) and then Buraydah (~39 km).
              </li>
              <li>
                <b>Correction from my last list:</b> I wrongly merged <b>efhas technologies / افحص لتقنية المعلومات</b>{" "}
                into Al-Diqah Smart IT. The directory shows them as two separate Buraydah companies at different
                addresses. Both are listed here.
              </li>
            </ul>
          </div>
        </details>

        <details>
          <summary>🔎 How to approach a shop this size (it isn&rsquo;t a CV)</summary>
          <div className="inner">
            <ul>
              <li>
                <b>Lead with links, not attachments.</b> These owners decide from a WhatsApp message with three live
                URLs, not a PDF. Your four live domains are the entire pitch.
              </li>
              <li>
                <b>Write in Arabic, under five lines.</b> Name one specific thing on their site or portfolio you looked
                at. Almost nobody does this and it works.
              </li>
              <li>
                <b>Ask for a project, not a job.</b> &ldquo;هل عندكم مشروع أقدر أشتغل عليه؟&rdquo; is a far easier yes
                than a salaried role, and it sidesteps the work-permit conversation entirely. One delivered project
                converts into ongoing work.
              </li>
              <li>
                <b>Say &ldquo;solo&rdquo; about at least two projects.</b> Small shops care about exactly one thing: can
                you be handed a client and left alone.
              </li>
              <li>
                <b>Batch your visits.</b> Most of these are within a few km of each other in Buraydah — King Khalid Rd,
                King Abdullah Rd, and Ali bin Abi Talib Rd cover a dozen of them. One afternoon, one trip.
              </li>
            </ul>
          </div>
        </details>
      </div>

      <div className="dock">
        <div className="wrap narrow dock-in">
          <span className="msg">
            {status === "copied" ? (
              <>
                <b>Copied.</b> Paste it into the chat and I&rsquo;ll write the CVs.
              </>
            ) : status === "manual" ? (
              <>
                Clipboard blocked — the text is in the box below, press <b>Ctrl+C</b>.
              </>
            ) : targetCount ? (
              <>
                <b>{targetCount}</b> target{targetCount > 1 ? "s" : ""} marked — copy and paste back to me for the CVs.
              </>
            ) : (
              <>
                Mark each company, then copy your selection. <b>{COMPANIES.length}</b> companies listed.
              </>
            )}
          </span>
          <button type="button" className="ghost" onClick={showAll}>
            Show all
          </button>
          <button type="button" className="ghost" onClick={resetMarks}>
            Reset
          </button>
          <button type="button" className="primary" onClick={copySelection}>
            📋 Copy selection
          </button>
        </div>
      </div>

      {output ? (
        <div className="wrap narrow">
          <textarea className="out" readOnly spellCheck="false" value={output} />
        </div>
      ) : null}
    </>
  );
}
