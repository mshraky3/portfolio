// A parametric hand with the 21-landmark topology MediaPipe uses:
// 0 wrist; 1-4 thumb; 5-8 index; 9-12 middle; 13-16 ring; 17-20 little finger.
// This is an illustration of the model, not a capture of anyone's hand.

export const CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [0, 17], [17, 18], [18, 19], [19, 20],
];

export const POSES = [
  { name: "Open hand", curl: [0, 0, 0, 0, 0] },
  { name: "Pointing", curl: [0.85, 0, 1, 1, 1] },
  { name: "Fist", curl: [1, 1, 1, 1, 1] },
];

const FINGERS = [
  { base: [-0.42, 0.28], dir: [-0.6, 0.8], len: [0.52, 0.4, 0.34], thumb: true },
  { base: [-0.42, 1.0], dir: [-0.08, 1], len: [0.62, 0.4, 0.32] },
  { base: [-0.14, 1.06], dir: [0, 1], len: [0.68, 0.44, 0.34] },
  { base: [0.14, 1.0], dir: [0.05, 1], len: [0.6, 0.4, 0.32] },
  { base: [0.4, 0.88], dir: [0.16, 1], len: [0.46, 0.3, 0.26] },
];

const MAX = [1.45, 1.6, 1.1];

// curl: five values in [0, 1]. Returns 21 [x, y, z] points, y up, z toward the viewer.
export function poseHand(curl) {
  const pts = [[0, 0, 0]];
  FINGERS.forEach((f, i) => {
    const c = curl[i];
    const n = Math.hypot(f.dir[0], f.dir[1]);
    const dx = f.dir[0] / n;
    const dy = f.dir[1] / n;
    let [x, y, z] = [f.base[0], f.base[1], 0];
    pts.push([x, y, z]);
    let sum = 0;
    for (let j = 0; j < 3; j += 1) {
      sum += c * MAX[j] * (f.thumb ? 0.75 : 1);
      const cos = Math.cos(sum);
      const sin = Math.sin(sum);
      // Fingers fold away from the viewer (-z); the thumb also sweeps across the palm (+x).
      const side = f.thumb ? 0.7 : 0;
      x += f.len[j] * (dx * cos + side * sin);
      y += f.len[j] * (dy * cos);
      z += f.len[j] * (-sin * (f.thumb ? 0.7 : 1));
      pts.push([x, y, z]);
    }
  });
  return pts;
}

export function lerpCurl(a, b, t) {
  return a.map((v, i) => v + (b[i] - v) * t);
}
