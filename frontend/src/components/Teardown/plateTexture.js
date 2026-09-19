// Draws a layer's real content onto a canvas that becomes a plate's face.
// Latin fonts only. Rows are [tag, text] pairs taken from content.js.

export const PLATE_W = 1280;
export const PLATE_H = 800;

const PALETTE = ["#cfe3ff", "#8be0b0", "#ffb08a", "#c9b6ff"];
const TAG_COLOR = { GET: "#7fb2ff", POST: "#ffc21a", CRON: "#8be0b0", NEVER: "#ff8a7a", ACT: "#ffc21a", SHOWS: "#8be0b0" };

function tagColor(tag) {
  if (TAG_COLOR[tag]) return TAG_COLOR[tag];
  let h = 0;
  for (const c of tag) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

function fit(ctx, text, maxW) {
  if (ctx.measureText(text).width <= maxW) return text;
  let s = text;
  while (s.length > 1 && ctx.measureText(`${s}...`).width > maxW) s = s.slice(0, -1);
  return `${s}...`;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function drawPlate(canvas, layer, index, total, image, opts = {}) {
  const ctx = canvas.getContext("2d");
  const W = PLATE_W;
  const H = PLATE_H;
  const head = '"Bricolage Grotesque", system-ui, sans-serif';
  const mono = '"IBM Plex Mono", ui-monospace, monospace';

  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#14386b");
  g.addColorStop(1, "#0c2246");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = "rgba(159,192,234,0.07)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y <= H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  ctx.strokeStyle = "rgba(159,192,234,0.6)";
  ctx.lineWidth = 3;
  roundRect(ctx, 10, 10, W - 20, H - 20, 14);
  ctx.stroke();

  // header
  ctx.fillStyle = "#ffc21a";
  ctx.beginPath();
  ctx.arc(92, 98, 34, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#0c2246";
  ctx.font = `500 34px ${mono}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(index + 1), 92, 100);
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#e6eefb";
  ctx.font = `700 68px ${head}`;
  ctx.fillText(fit(ctx, layer.name, W - 220), 150, 108);
  ctx.fillStyle = "#9fc0ea";
  ctx.font = `400 28px ${mono}`;
  ctx.fillText(fit(ctx, layer.role || "", W - 220), 152, 152);
  ctx.strokeStyle = "rgba(159,192,234,0.35)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(48, 186);
  ctx.lineTo(W - 48, 186);
  ctx.stroke();

  // body
  if (layer.kind === "image") {
    if (image && image.complete && image.naturalWidth) {
      const maxH = H - 186 - 96;
      const maxW = W - 96;
      const s = Math.min(maxW / image.naturalWidth, maxH / image.naturalHeight);
      const w = image.naturalWidth * s;
      const h = image.naturalHeight * s;
      const x = (W - w) / 2;
      const y = 186 + 24 + (maxH - h) / 2;
      ctx.drawImage(image, x, y, w, h);
      ctx.strokeStyle = "rgba(159,192,234,0.5)";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, w, h);
    }
  } else {
    const rows = layer.rows || [];
    const maxTextW = opts.narrow ? 820 : W - 96 - 60;
    const rowH = Math.min(84, (H - 186 - 110) / Math.max(rows.length, 1));
    ctx.textBaseline = "middle";
    rows.forEach(([tag, text], r) => {
      const cy = 186 + 50 + r * rowH + rowH / 2 - 22;
      let x = 64;
      if (tag) {
        ctx.font = `500 27px ${mono}`;
        const c = tagColor(tag);
        const tw = ctx.measureText(tag).width + 36;
        ctx.fillStyle = `${c}29`;
        roundRect(ctx, x, cy - 26, tw, 52, 10);
        ctx.fill();
        ctx.strokeStyle = c;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = c;
        ctx.textAlign = "center";
        ctx.fillText(tag, x + tw / 2, cy + 1);
        ctx.textAlign = "left";
        x += tw + 26;
      }
      ctx.font = `400 35px ${mono}`;
      ctx.fillStyle = "#e6eefb";
      ctx.fillText(fit(ctx, text, maxTextW - (x - 64)), x, cy + 1);
      ctx.strokeStyle = "rgba(159,192,234,0.14)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(48, cy + rowH / 2 - 2);
      ctx.lineTo(W - 48, cy + rowH / 2 - 2);
      ctx.stroke();
    });
  }

  // footer
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#9fc0ea";
  ctx.font = `400 26px ${mono}`;
  ctx.textAlign = "left";
  ctx.fillText(fit(ctx, layer.note || "", W - 260), 64, H - 44);
  ctx.textAlign = "right";
  ctx.fillText(`${index + 1} / ${total}`, W - 64, H - 44);
  ctx.textAlign = "left";
}
