import Link from "next/link";
import { site, nav, services } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-navy-dark text-white/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-brand font-bold text-white">
              M
            </span>
            <span className="text-lg font-bold text-white">MARDOS</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed">
            Recicladora industrial en Ciudad Juárez. +18 años dando disposición
            certificada y comprando material reciclable.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Navegación</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-brand-light">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Servicios</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/servicios/${s.slug}`} className="hover:text-brand-light">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Contacto</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>{site.address.full}</li>
            {site.phones.map((p) => (
              <li key={p}>
                <a href={`tel:${p.replace(/\s/g, "")}`} className="hover:text-brand-light">
                  {p}
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-brand-light">
                {site.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-5 py-5 text-xs text-white/60">
          © {new Date().getFullYear()} {site.legalName}
        </p>
      </div>
    </footer>
  );
}
