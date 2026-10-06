import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site, services, materials } from "@/lib/site";
import { componentReel, solderBar, solderWire } from "@/lib/showcase";
import { textLink } from "@/lib/ui";
import CTABand from "./components/CTABand";
import {
  IconArrowRight,
  IconCertificate,
  IconCoins,
  IconFactory,
  IconScale,
  IconTruck,
} from "./components/icons";
import HeroCarousel from "./components/hero/HeroCarousel";

export const metadata: Metadata = {
  title: "Recicladora en Ciudad Juárez | MARDOS Reciclados",
  description:
    "Recolección, compra y disposición certificada de materiales reciclables para la industria en Ciudad Juárez. +18 años. Cotiza hoy.",
  alternates: { canonical: "/" },
};

const pillars = [
  {
    Icon: IconCertificate,
    title: "Certificado de destrucción",
    text: "Cumplimiento ambiental y protección de tu marca, con documentación en regla.",
  },
  {
    Icon: IconScale,
    title: "Transparencia en pesos",
    text: "Pesos y clasificación confirmados contigo, sin sorpresas en la liquidación.",
  },
  {
    Icon: IconTruck,
    title: "Solución transfronteriza",
    text: "Gestión en comercio exterior con filial en Estados Unidos para el retorno de materiales importados temporalmente.",
  },
];

const steps = [
  { n: 1, title: "Contacto", text: "Nos escribes o agendas tu recolección." },
  { n: 2, title: "Recolección", text: "Vamos a tu planta con contenedores y transporte propio." },
  { n: 3, title: "Pesaje", text: "Confirmamos pesos y clasificación en 24 horas." },
  { n: 4, title: "Certificado", text: "Emitimos certificado y damos disposición final segura." },
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
      <section className="on-dark relative overflow-hidden bg-navy-dark">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-dark via-navy to-brand-dark opacity-95" />
        <div className="relative mx-auto max-w-6xl px-5 pb-10 pt-14 md:pb-12 md:pt-16">
          <HeroCarousel />
        </div>
        {/* Tira de confianza */}
        <div className="relative border-t border-white/10 bg-black/20">
          <div className="mx-auto flex max-w-6xl flex-wrap gap-x-6 gap-y-2 px-5 py-4 text-sm text-white/80">
            {[
              "+18 años de experiencia",
              "Gestión en comercio exterior",
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

      {/* DOS PUERTAS: la decisión principal del visitante */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <div className="grid gap-5 md:grid-cols-2">
          <Link
            href="/servicios"
            className="group on-dark relative flex flex-col overflow-hidden rounded-3xl bg-navy-dark p-8 text-white transition-[scale] duration-100 active:scale-[0.99] md:p-10"
          >
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-light/10 blur-2xl" aria-hidden="true" />
            <IconFactory className="h-9 w-9 text-brand-light" />
            <span className="mt-6 text-sm font-semibold uppercase tracking-wide text-brand-light">
              Para tu maquiladora
            </span>
            <h2 className="mt-2 text-3xl font-bold">¿Generas residuos industriales?</h2>
            <p className="mt-4 flex-1 text-white/75">
              Recolección de scrap productivo, secundario y de embalaje, retiro de maquinaria
              obsoleta y disposición de residuos de manejo especial, con certificado de destrucción.
            </p>
            <span className="mt-8 inline-flex items-center gap-2 font-semibold text-white">
              Ver servicios para empresas
              <IconArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          </Link>

          <Link
            href="/materiales"
            className="group relative flex flex-col overflow-hidden rounded-3xl bg-surface p-8 ring-1 ring-line transition-[scale] duration-100 active:scale-[0.99] md:p-10"
          >
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand/10 blur-2xl" aria-hidden="true" />
            <IconCoins className="h-9 w-9 text-brand" />
            <span className="mt-6 text-sm font-semibold uppercase tracking-wide text-brand">
              Para vender tu material
            </span>
            <h2 className="mt-2 text-3xl font-bold text-ink">¿Quieres vender tu scrap?</h2>
            <p className="mt-4 flex-1 text-muted">
              Compramos metales, cable de cobre, aluminio, bronce, acero inoxidable y materiales
              electrónicos. Cotización justa, pago confiable y recolección en tu planta.
            </p>
            <span className="mt-8 inline-flex items-center gap-2 font-semibold text-brand">
              Ver materiales que compramos
              <IconArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </section>

      {/* POR QUÉ MARDOS */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand">Por qué MARDOS</p>
            <h2 className="mt-3 text-3xl font-bold text-ink md:text-4xl">
              Más de 18 años reciclando para la industria de Ciudad Juárez.
            </h2>
          </div>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {pillars.map(({ Icon, title, text }) => (
              <div key={title}>
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand/10 text-brand">
                  <Icon />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl font-bold text-ink md:text-4xl">Servicios</h2>
          <Link href="/servicios" className={textLink}>
            Ver todos <IconArrowRight />
          </Link>
        </div>
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Link
              key={s.slug}
              href={`/servicios/${s.slug}`}
              className="group flex flex-col bg-card p-6 transition-colors hover:bg-surface"
            >
              <h3 className="font-semibold text-ink">{s.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted">{s.short}</p>
              <IconArrowRight className="mt-4 h-4 w-4 text-brand transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </section>

      {/* MATERIALES */}
      <section className="on-dark overflow-hidden bg-navy-dark">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-[1.25fr_1fr] md:py-20">
          <div>
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
              className="group mt-8 inline-flex items-center gap-2 font-semibold text-brand-light transition-colors hover:text-white"
            >
              Ver materiales y precios
              <IconArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Material real flotando (decorativo) */}
          <div className="relative hidden h-[340px] md:block" aria-hidden="true">
            <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(closest-side,rgba(111,191,79,0.18),transparent)]" />
            <div className="float-soft absolute left-[24%] top-[2%] w-[54%]">
              <Image src={componentReel.src} alt="" width={componentReel.width} height={componentReel.height} sizes="260px" className="drop-shadow-[0_24px_30px_rgba(0,0,0,0.45)]" />
            </div>
            <div className="float-soft absolute right-[2%] top-[2%] h-[86%] [animation-delay:-2.4s]">
              <Image src={solderBar.src} alt="" width={solderBar.width} height={solderBar.height} sizes="100px" className="h-full w-auto rotate-[10deg] drop-shadow-[0_24px_30px_rgba(0,0,0,0.45)]" />
            </div>
            <div className="float-soft absolute -bottom-[2%] left-0 w-[30%] [animation-delay:-4.8s]">
              <Image src={solderWire.src} alt="" width={solderWire.width} height={solderWire.height} sizes="160px" className="drop-shadow-[0_24px_30px_rgba(0,0,0,0.45)]" />
            </div>
          </div>
        </div>
      </section>

      {/* PROCESO */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <h2 className="text-3xl font-bold text-ink md:text-4xl">Cómo trabajamos</h2>
        <ol className="relative mt-12 grid gap-10 md:grid-cols-4 md:gap-6">
          <div className="absolute left-5 right-5 top-5 hidden h-px bg-line md:block" aria-hidden="true" />
          {steps.map((s) => (
            <li key={s.n} className="relative">
              <div className="relative grid h-10 w-10 place-items-center rounded-full bg-brand-solid font-semibold text-white ring-8 ring-page">
                {s.n}
              </div>
              <h3 className="mt-5 font-semibold text-ink">{s.title}</h3>
              <p className="mt-1 text-sm text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <CTABand />
    </>
  );
}
