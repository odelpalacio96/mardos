"use client";

import { useEffect, useRef } from "react";
import { easeInOut, easeOut, lerp, segment } from "./easing";

// Vista lateral del proceso: fluxado → precalentado → ola selectiva.
// La tablilla queda fija y las herramientas se mueven por debajo, como en la máquina real.

const LOOP = 12;
const BOARD_Y = 150;
const BOARD_H = 16;
const UNDER = BOARD_Y + BOARD_H; // cara inferior de la tablilla
const LEAD_END = UNDER + 18;

// Pines pasantes (x en el viewBox)
const PINS = [103, 127, 151, 175, 199, 223, 294, 318, 396, 412, 428];

const PHASES = [
  { label: "Fluxado", start: 0.6, end: 3.6 },
  { label: "Precalentado", start: 3.6, end: 6 },
  { label: "Ola selectiva", start: 6, end: 11.4 },
];

// Recorrido de la boquilla: [t0, t1, x0, x1, raised0, raised1, lineal]
const NOZZLE_PATH: [number, number, number, number, number, number, boolean][] = [
  [6.0, 6.5, 60, 103, 0, 0, false],
  [6.5, 6.75, 103, 103, 0, 1, false],
  [6.75, 8.0, 103, 223, 1, 1, true],
  [8.0, 8.2, 223, 223, 1, 0, false],
  [8.2, 8.6, 223, 294, 0, 0, false],
  [8.6, 8.8, 294, 294, 0, 1, false],
  [8.8, 9.4, 294, 318, 1, 1, true],
  [9.4, 9.6, 318, 318, 1, 0, false],
  [9.6, 10.0, 318, 396, 0, 0, false],
  [10.0, 10.2, 396, 396, 0, 1, false],
  [10.2, 10.8, 396, 428, 1, 1, true],
  [10.8, 11.0, 428, 428, 1, 0, false],
  [11.0, 11.6, 428, 60, 0, 0, false],
];

function nozzleAt(t: number) {
  for (const [t0, t1, x0, x1, r0, r1, linear] of NOZZLE_PATH) {
    if (t >= t0 && t < t1) {
      const f = (t - t0) / (t1 - t0);
      const e = linear ? f : easeInOut(f);
      return { x: lerp(x0, x1, e), raised: lerp(r0, r1, e) };
    }
  }
  return { x: 60, raised: 0 };
}

const NOZZLE_DOWN = 214; // tope de la ola sin tocar
const NOZZLE_UP = 180; // la ola moja los pines

type Props = { active: boolean; reducedMotion: boolean };

export default function WaveSolderAnimation({ active, reducedMotion }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const fluxHeadRef = useRef<SVGGElement>(null);
  const dropletRefs = useRef<(SVGCircleElement | null)[]>([]);
  const fluxMarkRefs = useRef<(SVGCircleElement | null)[]>([]);
  const filletRefs = useRef<(SVGPathElement | null)[]>([]);
  const heaterRef = useRef<SVGGElement>(null);
  const heatWaveRefs = useRef<(SVGPathElement | null)[]>([]);
  const nozzleRef = useRef<SVGGElement>(null);
  const waveRef = useRef<SVGPathElement>(null);
  const waveGlowRef = useRef<SVGEllipseElement>(null);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const activeRef = useRef(active);
  const controlRef = useRef<{ restart: () => void; sync: () => void } | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let t = 0;
    let time = 0;
    const solderedAt: number[] = PINS.map(() => Infinity);

    const draw = () => {
      // Fluxado: el cabezal recorre la tablilla y dispara gotas a cada pin
      const fluxP = segment(t, 0.6, 3);
      const headX = lerp(-40, 600, fluxP);
      fluxHeadRef.current?.setAttribute("transform", `translate(${headX} 0)`);
      const nearPin = PINS.some((x) => Math.abs(x - headX) < 10);
      dropletRefs.current.forEach((el, k) => {
        if (!el) return;
        const phase = (time * 3 + k / 4) % 1;
        el.setAttribute("cy", String(244 - phase * 56));
        el.setAttribute("opacity", nearPin && fluxP > 0 && fluxP < 1 ? String(Math.sin(Math.PI * phase)) : "0");
      });

      // Precalentado: panel IR superior
      const heat = easeOut(segment(t, 3.6, 0.6)) * (1 - easeOut(segment(t, 5.6, 0.6)));
      heaterRef.current?.setAttribute("opacity", String(0.15 + heat * 0.85));
      heatWaveRefs.current.forEach((el, k) => {
        if (!el) return;
        const drift = ((time * 22 + k * 12) % 36) - 18;
        el.setAttribute("transform", `translate(0 ${drift})`);
        el.setAttribute("opacity", String(heat * 0.7 * (1 - Math.abs(drift) / 18)));
      });

      // Ola selectiva
      const n = nozzleAt(t);
      const y = lerp(NOZZLE_DOWN, NOZZLE_UP, n.raised);
      nozzleRef.current?.setAttribute("transform", `translate(${n.x} ${y})`);
      const ripple = reducedMotion ? 1 : 1 + Math.sin(time * 11) * 0.08;
      waveRef.current?.setAttribute("transform", `scale(${1 + (ripple - 1) * 0.4} ${ripple})`);
      waveGlowRef.current?.setAttribute("opacity", String(0.35 + n.raised * 0.4));

      const resetFade = 1 - segment(t, 11.6, 0.35);
      PINS.forEach((px, i) => {
        if (n.raised > 0.9 && t >= 6 && n.x >= px - 2 && solderedAt[i] === Infinity) solderedAt[i] = t;
        const s = easeOut(segment(t, solderedAt[i], 0.35));
        const fillet = filletRefs.current[i];
        if (fillet) {
          fillet.setAttribute("transform", `translate(0 ${UNDER}) scale(1 ${s}) translate(0 ${-UNDER})`);
          fillet.setAttribute("opacity", String(s * resetFade));
        }
        const mark = fluxMarkRefs.current[i];
        if (mark) {
          const fluxed = headX >= px ? 1 : 0;
          mark.setAttribute("opacity", String(fluxed * (1 - s) * 0.9 * resetFade));
        }
      });

      const current = PHASES.findIndex((p) => t >= p.start && t < p.end);
      stepRefs.current.forEach((el, i) => {
        if (!el) return;
        el.dataset.state = reducedMotion ? "done" : i === current ? "current" : t >= PHASES[i].end ? "done" : "idle";
      });
    };

    const reset = () => {
      solderedAt.fill(Infinity);
      if (reducedMotion) {
        // Estado final estático: todos los pines soldados
        t = 11.05;
        solderedAt.fill(0);
      } else {
        t = 0;
      }
      draw();
    };

    let raf = 0;
    let running = false;
    let inView = true;
    let last = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      time += dt;
      t += dt;
      if (t >= LOOP) {
        t -= LOOP;
        solderedAt.fill(Infinity);
      }
      draw();
    };
    const sync = () => {
      const should = activeRef.current && inView && !document.hidden && !reducedMotion;
      if (should && !running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else if (!should && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };
    controlRef.current = {
      restart: () => {
        reset();
        sync();
      },
      sync,
    };

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    io.observe(root);
    const onVisibility = () => sync();
    document.addEventListener("visibilitychange", onVisibility);

    reset();
    sync();

    return () => {
      controlRef.current = null;
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reducedMotion]);

  useEffect(() => {
    const wasActive = activeRef.current;
    activeRef.current = active;
    if (active && !wasActive) controlRef.current?.restart();
    else controlRef.current?.sync();
  }, [active]);

  return (
    <div ref={rootRef} className="flex h-full w-full flex-col">
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
        <svg
          viewBox="0 0 560 400"
          className="h-full w-full"
          role="img"
          aria-label="Ilustración del proceso de soldadura por ola selectiva: fluxado, precalentado y soldadura de los pines pasantes con una mini ola de soldadura."
        >
          <defs>
            <linearGradient id="ws-solder" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f4f7fa" />
              <stop offset="0.45" stopColor="#b9c3cc" />
              <stop offset="1" stopColor="#7d8894" />
            </linearGradient>
            <linearGradient id="ws-metal" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#59636e" />
              <stop offset="0.5" stopColor="#a7b0ba" />
              <stop offset="1" stopColor="#4c5560" />
            </linearGradient>
            <linearGradient id="ws-pot" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#3a4452" />
              <stop offset="1" stopColor="#1d242e" />
            </linearGradient>
            <linearGradient id="ws-heat" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ff9a4a" stopOpacity="0.55" />
              <stop offset="1" stopColor="#ff9a4a" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="ws-glow">
              <stop offset="0" stopColor="#ffb066" stopOpacity="0.9" />
              <stop offset="1" stopColor="#ffb066" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Panel IR de precalentado (superior) */}
          <g ref={heaterRef} opacity="0.15">
            <rect x="40" y="18" width="480" height="18" rx="5" fill="#3b2a22" />
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <rect key={i} x={58 + i * 58} y="24" width="40" height="6" rx="3" fill="#ff7a2f" />
            ))}
            <rect x="40" y="36" width="480" height="110" fill="url(#ws-heat)" />
          </g>
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              ref={(el) => {
                heatWaveRefs.current[i] = el;
              }}
              d={`M60 ${82 + i * 12} q20 -6 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0`}
              fill="none"
              stroke="#ffb27a"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0"
            />
          ))}

          {/* Componentes pasantes */}
          <g>
            {/* Conector de 6 pines */}
            <rect x="88" y="112" width="150" height="38" rx="3" fill="#1c1f24" />
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <rect key={i} x={100 + i * 24} y="90" width="6" height="24" rx="1" fill="#d6b44a" />
            ))}
            {/* Capacitor electrolítico */}
            <rect x="282" y="66" width="48" height="84" rx="7" fill="#1b3a6b" />
            <rect x="282" y="66" width="48" height="10" rx="5" fill="#b9c3cc" />
            <rect x="316" y="80" width="8" height="64" rx="3" fill="#8fb3e6" opacity="0.55" />
            {/* Regulador TO-220 */}
            <rect x="386" y="56" width="52" height="44" rx="3" fill="url(#ws-metal)" />
            <circle cx="412" cy="72" r="7" fill="#1b2430" />
            <rect x="382" y="98" width="60" height="52" rx="3" fill="#202328" />
          </g>

          {/* Tablilla */}
          <rect x="40" y={BOARD_Y} width="480" height={BOARD_H} rx="3" fill="#1f6b3a" />
          <rect x="40" y={BOARD_Y} width="480" height="3" rx="1.5" fill="#3f9a5c" />
          {PINS.map((x) => (
            <rect key={`pad-${x}`} x={x - 8} y={UNDER - 1} width="16" height="3" rx="1" fill="#d6b44a" />
          ))}

          {/* Terminales que atraviesan la tablilla */}
          {PINS.map((x) => (
            <rect key={`lead-${x}`} x={x - 2} y={UNDER} width="4" height={LEAD_END - UNDER} rx="1" fill="#c9cfd6" />
          ))}

          {/* Flux depositado */}
          {PINS.map((x, i) => (
            <circle
              key={`flux-${x}`}
              ref={(el) => {
                fluxMarkRefs.current[i] = el;
              }}
              cx={x}
              cy={LEAD_END - 2}
              r="4"
              fill="#9fd3ff"
              opacity="0"
            />
          ))}

          {/* Filetes de soldadura */}
          {PINS.map((x, i) => (
            <path
              key={`fillet-${x}`}
              ref={(el) => {
                filletRefs.current[i] = el;
              }}
              d={`M${x - 9} ${UNDER} Q${x - 2.5} ${UNDER + 4} ${x - 3} ${LEAD_END} L${x + 3} ${LEAD_END} Q${x + 2.5} ${UNDER + 4} ${x + 9} ${UNDER} Z`}
              fill="url(#ws-solder)"
              opacity="0"
            />
          ))}

          {/* Cabezal de flux (drop-jet) */}
          <g ref={fluxHeadRef}>
            {[0, 1, 2, 3].map((k) => (
              <circle
                key={k}
                ref={(el) => {
                  dropletRefs.current[k] = el;
                }}
                cx="0"
                cy="240"
                r="2.6"
                fill="#9fd3ff"
                opacity="0"
              />
            ))}
            <path d="M-6 246 L0 238 L6 246 Z" fill="#c4ccd6" />
            <rect x="-17" y="246" width="34" height="26" rx="4" fill="#8a96a3" />
            <rect x="-4" y="272" width="8" height="40" fill="#5f6a76" />
          </g>

          {/* Crisol de soldadura */}
          <rect x="30" y="330" width="500" height="56" rx="8" fill="url(#ws-pot)" />
          <rect x="38" y="336" width="484" height="6" rx="3" fill="url(#ws-solder)" opacity="0.8" />

          {/* Boquilla con mini ola */}
          <g ref={nozzleRef} transform={`translate(60 ${NOZZLE_DOWN})`}>
            <ellipse ref={waveGlowRef} cx="0" cy="0" rx="34" ry="20" fill="url(#ws-glow)" opacity="0.35" />
            <rect x="-11" y="4" width="22" height="160" fill="url(#ws-metal)" />
            <rect x="-14" y="2" width="28" height="6" rx="2" fill="#6b7480" />
            <rect x="-15" y="6" width="3" height="40" rx="1.5" fill="url(#ws-solder)" opacity="0.75" />
            <rect x="12" y="6" width="3" height="40" rx="1.5" fill="url(#ws-solder)" opacity="0.75" />
            <path ref={waveRef} d="M-15 6 C-14 -6 -6 -10 0 -10 C6 -10 14 -6 15 6 Z" fill="url(#ws-solder)" />
          </g>
        </svg>
      </div>

      <ol className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
        {PHASES.map((p, i) => (
          <li
            key={p.label}
            ref={(el) => {
              stepRefs.current[i] = el;
            }}
            data-state="idle"
            className="flex items-center gap-2 text-white/45 transition-colors duration-300 data-[state=current]:text-white data-[state=done]:text-white/75"
          >
            <span className="grid h-6 w-6 place-items-center rounded-full border border-current text-xs font-semibold">
              {i + 1}
            </span>
            {p.label}
          </li>
        ))}
      </ol>
    </div>
  );
}
