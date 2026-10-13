export const site = {
  name: "MARDOS Reciclados",
  legalName: "MARDOS Reciclados S.A. de C.V.",
  domain: "https://www.mardosreciclados.com",
  description:
    "Recolección, compra y disposición certificada de materiales reciclables para la industria en Ciudad Juárez. +18 años de experiencia.",
  address: {
    street: "Calle Quiches No. 6735",
    colony: "Col. Azteca",
    city: "Ciudad Juárez",
    state: "Chihuahua",
    country: "MX",
    full: "Calle Quiches No. 6735, Col. Azteca, Cd. Juárez, Chih.",
  },
  phones: ["+52 656 305 4878", "+52 656 598 0746"],
  // WhatsApp de Uriel (formato internacional sin "+", espacios ni guiones).
  whatsapp: "526565980746",
  // Correo principal (schema, respaldo del formulario) y lista que se muestra en el sitio.
  email: "fmarmolejo@mardosreciclados.com",
  emails: ["fmarmolejo@mardosreciclados.com", "urivas@mardosreciclados.com"],
  social: {
    facebook: "",
    instagram: "",
  },
} as const;

export const nav = [
  { label: "Nosotros", href: "/nosotros" },
  { label: "Servicios", href: "/servicios" },
  { label: "Materiales", href: "/materiales" },
  { label: "Blog", href: "/blog" },
  { label: "Contacto", href: "/contacto" },
] as const;

export const services = [
  {
    slug: "recoleccion-scrap",
    title: "Recolección de scrap",
    short: "Scrap productivo, secundario y de embalaje, retirado en tu planta.",
  },
  {
    slug: "destruccion-archivo-muerto",
    title: "Destrucción de archivo muerto",
    short: "Destrucción certificada de documentos confidenciales con evidencia.",
  },
  {
    slug: "maquinaria-obsoleta",
    title: "Compra y retiro de maquinaria obsoleta",
    short: "Valuamos, compramos y retiramos tu maquinaria fuera de uso.",
  },
  {
    slug: "contenedores-transporte",
    title: "Contenedores y transporte",
    short: "Suministro de contenedores y transporte propio para tu material.",
  },
  {
    slug: "escorias-soldadura",
    title: "Escorias de soldadura libres de plomo",
    short: "Disposición final de escorias libres de plomo y gestión de las que contienen plomo.",
  },
  {
    slug: "comercio-exterior",
    title: "Gestión en comercio exterior",
    short: "Retorno de materiales importados temporalmente con filial en EE.UU.",
  },
] as const;

export const materials = [
  "Aluminio",
  "Cobre",
  "Cable de cobre",
  "Bronce",
  "Acero inoxidable",
  "Fierro",
  "Estaño",
  "Zinc",
  "Magnesio",
  "Materiales electrónicos",
] as const;

/** Mensaje que llega escrito en WhatsApp: el visitante solo toca "Enviar". */
export const whatsappMessage =
  "Hola, vengo del sitio web de MARDOS. Me interesa reciclar material de mi empresa y quisiera recibir una cotización.";

/** Enlace a WhatsApp con el mensaje ya escrito. */
export function whatsappLink(message: string = whatsappMessage) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
