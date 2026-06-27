import type { Metadata } from "next";
import Breadcrumbs from "../components/Breadcrumbs";
import CTABand from "../components/CTABand";

export const metadata: Metadata = {
  title: "Quiénes Somos | MARDOS Reciclados Cd. Juárez",
  description:
    "Más de 18 años reciclando para la industria maquiladora en Ciudad Juárez. Filial en EE.UU. y operaciones IMMEX. Conócenos.",
  alternates: { canonical: "/nosotros" },
};

export default function NosotrosPage() {
  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-4xl px-5 py-12">
          <Breadcrumbs items={[{ label: "Nosotros", href: "/nosotros" }]} />
          <h1 className="mt-4 text-4xl font-bold text-ink">Quiénes somos</h1>
          <p className="mt-4 text-lg text-muted">
            Más de 18 años dando soluciones de reciclaje a la industria de
            Ciudad Juárez y la zona fronteriza, con operaciones IMMEX y filial en
            Estados Unidos.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-14">
        <div className="prose-mardos space-y-6 text-lg leading-relaxed text-muted">
          <p>
            En MARDOS Reciclados nos dedicamos a recolectar, comprar y dar
            disposición certificada a los materiales reciclables de la industria.
            Trabajamos de la mano de maquiladoras y empresas que necesitan una
            solución confiable, legal y trazable para su scrap y residuos de
            manejo especial.
          </p>
          <p>
            Nuestra experiencia de más de 18 años, sumada a nuestras operaciones
            IMMEX y a nuestra filial en Estados Unidos, nos permite ofrecer
            soluciones transfronterizas para el retorno de materiales importados
            temporalmente, algo crítico para la operación de comercio exterior de
            nuestros clientes.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-line bg-surface p-8">
            <h2 className="text-xl font-bold text-ink">Misión</h2>
            <p className="mt-3 text-muted">
              Ser una empresa que proyecte el reciclaje y consciente de la
              responsabilidad social, con un bien común enfocado al cuidado del
              medio ambiente, generando un ciclo económico con beneficio para
              nuestros clientes, la empresa y la sociedad.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-8">
            <h2 className="text-xl font-bold text-ink">Por qué MARDOS</h2>
            <ul className="mt-3 space-y-2 text-muted">
              <li>+18 años de experiencia en la industria.</li>
              <li>Operaciones IMMEX y filial en EE.UU.</li>
              <li>Certificado de destrucción y cumplimiento ambiental.</li>
              <li>Confirmación de pesos en 24 horas.</li>
            </ul>
          </div>
        </div>
      </section>

      <CTABand />
    </>
  );
}
