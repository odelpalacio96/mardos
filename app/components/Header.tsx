"use client";

import Link from "next/link";
import { useState } from "react";
import { nav } from "@/lib/site";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 place-items-center rounded-md bg-brand font-bold text-white">
            M
          </span>
          <span className="text-lg font-bold tracking-tight text-navy">
            MARDOS <span className="font-medium text-muted">Reciclados</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted transition-colors hover:text-brand"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/cotizacion"
            className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Cotiza tu recolección
          </Link>
        </nav>

        <button
          type="button"
          aria-label="Abrir menú"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-line md:hidden"
        >
          <span className="text-xl leading-none">{open ? "✕" : "☰"}</span>
        </button>
      </div>

      {open && (
        <nav className="border-t border-line bg-white md:hidden">
          <ul className="mx-auto max-w-6xl px-5 py-3">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-2.5 text-base font-medium text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="/cotizacion"
                onClick={() => setOpen(false)}
                className="block rounded-lg bg-brand px-4 py-3 text-center font-semibold text-white"
              >
                Cotiza tu recolección
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
