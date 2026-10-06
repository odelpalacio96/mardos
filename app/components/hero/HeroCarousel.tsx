"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import WaveSolderAnimation from "./WaveSolderAnimation";
import { btn } from "@/lib/ui";

const ChipScene = dynamic(() => import("./ChipScene"), { ssr: false });

type Slide = {
  id: string;
  duration: number; // ms
  label: string;
  eyebrow: string;
  title: ReactNode;
  text: string;
  primary: { href: string; label: string };
  secondary: { href: string; label: string };
  visual: (props: { active: boolean; reducedMotion: boolean }) => ReactNode;
};

const SLIDES: Slide[] = [
  {
    id: "chip",
    duration: 10000,
    label: "Reciclaje industrial",
    eyebrow: "Recicladora industrial en Ciudad Juárez · +18 años",
    title: "Tu scrap vale. Tu cumplimiento, también.",
    text: "En MARDOS recolectamos, compramos y damos disposición certificada a los materiales reciclables de tu empresa. Soluciones integrales para la industria maquiladora y para quien quiere el mejor precio por su material.",
    primary: { href: "/cotizacion", label: "Cotiza tu recolección" },
    secondary: { href: "/materiales", label: "Vende tu material" },
    visual: (p) => <ChipScene {...p} />,
  },
  {
    id: "ola",
    duration: 12600,
    label: "Escorias de soldadura",
    eyebrow: "Escorias de soldadura · Industria electrónica",
    title: "Del proceso de soldadura, a su reciclaje responsable.",
    text: "Damos disposición final segura y trazable a las escorias de soldadura libres de plomo que genera tu línea, y te ayudamos con la gestión para la disposición final y el reciclaje de las escorias con plomo, consideradas peligrosas.",
    primary: { href: "/servicios/escorias-soldadura", label: "Conoce el servicio" },
    secondary: { href: "/cotizacion", label: "Cotiza tu recolección" },
    visual: (p) => <WaveSolderAnimation {...p} />,
  },
];

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const reducedMotion = useReducedMotion();
  const [dragging, setDragging] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const drag = useRef<{
    id: number;
    x0: number;
    y0: number;
    dx: number;
    axis: "x" | "y" | null;
    samples: { x: number; t: number }[];
    moved: boolean;
  } | null>(null);

  const paused = hovered || focused || dragging;
  const go = useCallback((i: number) => setIndex((i + SLIDES.length) % SLIDES.length), []);

  // Cambia de diapositiva saliendo hacia el lado del gesto y entrando por el opuesto.
  const commit = (dir: 1 | -1) => {
    if (reducedMotion) {
      go(index + dir);
      return;
    }
    const from = slideRefs.current[index];
    const to = slideRefs.current[(index + dir + SLIDES.length) % SLIDES.length];
    if (from) {
      from.style.transition = "";
      from.style.transform = `translateX(${dir * -24}%)`;
      from.style.opacity = "0";
      setTimeout(() => {
        from.style.transform = "";
        from.style.opacity = "";
      }, 720);
    }
    if (to) {
      to.style.transition = "none";
      to.style.transform = `translateX(${dir * 24}%)`;
      void to.offsetWidth; // fija la posición inicial antes de animar
      to.style.transition = "";
      to.style.transform = "";
    }
    go(index + dir);
  };

  // Manipulación directa en pantallas táctiles: la diapositiva sigue al dedo 1:1
  // y, al soltar, se proyecta la inercia para decidir si cambia.
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") return;
    drag.current = { id: e.pointerId, x0: e.clientX, y0: e.clientY, dx: 0, axis: null, samples: [{ x: e.clientX, t: e.timeStamp }], moved: false };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x0;
    const dy = e.clientY - d.y0;
    if (!d.axis) {
      if (Math.hypot(dx, dy) < 10) return; // histéresis antes de decidir dirección
      d.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (d.axis === "y") {
        drag.current = null; // es scroll vertical: se lo dejamos al navegador
        return;
      }
      try {
        stageRef.current?.setPointerCapture(e.pointerId);
      } catch {
        // Algunos navegadores no permiten capturar este puntero; el arrastre sigue igual.
      }
      setDragging(true);
    }
    d.dx = dx;
    d.moved = true;
    d.samples.push({ x: e.clientX, t: e.timeStamp });
    if (d.samples.length > 6) d.samples.shift();
    if (reducedMotion) return;
    const el = slideRefs.current[index];
    const w = stageRef.current?.clientWidth || 1;
    if (el) {
      el.style.transition = "none";
      el.style.transform = `translateX(${dx}px)`;
      el.style.opacity = String(1 - Math.min(Math.abs(dx) / w, 1) * 0.6);
    }
  };

  const onPointerEnd = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    setDragging(false);
    if (d.axis !== "x") return;
    const first = d.samples[0];
    const last = d.samples[d.samples.length - 1];
    // Si el dedo se detuvo antes de soltar, no hay inercia.
    const stale = e.timeStamp - last.t > 100;
    const v = stale ? 0 : ((last.x - first.x) / Math.max(last.t - first.t, 1)) * 1000; // px/s
    const decel = 0.998;
    const projected = d.dx + ((v / 1000) * decel) / (1 - decel);
    const w = stageRef.current?.clientWidth || 1;
    if (Math.abs(projected) > w * 0.3) {
      commit(projected < 0 ? 1 : -1);
    } else {
      const el = slideRefs.current[index];
      if (el) {
        el.style.transition = "transform 320ms var(--ease-ui-out), opacity 320ms var(--ease-ui-out)";
        el.style.transform = "";
        el.style.opacity = "";
        setTimeout(() => (el.style.transition = ""), 340);
      }
    }
    if (d.moved) {
      // Evita que soltar sobre un botón active el enlace.
      const block = (ev: MouseEvent) => {
        ev.preventDefault();
        ev.stopPropagation();
      };
      window.addEventListener("click", block, { capture: true, once: true });
      setTimeout(() => window.removeEventListener("click", block, { capture: true }), 50);
    }
  };

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carrusel"
      aria-label="Destacados de MARDOS"
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
      }}
    >
      <div
        ref={stageRef}
        className="grid touch-pan-y"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
      >
        {SLIDES.map((s, i) => {
          const active = i === index;
          const Heading = i === 0 ? "h1" : "h2";
          return (
            <div
              key={s.id}
              ref={(el) => {
                slideRefs.current[i] = el;
              }}
              role="group"
              aria-roledescription="diapositiva"
              aria-label={`${i + 1} de ${SLIDES.length}: ${s.label}`}
              aria-hidden={!active}
              inert={!active}
              data-active={active}
              className="hero-slide col-start-1 row-start-1 grid items-center gap-10 md:grid-cols-[1.05fr_1fr]"
            >
              <div className="hero-slide-copy">
                <p className="text-sm font-semibold uppercase tracking-wide text-brand-light">
                  {s.eyebrow}
                </p>
                <Heading className="mt-4 max-w-3xl text-4xl font-bold text-white md:text-5xl">
                  {s.title}
                </Heading>
                <p className="mt-6 max-w-2xl text-lg text-white/85">{s.text}</p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href={s.primary.href}
                    className={btn.primary()}
                  >
                    {s.primary.label}
                  </Link>
                  <Link
                    href={s.secondary.href}
                    className={btn.outlineLight()}
                  >
                    {s.secondary.label}
                  </Link>
                </div>
              </div>
              <div className="hero-slide-visual h-[280px] sm:h-[360px] md:h-[440px]">
                {s.visual({ active, reducedMotion })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 flex items-center gap-1" role="group" aria-label="Elegir diapositiva">
        {SLIDES.map((s, i) => {
          const active = i === index;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => go(i)}
              aria-label={`Ir a la diapositiva ${i + 1}: ${s.label}`}
              aria-current={active}
              className="group grid h-8 w-12 place-items-center"
            >
              <span
                className={`relative block h-1.5 w-10 overflow-hidden rounded-full transition-colors duration-200 ${
                  active ? "bg-white/25" : "bg-white/20 group-hover:bg-white/40"
                }`}
              >
                {active && !reducedMotion && (
                  <span
                    key={index}
                    className="hero-progress absolute inset-0 origin-left rounded-full bg-brand-light"
                    style={{
                      animationDuration: `${s.duration}ms`,
                      animationPlayState: paused ? "paused" : "running",
                    }}
                    onAnimationEnd={() => go(index + 1)}
                  />
                )}
                {active && reducedMotion && (
                  <span className="absolute inset-0 rounded-full bg-brand-light" />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
