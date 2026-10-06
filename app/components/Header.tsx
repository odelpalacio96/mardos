"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/lib/site";
import { btn } from "@/lib/ui";

function isCurrent(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Cierra el menú al cambiar de página.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  // La separación del header aparece solo cuando hay contenido pasando por debajo.
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 4));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Menú móvil: Escape lo cierra y el fondo no se desplaza mientras está abierto.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header
      data-scrolled={scrolled || open}
      className="site-header sticky top-0 z-50 border-b border-transparent transition-[border-color,box-shadow] duration-200 data-[scrolled=true]:border-line data-[scrolled=true]:shadow-[0_1px_12px_rgba(0,0,0,0.04)]"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2" aria-label="MARDOS Reciclados, inicio">
          <Image
            src="/logo-mardos.png"
            alt=""
            width={640}
            height={408}
            priority
            className="h-12 w-auto dark:hidden"
          />
          <Image
            src="/logo-mardos-dark.png"
            alt=""
            width={640}
            height={408}
            priority
            className="hidden h-12 w-auto dark:block"
          />
          <span className="text-lg font-medium tracking-tight text-muted">Reciclados</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
          {nav.map((item) => {
            const current = isCurrent(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current ? "page" : undefined}
                className="relative rounded-md px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-ink aria-[current=page]:text-ink"
              >
                {item.label}
                {current && (
                  <span className="absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-brand" aria-hidden="true" />
                )}
              </Link>
            );
          })}
          <Link href="/cotizacion" className={`ml-3 ${btn.primary("sm")}`}>
            Cotiza tu recolección
          </Link>
        </nav>

        <button
          type="button"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="menu-movil"
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-lg border border-line text-ink transition-[scale] duration-100 active:scale-[0.94] md:hidden"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path
              d={open ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"}
            />
          </svg>
        </button>
      </div>

      {/* Menú móvil: se despliega desde el header (mismo camino al cerrar). */}
      <div
        id="menu-movil"
        data-open={open}
        inert={!open}
        className="mobile-menu absolute inset-x-0 top-full border-b border-line md:hidden"
      >
        <nav className="mx-auto max-w-6xl px-5 pb-5 pt-2" aria-label="Principal">
          <ul>
            {nav.map((item) => {
              const current = isCurrent(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between border-b border-line py-3.5 text-base font-medium text-ink aria-[current=page]:text-brand"
                  >
                    {item.label}
                    <span aria-hidden="true" className="text-muted">›</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            href="/cotizacion"
            onClick={() => setOpen(false)}
            className={`mt-5 w-full ${btn.primary()}`}
          >
            Cotiza tu recolección
          </Link>
        </nav>
      </div>
      <div
        data-open={open}
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className="mobile-menu-scrim fixed inset-x-0 bottom-0 top-16 -z-10 bg-black/30 md:hidden"
      />
    </header>
  );
}
