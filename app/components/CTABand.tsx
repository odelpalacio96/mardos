import Link from "next/link";
import { site } from "@/lib/site";
import { btn } from "@/lib/ui";

type Props = {
  title?: string;
  text?: string;
};

export default function CTABand({
  title = "Recicla hoy, para construir mañana.",
  text = "Solicita tu cotización sin compromiso. Te respondemos rápido.",
}: Props) {
  return (
    <section className="on-dark bg-brand-solid">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-5 py-14 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white md:text-3xl">{title}</h2>
          <p className="mt-2 max-w-xl text-white/90">{text}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/cotizacion"
            className={btn.white()}
          >
            Solicitar cotización
          </Link>
          <a
            href={`https://wa.me/${site.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className={btn.outlineLight()}
          >
            WhatsApp directo
          </a>
        </div>
      </div>
    </section>
  );
}
