import { site } from "@/lib/site";

// Envía las solicitudes del formulario por correo usando Resend (https://resend.com).
// Variables de entorno (en Vercel → Settings → Environment Variables):
//   RESEND_API_KEY      obligatoria; sin ella el formulario usa el correo del visitante
//   CONTACT_TO_EMAIL    a quién llegan las solicitudes; varios separados por coma
//                       (por defecto, el correo del sitio)
//   CONTACT_FROM_EMAIL  remitente con dominio verificado en Resend
//                       (por defecto "onboarding@resend.dev", solo para pruebas)

const MAX = 2000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Payload = Partial<
  Record<
    | "variant"
    | "nombre"
    | "empresa"
    | "telefono"
    | "correo"
    | "interes"
    | "material"
    | "volumen"
    | "mensaje"
    | "website",
    string
  >
>;

const clean = (v: unknown) => (typeof v === "string" ? v.trim().slice(0, MAX) : "");

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_body" }, { status: 400 });
  }

  // Campo trampa para bots: si viene lleno, respondemos "ok" sin enviar nada.
  if (clean(body.website)) return Response.json({ ok: true });

  const data = {
    variant: clean(body.variant) === "cotizacion" ? "cotizacion" : "contacto",
    nombre: clean(body.nombre),
    empresa: clean(body.empresa),
    telefono: clean(body.telefono),
    correo: clean(body.correo),
    interes: clean(body.interes),
    material: clean(body.material),
    volumen: clean(body.volumen),
    mensaje: clean(body.mensaje),
  };

  const phoneDigits = data.telefono.replace(/\D/g, "");
  if (data.nombre.length < 2 || phoneDigits.length < 8 || !EMAIL_RE.test(data.correo)) {
    return Response.json({ error: "invalid_fields" }, { status: 422 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) return Response.json({ error: "not_configured" }, { status: 503 });

  const subject =
    data.variant === "cotizacion"
      ? `Cotización: ${data.nombre}${data.empresa ? ` (${data.empresa})` : ""}`
      : `Contacto: ${data.nombre}${data.empresa ? ` (${data.empresa})` : ""}`;

  const text = [
    `Nombre: ${data.nombre}`,
    `Empresa: ${data.empresa || "—"}`,
    `Teléfono: ${data.telefono}`,
    `Correo: ${data.correo}`,
    `Le interesa: ${data.interes || "—"}`,
    ...(data.variant === "cotizacion"
      ? [`Material o servicio: ${data.material || "—"}`, `Volumen estimado: ${data.volumen || "—"}`]
      : []),
    "",
    data.mensaje || "(Sin mensaje)",
    "",
    "— Enviado desde el formulario del sitio web",
  ].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "MARDOS Sitio Web <onboarding@resend.dev>",
      to: (process.env.CONTACT_TO_EMAIL || site.email)
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean),
      reply_to: data.correo,
      subject,
      text,
    }),
  });

  if (!res.ok) return Response.json({ error: "send_failed" }, { status: 502 });
  return Response.json({ ok: true });
}
