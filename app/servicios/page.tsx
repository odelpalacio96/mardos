import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "../components/Breadcrumbs";
import CTABand from "../components/CTABand";
import { serviceDetails } from "@/lib/services";

export const metadata: Metadata = {
  title: "Servicios de Reciclaje Industrial",
  description:
    "Recolección de scrap, destrucción de archivo muerto, retiro de maquinaria obsoleta y más. Soluciones integrales para tu empresa en Cd. Juárez.",
  alternates: { canonical: "/servicios" },
};

export default function ServiciosPage() {
  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <Breadcrumbs items={[{ label: "Servicios", href: "/servicios" }]} />
          <h1 className="mt-4 text-4xl font-bold text-ink">
            Servicios de reciclaje industrial
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            Soluciones integrales para la industria maquiladora: recolectamos,
            compramos y damos disposición certificada a tus materiales, con la
            documentación que tu operación y tus auditorías requieren.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {serviceDetails.map((s) => (
            <Link
              key={s.slug}
              href={`/servicios/${s.slug}`}
              className="group rounded-2xl border border-line bg-white p-8 transition-colors hover:border-brand"
            >
              <h2 className="text-xl font-bold text-ink group-hover:text-brand">
                {s.title}
              </h2>
              <p className="mt-3 text-muted">{s.intro}</p>
              <span className="mt-5 inline-block font-semibold text-brand">
                Ver detalle →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <CTABand />
    </>
  );
}
