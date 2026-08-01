import { DETAILS, SECTIONS, TOTAL_COMPANIES } from "./data/employersItJobs";

function CompanyCard({ card }) {
  return (
    <article className={`card${card.low ? " low" : ""}`}>
      <div className="top">
        <div className="name">
          <h3>{card.name}</h3>
          {card.ar ? (
            <span className="arname ar" dir="rtl">
              {card.ar}
            </span>
          ) : null}
        </div>
        <div className="tags">
          {card.tags.map((t) => (
            <span className={`tag ${t.cls}`.trim()} key={`${t.cls}-${t.text}`}>
              {t.text}
            </span>
          ))}
        </div>
      </div>

      <dl className="cardbody">
        {card.rows.map((row) => (
          <div className="row" key={row.label}>
            <dt>{row.label}</dt>
            {/* Row values keep their authored inline markup (bold, phone spans). */}
            <dd dangerouslySetInnerHTML={{ __html: row.html }} />
          </div>
        ))}
      </dl>

      {card.links.length ? (
        <div className="links footer">
          {card.links.map(([text, url]) => (
            <a key={url} href={url} target="_blank" rel="noopener noreferrer">
              {text}
            </a>
          ))}
        </div>
      ) : null}
    </article>
  );
}

export default function EmployersItJobs() {
  return (
    <>
      <header>
        <div className="wrap narrow">
          <h1>
            Tech companies only <span>·</span> 50 km
          </h1>
          <p className="sub">
            Re-cut after your feedback: every university, school, and non-tech employer (factory, hospital, poultry,
            cement) is gone — including the ones with IT job openings, since they&rsquo;re not tech companies.
            What&rsquo;s left is software houses, web/app developers, and IT-services offices, re-searched through
            Bayt/Sabbar job boards, Google Maps (worked this time — real ratings, phone numbers, reviews), and each
            company&rsquo;s own site.
          </p>
          <div className="stat-row">
            <span className="stat">
              <b>{TOTAL_COMPANIES}</b> tech companies
            </span>
            <span className="stat">
              <b>5</b> cities — Al-Bukayriyah / Riyadh Al-Khabra / Buraydah / Unaizah / Ar-Rass
            </span>
            <span className="stat">
              <b>0</b> universities, schools, or factories
            </span>
          </div>
        </div>
      </header>

      <main className="wrap narrow">
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <div className="big">
              {section.title}
              <span className="n">{section.cards.length}</span>
            </div>
            <p className="sec-note">{section.note}</p>
            <div className="grid">
              {section.cards.map((card) => (
                <CompanyCard card={card} key={card.name} />
              ))}
            </div>
          </section>
        ))}

        {DETAILS.map((d) => (
          <details key={d.summary}>
            <summary>{d.summary}</summary>
            {/* Authored reference copy, kept verbatim. */}
            <div dangerouslySetInnerHTML={{ __html: d.html }} />
          </details>
        ))}
      </main>
    </>
  );
}
