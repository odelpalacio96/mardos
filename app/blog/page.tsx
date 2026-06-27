import type { Metadata } from "next";
import Breadcrumbs from "../components/Breadcrumbs";
import CTABand from "../components/CTABand";

export const metadata: Metadata = {
  title: "Blog de Reciclaje Industrial",
  description:
    "Guías y mejores prácticas sobre reciclaje industrial, manejo de scrap, cumplimiento ambiental e IMMEX para empresas en Cd. Juárez.",
  alternates: { canonical: "/blog" },
};

const upcoming = [
  { title: "¿Qué es el scrap productivo, secundario y de embalaje? Guía para maquiladoras", cat: "Para Maquiladoras" },
  { title: "Cómo vender la chatarra de tu empresa en Ciudad Juárez (y obtener buen precio)", cat: "Vender Material" },
  { title: "Certificado de destrucción de documentos: qué es y por qué tu empresa lo necesita", cat: "Cumplimiento" },
  { title: "Disposición de residuos de manejo especial: obligaciones de la industria maquiladora", cat: "Cumplimiento" },
  { title: "Reciclaje de cobre y cable de cobre: cómo se valúa y se paga", cat: "Vender Material" },
  { title: "IMMEX y reciclaje: qué hacer con el material importado temporalmente", cat: "Para Maquiladoras" },
  { title: "Escorias de soldadura libres de plomo: disposición final segura", cat: "Cumplimiento" },
  { title: "Aluminio, bronce, acero inoxidable: guía de metales reciclables y su valor", cat: "Guías" },
];

export default function BlogPage() {
  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <Breadcrumbs items={[{ label: "Blog", href: "/blog" }]} />
          <h1 className="mt-4 text-4xl font-bold text-ink">Blog de reciclaje industrial</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            Guías y mejores prácticas sobre manejo de scrap, cumplimiento
            ambiental, IMMEX y venta de material para la industria.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((a) => (
            <div key={a.title} className="rounded-2xl border border-line bg-white p-7">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand-dark">
                  {a.cat}
                </span>
                <span className="text-xs text-muted">Próximamente</span>
              </div>
              <h2 className="mt-4 text-lg font-semibold text-ink">{a.title}</h2>
            </div>
          ))}
        </div>
      </section>

      <CTABand />
    </>
  );
}
