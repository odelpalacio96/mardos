import type { Metadata } from "next";
import Breadcrumbs from "../components/Breadcrumbs";
import LeadForm from "../components/LeadForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contáctanos para vender tu material o contratar un servicio de reciclaje industrial en Ciudad Juárez. Teléfono, correo y WhatsApp.",
  alternates: { canonical: "/contacto" },
};

export default function ContactoPage() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-12">
      <Breadcrumbs items={[{ label: "Contacto", href: "/contacto" }]} />
      <h1 className="mt-4 text-4xl font-bold text-ink">Contáctanos</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        ¿Quieres vender tu material o contratar un servicio? Escríbenos y te
        respondemos rápido.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-line bg-white p-8">
          <LeadForm variant="contacto" />
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-line bg-surface p-6">
            <h2 className="font-bold text-ink">Datos de contacto</h2>
            <ul className="mt-4 space-y-3 text-muted">
              <li>{site.address.full}</li>
              {site.phones.map((p) => (
                <li key={p}>
                  <a className="hover:text-brand" href={`tel:${p.replace(/\s/g, "")}`}>{p}</a>
                </li>
              ))}
              <li>
                <a className="hover:text-brand" href={`mailto:${site.email}`}>{site.email}</a>
              </li>
            </ul>
            <a
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-block rounded-lg bg-[#25D366] px-5 py-2.5 font-semibold text-white"
            >
              Escríbenos por WhatsApp
            </a>
          </div>

          <div className="overflow-hidden rounded-2xl border border-line">
            <iframe
              title="Ubicación de MARDOS Reciclados"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                site.address.full
              )}&output=embed`}
              className="h-64 w-full"
              loading="lazy"
            />
          </div>
        </aside>
      </div>
    </section>
  );
}
