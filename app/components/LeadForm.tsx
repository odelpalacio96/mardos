"use client";

import { useRef, useState } from "react";
import { site } from "@/lib/site";
import { btn } from "@/lib/ui";

type Props = { variant: "contacto" | "cotizacion" };
type Status = "idle" | "sending" | "sent" | "error";
type FieldName = "nombre" | "telefono" | "correo";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validación por campo: se muestra al salir del campo, no al enviar.
const validators: Record<FieldName, (v: string) => string> = {
  nombre: (v) => (v.trim().length >= 2 ? "" : "Escribe tu nombre."),
  telefono: (v) =>
    v.replace(/\D/g, "").length >= 8 ? "" : "Escribe un teléfono válido (al menos 8 dígitos).",
  correo: (v) => (EMAIL_RE.test(v.trim()) ? "" : "Escribe un correo válido, por ejemplo nombre@empresa.com."),
};

export default function LeadForm({ variant }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});

  const validateField = (name: FieldName, value: string) => {
    const msg = validators[name](value);
    setErrors((e) => ({ ...e, [name]: msg }));
    return msg;
  };

  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const name = e.currentTarget.name as FieldName;
    if (name in validators && e.currentTarget.value !== "") validateField(name, e.currentTarget.value);
  };

  const onInput = (e: React.FormEvent<HTMLInputElement>) => {
    const name = e.currentTarget.name as FieldName;
    // Si el campo ya mostraba error, se limpia en cuanto queda bien.
    if (errors[name]) validateField(name, e.currentTarget.value);
  };

  function mailtoFallback(values: Record<string, string>) {
    const lines = [
      `Nombre: ${values.nombre}`,
      `Empresa: ${values.empresa}`,
      `Teléfono: ${values.telefono}`,
      `Correo: ${values.correo}`,
      `Interés: ${values.interes}`,
      variant === "cotizacion" ? `Material o servicio: ${values.material}` : "",
      variant === "cotizacion" ? `Volumen estimado: ${values.volumen}` : "",
      "",
      `Mensaje: ${values.mensaje}`,
    ].filter(Boolean);
    const subject = variant === "cotizacion" ? "Solicitud de cotización — MARDOS" : "Mensaje de contacto — MARDOS";
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const values = Object.fromEntries(
      Array.from(new FormData(form).entries()).map(([k, v]) => [k, String(v)]),
    );

    const nextErrors: Partial<Record<FieldName, string>> = {};
    for (const name of Object.keys(validators) as FieldName[]) {
      const msg = validators[name](values[name] ?? "");
      if (msg) nextErrors[name] = msg;
    }
    setErrors(nextErrors);
    const firstInvalid = (Object.keys(validators) as FieldName[]).find((n) => nextErrors[n]);
    if (firstInvalid) {
      form.querySelector<HTMLInputElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, variant }),
      });
      if (res.ok) {
        setStatus("sent");
        form.reset();
        return;
      }
      if (res.status === 503) {
        // El envío por servidor aún no está configurado: usamos el correo del visitante.
        mailtoFallback(values);
        setStatus("sent");
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="py-6 text-center" role="status">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand/10 text-brand">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </div>
        <h2 className="mt-5 text-2xl font-bold text-ink">¡Recibimos tu solicitud!</h2>
        <p className="mx-auto mt-2 max-w-md text-muted">
          Te contactaremos pronto. Si es urgente, escríbenos por WhatsApp o llámanos al{" "}
          <a className="font-semibold text-brand" href={`tel:${site.phones[0].replace(/\s/g, "")}`}>
            {site.phones[0]}
          </a>
          .
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer" className={btn.whatsapp()}>
            WhatsApp
          </a>
          <button type="button" onClick={() => setStatus("idle")} className={btn.outline()}>
            Enviar otra solicitud
          </button>
        </div>
      </div>
    );
  }

  const field =
    "mt-1.5 w-full rounded-lg border border-line bg-card px-4 py-2.5 text-ink transition-colors placeholder:text-muted/70 focus:border-brand aria-[invalid=true]:border-red-600 dark:aria-[invalid=true]:border-red-400";
  const label = "block text-sm font-medium text-ink";
  const errorText = "mt-1.5 text-sm text-red-700 dark:text-red-400";

  const errorProps = (name: FieldName) => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
    onBlur,
    onInput,
  });

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Campo trampa para bots (oculto a personas y lectores de pantalla). */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">No llenar</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="nombre">Nombre</label>
          <input className={field} id="nombre" name="nombre" autoComplete="name" required {...errorProps("nombre")} />
          {errors.nombre && <p id="nombre-error" className={errorText}>{errors.nombre}</p>}
        </div>
        <div>
          <label className={label} htmlFor="empresa">
            Empresa <span className="font-normal text-muted">(opcional)</span>
          </label>
          <input className={field} id="empresa" name="empresa" autoComplete="organization" />
        </div>
        <div>
          <label className={label} htmlFor="telefono">Teléfono</label>
          <input className={field} id="telefono" name="telefono" type="tel" inputMode="tel" autoComplete="tel" required {...errorProps("telefono")} />
          {errors.telefono && <p id="telefono-error" className={errorText}>{errors.telefono}</p>}
        </div>
        <div>
          <label className={label} htmlFor="correo">Correo</label>
          <input className={field} id="correo" name="correo" type="email" inputMode="email" autoComplete="email" required {...errorProps("correo")} />
          {errors.correo && <p id="correo-error" className={errorText}>{errors.correo}</p>}
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
            <input className={field} id="volumen" name="volumen" placeholder="Ej. 2 toneladas al mes" />
          </div>
        </div>
      )}

      <div>
        <label className={label} htmlFor="mensaje">
          Mensaje <span className="font-normal text-muted">(opcional)</span>
        </label>
        <textarea className={field} id="mensaje" name="mensaje" rows={4} />
      </div>

      {status === "error" && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          No pudimos enviar tu solicitud. Intenta de nuevo o escríbenos por{" "}
          <a className="font-semibold underline" href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
          .
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className={`w-full sm:w-auto disabled:cursor-progress disabled:opacity-80 ${btn.primary()}`}
      >
        {status === "sending" && (
          <svg viewBox="0 0 24 24" className="h-4 w-4 animate-spin" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        )}
        {status === "sending"
          ? "Enviando…"
          : variant === "cotizacion"
            ? "Solicitar cotización"
            : "Enviar mensaje"}
      </button>
    </form>
  );
}
