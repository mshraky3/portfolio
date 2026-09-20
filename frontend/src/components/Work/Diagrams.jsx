// Small drawings for systems that have no public screen: what the system does,
// as a picture. They only use facts stated on this page (25+ branches, workers
// found by distance, one email gateway shared by four projects).

function Branches() {
  const n = 25;
  const cx = 240;
  const cy = 150;
  const nodes = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 ? 108 : 124;
    return [cx + Math.cos(a) * r * 1.35, cy + Math.sin(a) * r * 0.98];
  });
  return (
    <svg viewBox="0 0 480 300" role="img" aria-label="One central system connected to more than 25 branches">
      {nodes.map(([x, y], i) => (
        <line key={`l${i}`} x1={cx} y1={cy} x2={x} y2={y} className="dg-line" />
      ))}
      <ellipse cx={cx} cy={cy} rx="92" ry="66" className="dg-ring" />
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 5 === 0 ? 6 : 4.5} className={i % 5 === 0 ? "dg-node-hi" : "dg-node"} />
      ))}
      <circle cx={cx} cy={cy} r="30" className="dg-hub" />
      <circle cx={cx} cy={cy} r="46" className="dg-halo" />
      <text x={cx} y={cy + 5} textAnchor="middle" className="dg-text">
        HR
      </text>
      <text x="240" y="292" textAnchor="middle" className="dg-cap">
        25+ branches, one system
      </text>
    </svg>
  );
}

function Nearby() {
  const cx = 240;
  const cy = 150;
  const pts = Array.from({ length: 46 }, (_, i) => {
    const a = i * 2.399963;
    const r = 22 + ((i * 53) % 100) * 1.55;
    return [cx + Math.cos(a) * r * 1.3, cy + Math.sin(a) * r * 0.86, r < 100];
  });
  const target = pts.find((p) => p[2] && p[0] > cx + 30) || pts[0];
  return (
    <svg viewBox="0 0 480 300" role="img" aria-label="An employer at the centre and workers around them; the ones inside the search radius are highlighted">
      {[70, 118, 166].map((r) => (
        <ellipse key={r} cx={cx} cy={cy} rx={r * 1.3} ry={r * 0.86} className="dg-ring" />
      ))}
      <ellipse cx={cx} cy={cy} rx="130" ry="86" className="dg-zone" />
      {pts.map(([x, y, near], i) => (
        <circle key={i} cx={x} cy={y} r={near ? 4.5 : 3} className={near ? "dg-node-hi" : "dg-node"} />
      ))}
      <line x1={cx} y1={cy} x2={target[0]} y2={target[1]} className="dg-call" />
      <circle cx={cx} cy={cy} r="11" className="dg-hub" />
      <circle cx={cx} cy={cy} r="22" className="dg-halo" />
      <text x="240" y="292" textAnchor="middle" className="dg-cap">
        Workers near the employer, one call request away
      </text>
    </svg>
  );
}

function Gateway() {
  const left = [50, 110, 170, 230];
  return (
    <svg viewBox="0 0 480 300" role="img" aria-label="Four projects send email through one gateway, which uses Resend and falls back to Gmail">
      {left.map((y, i) => (
        <g key={y}>
          <line x1="96" y1={y} x2="220" y2="150" className="dg-line" />
          <rect x="30" y={y - 17} width="66" height="34" rx="8" className="dg-box" />
          <text x="63" y={y + 4} textAnchor="middle" className="dg-small">
            Project {i + 1}
          </text>
        </g>
      ))}
      <rect x="220" y="112" width="92" height="76" rx="14" className="dg-hub" />
      <text x="266" y="155" textAnchor="middle" className="dg-text">
        Gateway
      </text>
      <line x1="312" y1="138" x2="392" y2="100" className="dg-call" />
      <line x1="312" y1="162" x2="392" y2="205" className="dg-line" strokeDasharray="5 5" />
      <rect x="392" y="80" width="78" height="40" rx="8" className="dg-box-hi" />
      <text x="431" y="98" textAnchor="middle" className="dg-small">
        Resend
      </text>
      <text x="431" y="112" textAnchor="middle" className="dg-tiny">
        100 a day
      </text>
      <rect x="392" y="185" width="78" height="40" rx="8" className="dg-box" />
      <text x="431" y="203" textAnchor="middle" className="dg-small">
        Gmail
      </text>
      <text x="431" y="217" textAnchor="middle" className="dg-tiny">
        fallback
      </text>
      <text x="240" y="292" textAnchor="middle" className="dg-cap">
        One quota, split fairly across four projects
      </text>
    </svg>
  );
}

const DIAGRAMS = { branches: Branches, nearby: Nearby, gateway: Gateway };

export default function Diagram({ kind }) {
  const Pic = DIAGRAMS[kind];
  return Pic ? (
    <figure className="dg">
      <Pic />
    </figure>
  ) : null;
}
