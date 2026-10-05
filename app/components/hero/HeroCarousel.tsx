"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import WaveSolderAnimation from "./WaveSolderAnimation";

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
  const swipeStart = useRef<number | null>(null);

  const paused = hovered || focused;
  const go = useCallback((i: number) => setIndex((i + SLIDES.length) % SLIDES.length), []);

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
      onPointerDown={(e) => {
        if (e.pointerType !== "mouse") swipeStart.current = e.clientX;
      }}
      onPointerUp={(e) => {
        if (swipeStart.current === null) return;
        const dx = e.clientX - swipeStart.current;
        swipeStart.current = null;
        if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
      }}
    >
      <div className="grid">
        {SLIDES.map((s, i) => {
          const active = i === index;
          const Heading = i === 0 ? "h1" : "h2";
          return (
            <div
              key={s.id}
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
                <Heading className="mt-4 max-w-3xl text-4xl font-bold leading-tight text-white md:text-5xl">
                  {s.title}
                </Heading>
                <p className="mt-6 max-w-2xl text-lg text-white/85">{s.text}</p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href={s.primary.href}
                    className="rounded-lg bg-brand px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-light"
                  >
                    {s.primary.label}
                  </Link>
                  <Link
                    href={s.secondary.href}
                    className="rounded-lg border border-white/40 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
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
