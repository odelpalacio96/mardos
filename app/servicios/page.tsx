import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "../components/Breadcrumbs";
import CTABand from "../components/CTABand";
import { IconArrowRight } from "../components/icons";
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
              className="group flex flex-col rounded-2xl border border-line bg-card p-8 transition-[border-color,scale] duration-150 hover:border-brand active:scale-[0.99]"
            >
              <h2 className="text-xl font-bold text-ink group-hover:text-brand">
                {s.title}
              </h2>
              <p className="mt-3 text-muted">{s.intro}</p>
              {/* Pie de la tarjeta: enlace a la izquierda, ilustración a la derecha. */}
              <div className="mt-auto flex items-end justify-between gap-6 pt-6">
                <span className="inline-flex items-center gap-2 font-semibold text-brand">
                  Ver detalle
                  <IconArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
                <Image
                  src={s.icon.src}
                  alt=""
                  width={s.icon.width}
                  height={s.icon.height}
                  sizes="120px"
                  className="h-20 w-auto max-w-[45%] object-contain transition-transform duration-300 ease-out group-hover:-translate-y-0.5 sm:h-24"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <CTABand />
    </>
  );
}
