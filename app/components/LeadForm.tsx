"use client";

import { useState } from "react";
import { site } from "@/lib/site";

type Props = { variant: "contacto" | "cotizacion" };

export default function LeadForm({ variant }: Props) {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const get = (k: string) => (data.get(k) as string) || "";

    const lines = [
      `Nombre: ${get("nombre")}`,
      `Empresa: ${get("empresa")}`,
      `Teléfono: ${get("telefono")}`,
      `Correo: ${get("correo")}`,
      `Interés: ${get("interes")}`,
      variant === "cotizacion" ? `Material o servicio: ${get("material")}` : "",
      variant === "cotizacion" ? `Volumen estimado: ${get("volumen")}` : "",
      "",
      `Mensaje: ${get("mensaje")}`,
    ].filter(Boolean);

    const subject =
      variant === "cotizacion"
        ? "Solicitud de cotización — MARDOS"
        : "Mensaje de contacto — MARDOS";

    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(lines.join("\n"))}`;
    setSent(true);
  }

  const field =
    "mt-1 w-full rounded-lg border border-line bg-white px-4 py-2.5 text-ink outline-none focus:border-brand";
  const label = "block text-sm font-medium text-ink";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="nombre">Nombre</label>
          <input className={field} id="nombre" name="nombre" required />
        </div>
        <div>
          <label className={label} htmlFor="empresa">Empresa</label>
          <input className={field} id="empresa" name="empresa" />
        </div>
        <div>
          <label className={label} htmlFor="telefono">Teléfono</label>
          <input className={field} id="telefono" name="telefono" type="tel" required />
        </div>
        <div>
          <label className={label} htmlFor="correo">Correo</label>
          <input className={field} id="correo" name="correo" type="email" required />
        </div>
      </div>

      <div>
        <label className={label} htmlFor="interes">Me interesa</label>
        <select className={field} id="interes" name="interes" defaultValue="">
          <option value="" disabled>Selecciona una opción</option>
          <option>Vender material</option>
          <option>Contratar un servicio</option>
          <option>Otro</option>
        </select>
      </div>

      {variant === "cotizacion" && (
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="material">Material o servicio</label>
            <input className={field} id="material" name="material" placeholder="Cable de cobre, recolección de scrap…" />
          </div>
          <div>
            <label className={label} htmlFor="volumen">Volumen estimado</label>
            <input className={field} id="volumen" name="volumen" placeholder="Ej. 2 toneladas / mes" />
          </div>
        </div>
      )}

      <div>
        <label className={label} htmlFor="mensaje">Mensaje</label>
        <textarea className={field} id="mensaje" name="mensaje" rows={4} />
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-brand px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-dark sm:w-auto"
      >
        {variant === "cotizacion" ? "Solicitar cotización" : "Enviar mensaje"}
      </button>

      {sent && (
        <p className="text-sm text-brand-dark">
          Se abrió tu correo con la información. Si no se abrió, escríbenos a{" "}
          <a className="font-semibold underline" href={`mailto:${site.email}`}>
            {site.email}
          </a>{" "}
          o por WhatsApp.
        </p>
      )}
    </form>
  );
}
