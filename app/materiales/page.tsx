import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "../components/Breadcrumbs";
import CTABand from "../components/CTABand";
import { materialDetails } from "@/lib/materials";
import { materials } from "@/lib/site";

export const metadata: Metadata = {
  title: "Reciclaje de Metales en Ciudad Juárez",
  description:
    "Compramos aluminio, cobre, bronce, acero inoxidable, fierro y más. Cotización justa y recolección en tu planta en Cd. Juárez. Cotiza ya.",
  alternates: { canonical: "/materiales" },
};

export default function MaterialesPage() {
  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <Breadcrumbs items={[{ label: "Materiales", href: "/materiales" }]} />
          <h1 className="mt-4 text-4xl font-bold text-ink">
            Materiales que compramos
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            Tu scrap vale. Compramos los materiales reciclables de tu empresa con
            cotización justa, pago confiable y recolección en tu planta.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {materials.map((m) => (
              <span
                key={m}
                className="rounded-full border border-line bg-white px-4 py-2 text-sm text-ink"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {materialDetails.map((m) => (
            <Link
              key={m.slug}
              href={`/materiales/${m.slug}`}
              className="group rounded-2xl border border-line bg-white p-8 transition-colors hover:border-brand"
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

      <CTABand title="Tu scrap vale." text="Cotización justa, pago confiable y recolección en tu planta." />
    </>
  );
}
