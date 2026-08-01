import { useEffect, useMemo, useState } from "react";
import { INTRO_HTML, RANKED_TARGETS } from "./data/rankedTargets";
import { LEFT } from "./data/targetsLeft";

const STORAGE_KEY = "qassim_left_v1";

/** Companies the user has greyed out, persisted per browser. */
function useDropped() {
  const [dropped, setDropped] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dropped));
    } catch {
      /* nothing persists in private mode — the list still works */
    }
  }, [dropped]);

  const toggle = (name) =>
    setDropped((prev) => {
      const next = { ...prev };
      if (next[name]) delete next[name];
      else next[name] = 1;
      return next;
    });

  return { dropped, toggle, reset: () => setDropped({}) };
}

export default function RankedTargets() {
  const { dropped, toggle, reset } = useDropped();
  const [hideDropped, setHideDropped] = useState(false);

  const rows = useMemo(() => {
    const sorted = [...LEFT].sort((a, b) => a.km - b.km);
    return hideDropped ? sorted.filter((r) => !dropped[r.name]) : sorted;
  }, [hideDropped, dropped]);

  const droppedCount = Object.keys(dropped).length;

  return (
    <>
      <header>
        <div className="wrap narrow">
          <h1>
            Your <span>11 targets</span>, ranked by who&rsquo;s most likely to say yes
          </h1>
          <p className="sub">
            Ordered by probability of a real outcome — not by how good the company is. A slow, prestigious firm ranks
            below a small shop whose owner can decide on the spot.
          </p>
        </div>
      </header>

      <div className="wrap narrow">
        {/* Authored framing copy, kept as written. */}
        <div className="callout" dangerouslySetInnerHTML={{ __html: INTRO_HTML }} />

        <h2 className="sec">
          Targets<span className="n">{RANKED_TARGETS.length}</span>
        </h2>
        <p className="secnote">Ranked 1 → {RANKED_TARGETS.length}. The colour bar on the left is the odds band.</p>

        {RANKED_TARGETS.map((t) => (
          <article
            key={t.rank}
            className={`tcard ${t.band}`}
            dangerouslySetInnerHTML={{ __html: t.html }}
          />
        ))}

        <h2 className="sec">
          The left<span className="n">{LEFT.length - droppedCount}</span>
        </h2>
        <p className="secnote">
          Everything you didn&rsquo;t target. Hit <b>drop</b> to grey one out — that choice is saved in this browser, so
          you can prune this down over time. Nothing is deleted from the list.
        </p>

        <div className="rowbar">
          <button type="button" onClick={() => setHideDropped(false)}>
            Show all
          </button>
          <button type="button" onClick={() => setHideDropped(true)}>
            Hide dropped
          </button>
          <button type="button" onClick={reset}>
            Reset
          </button>
          <span>{droppedCount ? `${droppedCount} dropped` : ""}</span>
        </div>

        <div className="lgrid">
          {rows.map((r) => (
            <div className="l" key={r.name} data-x={dropped[r.name] ? "1" : "0"}>
              <span className="lk">{r.km} km</span>
              <span className="ln">
                {r.name}{" "}
                <em className="ar" dir="rtl">
                  {r.ar}
                </em>
              </span>
              <span className="lc">
                {r.city} · {r.note}
              </span>
              <button type="button" onClick={() => toggle(r.name)}>
                {dropped[r.name] ? "restore" : "drop"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
