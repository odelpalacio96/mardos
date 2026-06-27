import type { Metadata } from "next";
import Breadcrumbs from "../components/Breadcrumbs";
import LeadForm from "../components/LeadForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Solicita tu cotización",
  description:
    "Cotiza la recolección de tu scrap o la venta de tu material reciclable en Ciudad Juárez. Respuesta rápida y sin compromiso.",
  alternates: { canonical: "/cotizacion" },
};

export default function CotizacionPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-12">
      <Breadcrumbs items={[{ label: "Cotización", href: "/cotizacion" }]} />
      <h1 className="mt-4 text-4xl font-bold text-ink">Solicita tu cotización</h1>
      <p className="mt-4 text-lg text-muted">
        Cuéntanos qué material quieres vender o qué servicio necesitas. Te damos
        una cotización justa, sin compromiso y con respuesta rápida.
      </p>

      <div className="mt-10 rounded-2xl border border-line bg-white p-8">
        <LeadForm variant="cotizacion" />
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        ¿Prefieres hablar directo? Llámanos al{" "}
        <a className="font-semibold text-brand" href={`tel:${site.phones[0].replace(/\s/g, "")}`}>
          {site.phones[0]}
        </a>{" "}
        o escríbenos por WhatsApp.
      </p>
    </section>
  );
}
