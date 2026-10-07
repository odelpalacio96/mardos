"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Breadcrumbs from "./Breadcrumbs";
import { IconArrowRight } from "./icons";
import { generalBackground, materialBackgrounds } from "@/lib/materialBackgrounds";

// Encabezado de Materiales: el fondo cambia según el material que se señala.
// Computadora: al pasar el mouse o recorrer con teclado. Celular: primer toque
// muestra el material, segundo toque (o "Ver más") abre su página.

const HOVER_INTENT_MS = 70; // evita saltos al cruzar varias pastillas
const LEAVE_DELAY_MS = 180;

const uniqueImages = Array.from(
  new Map(
    [generalBackground, ...materialBackgrounds].map((m) => [m.image, m.alt]),
  ).entries(),
);

export default function MaterialesHero() {
  const [active, setActive] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerType = useRef<string>("mouse");

  // Las demás fotos se descargan después de la principal, en segundo plano.
  useEffect(() => {
    const start = () => setReady(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(start, 1200);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const schedule = (fn: () => void, ms: number) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(fn, ms);
  };

  const current = active === null ? null : materialBackgrounds[active];
  const visibleImage = current ? current.image : generalBackground.image;

  return (
    <section className="on-dark relative isolate overflow-hidden bg-navy-dark">
      {/* Fotos apiladas: solo cambia la opacidad (fundido cruzado). */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        {uniqueImages.map(([src], i) => {
          const isGeneral = src === generalBackground.image;
          if (!isGeneral && !ready) return null;
          return (
            <Image
              key={src}
              src={src}
              alt=""
              fill
              sizes="100vw"
              priority={isGeneral}
              fetchPriority={isGeneral ? "high" : "low"}
              loading={isGeneral ? undefined : "eager"}
              data-visible={src === visibleImage}
              className="material-bg object-cover"
              style={{ zIndex: i }}
            />
          );
        })}
        {/* Velo para que el texto se lea sobre cualquier foto. */}
        <div className="absolute inset-0 z-20 bg-[rgba(8,14,11,0.62)] md:bg-[linear-gradient(90deg,rgba(8,14,11,0.9)_0%,rgba(8,14,11,0.72)_34%,rgba(8,14,11,0.22)_62%,rgba(8,14,11,0)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 z-20 h-28 bg-gradient-to-t from-[rgba(8,14,11,0.4)] to-transparent" />
      </div>

      <div className="mx-auto flex min-h-[540px] max-w-6xl flex-col justify-center px-5 py-14 md:min-h-[580px] md:py-20">
        <Breadcrumbs tone="light" items={[{ label: "Materiales", href: "/materiales" }]} />
        <h1 className="mt-5 max-w-2xl text-4xl font-bold text-white md:text-5xl">
          Materiales que compramos
        </h1>
        <p className="mt-4 max-w-xl text-lg text-white/80">
          Tu scrap vale. Compramos los materiales reciclables de tu empresa con cotización justa,
          pago confiable y recolección en tu planta.
        </p>

        <ul
          className="-mx-5 mt-8 flex snap-x scroll-px-5 gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden"
          onPointerLeave={(e) => {
            if (e.pointerType === "mouse") schedule(() => setActive(null), LEAVE_DELAY_MS);
          }}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setActive(null);
          }}
        >
          {materialBackgrounds.map((m, i) => {
            const isActive = active === i;
            return (
              <li key={m.name} className="shrink-0 snap-start">
                <Link
                  href={m.href}
                  data-active={isActive}
                  aria-label={`${m.name}: ver detalles`}
                  onPointerDown={(e) => (pointerType.current = e.pointerType)}
                  onPointerEnter={(e) => {
                    if (e.pointerType === "mouse") schedule(() => setActive(i), HOVER_INTENT_MS);
                  }}
                  onFocus={() => {
                    if (timer.current) clearTimeout(timer.current);
                    setActive(i);
                  }}
                  onClick={(e) => {
                    // En pantallas táctiles el primer toque solo muestra el material.
                    if (pointerType.current !== "mouse" && !isActive) {
                      e.preventDefault();
                      setActive(i);
                    }
                  }}
                  className="block select-none rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium whitespace-nowrap text-white backdrop-blur-md transition-[background-color,border-color,color,scale] duration-150 ease-out hover:bg-white/20 active:scale-[0.97] data-[active=true]:border-white data-[active=true]:bg-white data-[active=true]:text-[#1a1f1d]"
                >
                  {m.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Acceso al material elegido (útil sobre todo en celular). Altura fija: sin saltos. */}
        <div className="mt-5 h-6">
          {current && (
            <Link
              href={current.href}
              key={current.name}
              className="material-cta inline-flex items-center gap-2 text-sm font-semibold text-brand-light transition-colors hover:text-white"
            >
              Ver más sobre {current.name.toLowerCase()}
              <IconArrowRight />
            </Link>
          )}
        </div>
      </div>

      {/* Nombre de lo que se ve en la foto. */}
      <p
        className="absolute bottom-5 right-5 hidden items-center gap-2 rounded-full bg-black/45 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-md md:flex"
        aria-hidden="true"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-brand-light" />
        {current && current.image !== generalBackground.image ? current.name : "Vista general"}
      </p>

      <span className="sr-only" aria-live="polite">
        {current ? `Mostrando: ${current.alt}` : ""}
      </span>
    </section>
  );
}
