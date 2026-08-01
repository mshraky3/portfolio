import { useMemo, useState } from "react";
import {
  DEFERRED, HOME, MAPS_LINK, MOH_APPLY_ONLINE, NOT_ON_ROUTE, PLAN, STOPS,
} from "./data/visitRoute";

const FILTERS = [
  { key: "all", label: "Both of us" },
  { key: "tech", label: "💻 My stops" },
  { key: "gp", label: "🩺 His stops" },
];

/**
 * Schematic map of the run. Real coordinates, projected and scaled to the box,
 * so relative positions and the route shape are accurate — roads are not drawn.
 */
function RouteMap({ filter }) {
  const { points, homePoint, path } = useMemo(() => {
    const all = [...STOPS, DEFERRED, HOME];
    const lats = all.map((p) => p.lat);
    const lngs = all.map((p) => p.lng);
    const minLat = Math.min(...lats), maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);

    // Longitude degrees are shorter than latitude ones at this latitude.
    const lngScale = Math.cos((26.3 * Math.PI) / 180);
    const w = (maxLng - minLng) * lngScale;
    const h = maxLat - minLat;
    const pad = 36, boxW = 640 - pad * 2, boxH = 430 - pad * 2;
    const scale = Math.min(boxW / w, boxH / h);

    const project = (p) => ({
      x: pad + (p.lng - minLng) * lngScale * scale + (boxW - w * scale) / 2,
      y: pad + (maxLat - p.lat) * scale + (boxH - h * scale) / 2, // SVG y grows down
    });

    const pts = STOPS.map((s) => ({ ...s, ...project(s) }));
    const home = { ...HOME, ...project(HOME) };
    const def = { ...DEFERRED, ...project(DEFERRED), deferred: true };
    return {
      points: [...pts, def],
      homePoint: home,
      path: [home, ...pts].map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" "),
    };
  }, []);

  const last = points[STOPS.length - 1];

  return (
    <svg className="routemap" viewBox="0 0 640 430" role="img"
         aria-label="Schematic map of the combined Buraydah route">
      <polyline className="rm-path" points={path} />
      <line className="rm-return" x1={last.x} y1={last.y} x2={homePoint.x} y2={homePoint.y} />

      <g className="rm-home">
        <circle cx={homePoint.x} cy={homePoint.y} r="7" />
        <text x={homePoint.x} y={homePoint.y - 13}>🏠 Al-Bukayriyah</text>
      </g>

      {points.map((p) => {
        const dim = !p.deferred && filter !== "all" && p.who !== filter;
        return (
          <g key={p.name}
             className={`rm-stop ${p.deferred ? "deferred" : p.who} ${dim ? "dim" : ""}`}>
            <circle cx={p.x} cy={p.y} r="13" />
            <text className="rm-num" x={p.x} y={p.y + 4.5}>{p.deferred ? "16" : p.order}</text>
            <text className="rm-label" x={p.x} y={p.y - 19}>
              {p.name.replace(/ (Programming|Information Technology|IT|Qassim|Technology|Hospital|Medical Complex \(1\))$/, "")}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function Stop({ stop }) {
  const isGp = stop.who === "gp";
  return (
    <article className={`stopcard ${stop.band} ${isGp ? "gp" : "tech"}`}>
      <div className="stop-head">
        <div className={`stop-n ${isGp ? "gp" : ""}`}>{stop.order}</div>
        <div className="stop-id">
          <h3>
            {stop.name}{" "}
            <span className={`whotag ${isGp ? "gp" : "tech"}`}>{isGp ? "🩺 him" : "💻 me"}</span>
          </h3>
          <span className="arname ar" dir="rtl">{stop.ar}</span>
          <div className="stop-addr">{stop.address}</div>
        </div>
        <div className="stop-when">
          <span className="tag km">{stop.arrive} → {stop.leave}</span>
          <span className="tag">{stop.hours}</span>
          {stop.rating ? <span className="tag r-hi">★ {stop.rating}</span> : null}
          {stop.kind ? <span className="tag src">{stop.kind}</span> : null}
        </div>
      </div>

      {stop.warn ? <p className="stop-warn">⚠ {stop.warn}</p> : null}
      <p className="stop-move">{stop.move}</p>
      {stop.update ? <p className="stop-update"><b>Note:</b> {stop.update}</p> : null}

      <div className="stop-acts">
        <a className="btn-call" href={`tel:${stop.phone.replace(/\s/g, "")}`}>📞 {stop.phone}</a>
        <a className="btn-map" href={stop.mapPin} target="_blank" rel="noopener noreferrer">📍 Exact pin</a>
        <a className="btn-map" href={stop.mapListing} target="_blank" rel="noopener noreferrer">🔍 Listing</a>
        {stop.site ? (
          <a className="btn-site" href={stop.site} target="_blank" rel="noopener noreferrer">🌐 Site</a>
        ) : null}
        {stop.cv ? <span className="stop-cv">CV: <b>{stop.cv}.pdf</b></span> : null}
      </div>
    </article>
  );
}

export default function VisitRoute() {
  const [filter, setFilter] = useState("all");
  const shown = filter === "all" ? STOPS : STOPS.filter((s) => s.who === filter);

  return (
    <>
      <header>
        <div className="wrap narrow">
          <h1>
            Buraydah run — <span>two people, 10 stops</span>
          </h1>
          <p className="sub">
            One car, one morning: your six software targets plus four private medical employers for your friend&rsquo;s
            GP applications. Solved as an exact time-window route, so every stop lands inside its real opening hours.
            Coordinates come from each business&rsquo;s Google plus code (±15 m), and hours were re-checked on Maps
            today.
          </p>
          <div className="stat-row">
            <span className="stat">🕗 leave <b>{PLAN.departure}</b></span>
            <span className="stat">🏁 home <b>{PLAN.finish}</b></span>
            <span className="stat">🚗 <b>{PLAN.outboundKm} km</b> · {PLAN.outboundDriveTime} to the last stop</span>
            <span className="stat">↩ <b>~{PLAN.roundTripKm} km</b> round trip</span>
            <span className="stat">💻 <b>{PLAN.techStops}</b> tech · 🩺 <b>{PLAN.gpStops}</b> medical</span>
            <span className="stat">⏳ <b>0 min</b> waiting</span>
          </div>
          <div className="route-cta">
            <a className="primary" href={MAPS_LINK} target="_blank" rel="noopener noreferrer">
              🗺️ Open all 10 stops in Google Maps
            </a>
            <span className="route-cta-note">
              Real driving directions, in this order, on your phone.
            </span>
          </div>
        </div>
      </header>

      <main className="wrap narrow">
        <div className="whofilter">
          {FILTERS.map((f) => (
            <button key={f.key} type="button" className="chip"
                    aria-pressed={filter === f.key} onClick={() => setFilter(f.key)}>
              {f.label}
            </button>
          ))}
          <span className="whofilter-note">
            Filtering only highlights — you travel together, so every stop is still on the route.
          </span>
        </div>

        <RouteMap filter={filter} />
        <p className="map-note">
          Schematic — real relative positions, roads not drawn. Stops <b>4</b> and <b>5</b> sit on one point because
          Al-Diqah and Panorama are <b>14 m apart</b>; stops <b>6</b> and <b>7</b> are two hospitals 1.5 km apart, so
          he does both while you wait. The greyed marker <b>16</b> is Nuzum Code — a 16:00 phone call, not a drive.
        </p>

        {shown.map((s) => <Stop stop={s} key={s.name} />)}

        <h2 className="sec">Then, at 16:00<span className="n">1</span></h2>
        <p className="secnote">
          Nuzum Code opens at 16:00 and needs a qualifying question before it is worth any drive.
        </p>
        <article className="stopcard band-b tech">
          <div className="stop-head">
            <div className="stop-n">📞</div>
            <div className="stop-id">
              <h3>{DEFERRED.name} <span className="whotag tech">💻 me</span></h3>
              <span className="arname ar" dir="rtl">{DEFERRED.ar}</span>
              <div className="stop-addr">{DEFERRED.address}</div>
            </div>
            <div className="stop-when">
              <span className="tag km">call 16:00</span>
              <span className="tag r-hi">★ {DEFERRED.rating}</span>
              <span className="tag">{DEFERRED.kmHome} km</span>
            </div>
          </div>
          <p className="stop-move">{DEFERRED.move}</p>
          <p className="stop-update"><b>Note:</b> {DEFERRED.update}</p>
          <div className="stop-acts">
            <a className="btn-call" href={`tel:${DEFERRED.phone.replace(/\s/g, "")}`}>📞 {DEFERRED.phone}</a>
            <a className="btn-map" href={DEFERRED.mapPin} target="_blank" rel="noopener noreferrer">📍 Exact pin</a>
            <a className="btn-site" href={DEFERRED.site} target="_blank" rel="noopener noreferrer">🌐 Site</a>
            <span className="stop-cv">CV: <b>{DEFERRED.cv}.pdf</b></span>
          </div>
        </article>

        <details>
          <summary>🩺 For your friend — the GP side</summary>
          <div className="inner">
            <p>
              Four medical stops are on the route: three private hospitals and one 24-hour polyclinic. They were chosen
              because private employers hire expatriate physicians far more readily than the Ministry of Health does,
              and because their HR desks can be walked into. Ask reception for HR / الموارد البشرية by name.
            </p>
            <ul>
              <li><b>Best odds — Dr. Sulaiman Al-Habib (stop 6):</b> the largest private hospital group in the Kingdom, ★4.4 from 8,727 reviews, recruiting physicians continuously.</li>
              <li><b>Qassim National Hospital (stop 7):</b> large private hospital, ★3.9 from 2,503 reviews.</li>
              <li><b>Salamat Medical Complex (stop 10):</b> polyclinic, open 24h. Polyclinics hire GPs faster and with less bureaucracy than hospitals.</li>
              <li><b>Al-Freih Hospital (stop 1):</b> private, ★3.1 from 1,039 reviews. First because it is on the way in.</li>
              <li><b>He must bring</b> SCFHS registration or classification status, degree and internship certificates, CV, and passport/iqama copies. HR will ask for the SCFHS paperwork first — without it the visit is wasted.</li>
            </ul>
            <p>
              <b>Apply online instead of driving</b> — these are Ministry of Health, where hiring is centralised and a
              walk-in at the gate never reaches a decision-maker:
            </p>
            <ul>{MOH_APPLY_ONLINE.map((h) => <li key={h}>{h}</li>)}</ul>
            <p>
              <b>What I could not check:</b> whether any of the four currently has a GP vacancy. Google Maps shows
              location and hours, not openings — so treat all four as speculative walk-ins, exactly as the tech stops
              are being treated.
            </p>
          </div>
        </details>

        <h2 className="sec">Not on this run<span className="n">{NOT_ON_ROUTE.length}</span></h2>
        <div className="lgrid">
          {NOT_ON_ROUTE.map((n) => (
            <div className="offroute" key={n.name}>
              <span className="or-rank">#{n.rank}</span>
              <span className="or-name">{n.name}</span>
              <span className="or-why">{n.why}</span>
              {n.phone ? (
                <a className="or-call" href={`tel:${n.phone.replace(/\s/g, "")}`}>{n.phone}</a>
              ) : <span className="or-call muted">no number</span>}
            </div>
          ))}
        </div>

        <details>
          <summary>📋 Before you leave</summary>
          <div className="inner">
            <ul>
              <li>Six tech CVs printed or on the phone — <b>job-hunt/cv/</b>, one per stop.</li>
              <li>Your friend: CV + SCFHS papers + degree certificates + iqama copies.</li>
              <li><b>alhisony.com</b> and <b>erthfc.com</b> open in phone tabs. The links are the pitch; the CV is what you leave behind.</li>
              <li>Read <b>mte.sa</b>&rsquo;s portfolio on the drive — naming one of their projects is the whole opening at stop 8.</li>
              <li>Ask for a <b>project</b>, not a job: هل عندكم مشروع أقدر أشتغل عليه؟</li>
              <li>Say <b>&ldquo;solo&rdquo;</b> about at least two of your four systems.</li>
              <li><b>Stop 2 closes at 12:00</b> until 16:00 — it cannot slip. And do not pitch development there.</li>
              <li>16:00 — call Nuzum Code and ask the one qualifying question.</li>
            </ul>
          </div>
        </details>

        <details>
          <summary>📐 How the order was worked out</summary>
          <div className="inner">
            <ul>
              <li><b>Coordinates</b> are decoded from each business&rsquo;s Google plus code (±15 m). Street-name geocoding was tried and rejected — it placed King Khalid Rd 35.4 km from your pin when the real shops on it are 41–42.6 km away, because Buraydah&rsquo;s roads run for kilometres. The decoder was validated against Codlop, whose decoded 41.1 km matches the figure recorded independently in your data.</li>
              <li><b>Order</b> is an exact Held-Karp search over arrival time — 1,024 subsets × 10 endpoints — carrying the clock in the state so both opening and closing times bind. Any order arriving too late to finish before a stop closes is discarded outright.</li>
              <li><b>That constraint changed the answer.</b> The distance-only optimum put Solutions Corner in the early afternoon, but its Wednesday hours are 09:00–12:00 then 16:00–23:00 — it would have been shut. It is now stop 2.</li>
              <li><b>Driving distance and time are Google&rsquo;s own</b> (74.1 km, 1 h 34 min), read back off the route link.</li>
              <li><b>Sunday to Thursday only.</b> Codlop, Panorama, MTE and Rossum are each closed at least one of Friday/Saturday.</li>
            </ul>
          </div>
        </details>
      </main>
    </>
  );
}
