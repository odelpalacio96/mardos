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
  phones: ["656 887 2362", "656 305 4878"],
  // WhatsApp oficial pendiente de confirmar — provisional con el primer teléfono.
  whatsapp: "5216568872362",
  email: "fmarmolejo@mardosreciclados.com",
  social: {
    facebook: "",
    instagram: "",
  },
} as const;

export const nav = [
  { label: "Nosotros", href: "/nosotros" },
  { label: "Servicios", href: "/servicios" },
  { label: "Materiales", href: "/materiales" },
  { label: "IMMEX", href: "/immex" },
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
    short: "Disposición final segura de escorias de soldadura.",
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
