import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "../../components/Breadcrumbs";
import CTABand from "../../components/CTABand";
import ProcessVideo from "../../components/ProcessVideo";
import { serviceDetails, getService } from "@/lib/services";
import { site } from "@/lib/site";
import { btn } from "@/lib/ui";

export function generateStaticParams() {
  return serviceDetails.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return {
    title: s.metaTitle,
    description: s.metaDescription,
    alternates: { canonical: `/servicios/${s.slug}` },
  };
}

export default async function ServicioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title,
    serviceType: s.title,
    provider: { "@type": "Organization", name: site.legalName, url: site.domain },
    areaServed: "Ciudad Juárez, Chihuahua",
    description: s.metaDescription,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: s.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="border-b border-line bg-surface">
        <div
          className={
            s.video
              ? "mx-auto grid max-w-6xl items-center gap-10 px-5 py-12 md:grid-cols-[1.1fr_1fr]"
              : "mx-auto max-w-4xl px-5 py-12"
          }
        >
          <div>
            <Breadcrumbs
              items={[
                { label: "Servicios", href: "/servicios" },
                { label: s.title, href: `/servicios/${s.slug}` },
              ]}
            />
            <h1 className="mt-4 text-4xl font-bold text-ink">{s.h1}</h1>
            <p className="mt-4 text-lg text-muted">{s.intro}</p>
            <Link
              href="/cotizacion"
              className={`mt-6 ${btn.primary()}`}
            >
              Solicitar cotización
            </Link>
          </div>
          {s.video && <ProcessVideo {...s.video} />}
        </div>
      </section>

      {s.gallery && (
        <section className="mx-auto max-w-6xl px-5 pt-14">
          <h2 className="text-2xl font-bold text-ink">{s.gallery.title}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {s.gallery.images.map((img) => (
              <div key={img.src} className="relative aspect-square overflow-hidden rounded-2xl border border-line">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-4xl px-5 py-14">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-ink">Qué incluye el servicio</h2>
            <ul className="mt-5 space-y-3">
              {s.includes.map((i) => (
                <li key={i} className="flex gap-3 text-muted">
                  <span className="mt-1 text-brand">✓</span>
                  <span>{i}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-ink">Beneficios para tu empresa</h2>
            <ul className="mt-5 space-y-3">
              {s.benefits.map((b) => (
                <li key={b} className="flex gap-3 text-muted">
                  <span className="mt-1 text-brand">✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-surface">
        <div className="mx-auto max-w-4xl px-5 py-14">
          <h2 className="text-2xl font-bold text-ink">Preguntas frecuentes</h2>
          <div className="mt-6 divide-y divide-line border-y border-line">
            {s.faqs.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="cursor-pointer list-none font-semibold text-ink marker:hidden">
                  {f.q}
                </summary>
                <p className="mt-2 text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CTABand />
    </>
  );
}
