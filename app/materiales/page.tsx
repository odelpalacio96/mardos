import type { Metadata } from "next";
import Link from "next/link";
import CTABand from "../components/CTABand";
import MaterialesHero from "../components/MaterialesHero";
import MaterialShowcase from "../components/MaterialShowcase";
import { materialDetails } from "@/lib/materials";
import { solderShowcase } from "@/lib/showcase";

export const metadata: Metadata = {
  title: "Reciclaje de Metales en Ciudad Juárez",
  description:
    "Compramos aluminio, cobre, bronce, acero inoxidable, fierro y más. Cotización justa y recolección en tu planta en Cd. Juárez. Cotiza ya.",
  alternates: { canonical: "/materiales" },
};

export default function MaterialesPage() {
  return (
    <>
      <MaterialesHero />

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {materialDetails.map((m) => (
            <Link
              key={m.slug}
              href={`/materiales/${m.slug}`}
              className="group rounded-2xl border border-line bg-card p-8 transition-colors hover:border-brand"
            >
              <h2 className="text-xl font-bold text-ink group-hover:text-brand">
                {m.title}
              </h2>
              <p className="mt-3 text-muted">{m.intro}</p>
              <span className="mt-5 inline-block font-semibold text-brand">
                Ver detalle →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="text-3xl font-bold text-ink">Soldadura y componentes</h2>
          <p className="mt-3 max-w-2xl text-muted">
            También compramos los materiales de soldadura y componentes que genera la
            industria electrónica.
          </p>
          <div className="mt-8">
            <MaterialShowcase items={solderShowcase} />
          </div>
        </div>
      </section>

      <CTABand title="Tu scrap vale." text="Cotización justa, pago confiable y recolección en tu planta." />
    </>
  );
}
