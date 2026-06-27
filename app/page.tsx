import type { Metadata } from "next";
import Link from "next/link";
import { site, services, materials } from "@/lib/site";
import CTABand from "./components/CTABand";

export const metadata: Metadata = {
  title: "Recicladora en Ciudad Juárez | MARDOS Reciclados",
  description:
    "Recolección, compra y disposición certificada de materiales reciclables para la industria en Ciudad Juárez. +18 años. Cotiza hoy.",
  alternates: { canonical: "/" },
};

const pillars = [
  {
    title: "Certificado de Destrucción",
    text: "Garantizamos cumplimiento ambiental y protección de tu marca con documentación en regla.",
  },
  {
    title: "Pesos confirmados en 24h",
    text: "Confirmación de pesos y clasificación en un plazo no mayor a 24 horas. Transparencia total.",
  },
  {
    title: "Solución transfronteriza",
    text: "Operaciones IMMEX y filial en Estados Unidos para el retorno de materiales importados temporalmente.",
  },
  {
    title: "Decimos NO al mercado negro",
    text: "Disposición segura, trazable y responsable. Tu material no termina donde no debe.",
  },
];

const steps = [
  { n: 1, text: "Contáctanos o agenda tu recolección." },
  { n: 2, text: "Recolectamos en tu planta con contenedores y transporte propio." },
  { n: 3, text: "Confirmamos pesos y clasificación en 24h." },
  { n: 4, text: "Emitimos certificado y disposición final segura." },
];

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: site.legalName,
  image: `${site.domain}/og.jpg`,
  url: site.domain,
  email: site.email,
  telephone: site.phones,
  address: {
    "@type": "PostalAddress",
    streetAddress: `${site.address.street}, ${site.address.colony}`,
    addressLocality: site.address.city,
    addressRegion: site.address.state,
    addressCountry: site.address.country,
  },
  areaServed: "Ciudad Juárez, Chihuahua",
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      {/* HERO */}
      <section className="relative overflow-hidden bg-navy-dark">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-dark via-navy to-brand-dark opacity-95" />
        <div className="relative mx-auto max-w-6xl px-5 py-24 md:py-32">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-light">
            Recicladora industrial en Ciudad Juárez · +18 años
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight text-white md:text-5xl">
            Tu scrap vale. Tu cumplimiento, también.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/85">
            En MARDOS recolectamos, compramos y damos disposición certificada a
            los materiales reciclables de tu empresa. Soluciones integrales para
            la industria maquiladora y para quien quiere el mejor precio por su
            material.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/cotizacion"
              className="rounded-lg bg-brand px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-light"
            >
              Cotiza tu recolección
            </Link>
            <Link
              href="/materiales"
              className="rounded-lg border border-white/40 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              Vende tu material
            </Link>
          </div>
        </div>
        {/* Tira de confianza */}
        <div className="relative border-t border-white/10 bg-black/20">
          <div className="mx-auto flex max-w-6xl flex-wrap gap-x-6 gap-y-2 px-5 py-4 text-sm text-white/80">
            {[
              "+18 años de experiencia",
              "Operaciones IMMEX",
              "Filial en EE.UU.",
              "Certificado de destrucción",
              "Confirmación de pesos en 24h",
            ].map((t) => (
              <span key={t} className="flex items-center gap-2">
                <span className="text-brand-light">●</span> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* DOS PUERTAS */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:py-20">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col rounded-2xl border border-line bg-surface p-8">
            <span className="text-sm font-semibold uppercase tracking-wide text-navy">
              Para tu maquiladora
            </span>
            <h2 className="mt-3 text-2xl font-bold text-ink">
              ¿Generas residuos industriales?
            </h2>
            <p className="mt-3 flex-1 text-muted">
              Recolección de scrap productivo, secundario y de embalaje, retiro
              de maquinaria obsoleta y disposición de residuos de manejo
              especial. Con certificado de destrucción y cumplimiento ambiental
              que protege tu marca y tus auditorías.
            </p>
            <Link
              href="/servicios"
              className="mt-6 font-semibold text-brand hover:text-brand-dark"
            >
              Ver servicios para empresas →
            </Link>
          </div>

          <div className="flex flex-col rounded-2xl border border-line bg-surface p-8">
            <span className="text-sm font-semibold uppercase tracking-wide text-navy">
              Para vender tu material
            </span>
            <h2 className="mt-3 text-2xl font-bold text-ink">
              ¿Quieres vender tu scrap?
            </h2>
            <p className="mt-3 flex-1 text-muted">
              Compramos metales, cable de cobre, aluminio, bronce, acero
              inoxidable y materiales electrónicos. Cotización justa, pago
              confiable y recolección en tu planta.
            </p>
            <Link
              href="/materiales"
              className="mt-6 font-semibold text-brand hover:text-brand-dark"
            >
              Ver materiales que compramos →
            </Link>
          </div>
        </div>
      </section>

      {/* DIFERENCIADORES */}
      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
          <h2 className="text-center text-3xl font-bold text-ink">
            Qué nos hace diferentes
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="rounded-xl border border-line bg-white p-6"
              >
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-brand/10 font-bold text-brand">
                  ✓
                </div>
                <h3 className="font-semibold text-ink">{p.title}</h3>
                <p className="mt-2 text-sm text-muted">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:py-20">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl font-bold text-ink">Servicios</h2>
          <Link href="/servicios" className="font-semibold text-brand hover:text-brand-dark">
            Ver todos →
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Link
              key={s.slug}
              href={`/servicios/${s.slug}`}
              className="group rounded-xl border border-line bg-white p-6 transition-colors hover:border-brand"
            >
              <h3 className="font-semibold text-ink group-hover:text-brand">
                {s.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{s.short}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* MATERIALES */}
      <section className="bg-navy-dark">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
          <h2 className="text-3xl font-bold text-white">Materiales que compramos</h2>
          <p className="mt-2 text-white/70">
            Y, en general, todos los residuos industriales de tu empresa.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {materials.map((m) => (
              <span
                key={m}
                className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white"
              >
                {m}
              </span>
            ))}
          </div>
          <Link
            href="/materiales"
            className="mt-8 inline-block font-semibold text-brand-light hover:text-white"
          >
            Ver materiales y precios →
          </Link>
        </div>
      </section>

      {/* PROCESO */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:py-20">
        <h2 className="text-center text-3xl font-bold text-ink">
          Cómo trabajamos
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="relative rounded-xl border border-line bg-white p-6">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-brand text-lg font-bold text-white">
                {s.n}
              </div>
              <p className="mt-4 text-sm text-muted">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* EXPERIENCIA / NÚMEROS */}
      <section className="bg-surface">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 text-center sm:grid-cols-3">
          {[
            { big: "+18", small: "años de experiencia" },
            { big: "IMMEX", small: "operaciones de comercio exterior" },
            { big: "EE.UU.", small: "filial para soluciones transfronterizas" },
          ].map((n) => (
            <div key={n.small}>
              <div className="text-4xl font-bold text-brand">{n.big}</div>
              <div className="mt-2 text-muted">{n.small}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MISIÓN */}
      <section className="mx-auto max-w-3xl px-5 py-16 text-center md:py-20">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-brand">
          Nuestra misión
        </h2>
        <p className="mt-4 text-xl leading-relaxed text-ink md:text-2xl">
          “Ser una empresa que proyecte el reciclaje y consciente de la
          responsabilidad social, con un bien común enfocado al cuidado del
          medio ambiente, generando un ciclo económico con beneficio para
          nuestros clientes, la empresa y la sociedad.”
        </p>
      </section>

      <CTABand />
    </>
  );
}
