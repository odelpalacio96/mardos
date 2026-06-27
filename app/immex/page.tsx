import type { Metadata } from "next";
import Breadcrumbs from "../components/Breadcrumbs";
import CTABand from "../components/CTABand";

export const metadata: Metadata = {
  title: "Reciclaje IMMEX y Comercio Exterior",
  description:
    "Servicio integral para operaciones IMMEX: retorno de material importado temporalmente y disposición certificada. Cd. Juárez.",
  alternates: { canonical: "/immex" },
};

const points = [
  {
    title: "Retorno de material temporal",
    text: "Gestionamos el retorno de materiales importados temporalmente bajo tu programa IMMEX, cumpliendo con la normatividad de comercio exterior.",
  },
  {
    title: "Solución transfronteriza",
    text: "Nuestra filial en Estados Unidos permite operar el flujo de material entre ambos lados de la frontera de forma ordenada.",
  },
  {
    title: "Documentación en regla",
    text: "Certificado de disposición y documentación que respaldan tus auditorías y tu operación de comercio exterior.",
  },
  {
    title: "Confirmación de pesos en 24h",
    text: "Transparencia total con confirmación de pesos y clasificación en un plazo no mayor a 24 horas.",
  },
];

export default function ImmexPage() {
  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-4xl px-5 py-12">
          <Breadcrumbs items={[{ label: "IMMEX", href: "/immex" }]} />
          <h1 className="mt-4 text-4xl font-bold text-ink">
            Soluciones IMMEX y comercio exterior
          </h1>
          <p className="mt-4 text-lg text-muted">
            Servicio integral de reciclaje para operaciones IMMEX: retorno de
            material importado temporalmente y disposición certificada, con la
            documentación que tu operación de comercio exterior requiere.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-14">
        <div className="grid gap-6 sm:grid-cols-2">
          {points.map((p) => (
            <div key={p.title} className="rounded-2xl border border-line bg-white p-8">
              <h2 className="text-xl font-bold text-ink">{p.title}</h2>
              <p className="mt-3 text-muted">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <CTABand />
    </>
  );
}
