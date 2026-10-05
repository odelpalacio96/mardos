// Curvas compartidas por las animaciones del hero (mismos valores que
// --ease-ui-out y --ease-ui-in-out en globals.css).

function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const slopeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const err = sampleX(t) - x;
      if (Math.abs(err) < 1e-5) return sampleY(t);
      const d = slopeX(t);
      if (Math.abs(d) < 1e-6) break;
      t -= err / d;
    }
    let lo = 0;
    let hi = 1;
    t = x;
    for (let i = 0; i < 30; i++) {
      const v = sampleX(t);
      if (Math.abs(v - x) < 1e-5) break;
      if (v < x) lo = t;
      else hi = t;
      t = (lo + hi) / 2;
    }
    return sampleY(t);
  };
}

export const easeOut = cubicBezier(0.23, 1, 0.32, 1);
export const easeInOut = cubicBezier(0.77, 0, 0.175, 1);

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Progreso 0–1 de un tramo que empieza en `start` y dura `dur` segundos. */
export const segment = (t: number, start: number, dur: number) =>
  clamp01((t - start) / dur);

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
