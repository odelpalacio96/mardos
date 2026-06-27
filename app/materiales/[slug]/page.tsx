import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "../../components/Breadcrumbs";
import CTABand from "../../components/CTABand";
import { materialDetails, getMaterial } from "@/lib/materials";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return materialDetails.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const m = getMaterial(slug);
  if (!m) return {};
  return {
    title: m.metaTitle,
    description: m.metaDescription,
    alternates: { canonical: `/materiales/${m.slug}` },
  };
}

const sellSteps = [
  { n: 1, text: "Cotización: nos compartes tu material y te damos un precio justo." },
  { n: 2, text: "Recolección en tu planta con contenedores y transporte propio." },
  { n: 3, text: "Pesaje y clasificación confirmados en 24h." },
  { n: 4, text: "Pago confiable por tu material." },
];

export default async function MaterialPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const m = getMaterial(slug);
  if (!m) notFound();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: m.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-4xl px-5 py-12">
          <Breadcrumbs
            items={[
              { label: "Materiales", href: "/materiales" },
              { label: m.title, href: `/materiales/${m.slug}` },
            ]}
          />
          <h1 className="mt-4 text-4xl font-bold text-ink">{m.h1}</h1>
          <p className="mt-4 text-lg text-muted">{m.intro}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/cotizacion"
              className="rounded-lg bg-brand px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              Cotiza tu material
            </Link>
            <a
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-line px-6 py-3 font-semibold text-ink transition-colors hover:border-brand"
            >
              WhatsApp directo
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-14">
        <h2 className="text-2xl font-bold text-ink">Qué compramos</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {m.items.map((i) => (
            <div
              key={i}
              className="rounded-xl border border-line bg-white px-5 py-4 font-medium text-ink"
            >
              {i}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface">
        <div className="mx-auto max-w-4xl px-5 py-14">
          <h2 className="text-2xl font-bold text-ink">Cómo funciona la venta</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {sellSteps.map((s) => (
              <div key={s.n} className="rounded-xl border border-line bg-white p-6">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-brand font-bold text-white">
                  {s.n}
                </div>
                <p className="mt-4 text-sm text-muted">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-14">
        <h2 className="text-2xl font-bold text-ink">Preguntas frecuentes</h2>
        <div className="mt-6 divide-y divide-line border-y border-line">
          {m.faqs.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="cursor-pointer list-none font-semibold text-ink marker:hidden">
                {f.q}
              </summary>
              <p className="mt-2 text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <CTABand title="Tu scrap vale." text="Cotización justa, pago confiable y recolección en tu planta." />
    </>
  );
}
