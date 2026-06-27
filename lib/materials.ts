import type { Faq } from "./services";

export type MaterialDetail = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  items: string[];
  faqs: Faq[];
};

export const materialDetails: MaterialDetail[] = [
  {
    slug: "metales",
    title: "Reciclaje de metales",
    metaTitle: "Reciclaje de Metales en Ciudad Juárez | MARDOS",
    metaDescription:
      "Compramos aluminio, cobre, bronce, acero inoxidable, fierro y más. Cotización justa y recolección en tu planta en Cd. Juárez. Cotiza ya.",
    h1: "Compramos tus metales al mejor precio",
    intro:
      "Compramos los metales reciclables de tu empresa con cotización justa, pago confiable y recolección en tu planta. Más de 18 años respaldando a la industria de Ciudad Juárez.",
    items: [
      "Aluminio",
      "Cobre",
      "Cable de cobre",
      "Bronce",
      "Acero inoxidable",
      "Fierro",
      "Estaño",
      "Zinc",
      "Magnesio",
    ],
    faqs: [
      {
        q: "¿Cómo determinan el precio de mi material?",
        a: "El precio depende del tipo de metal, su clasificación y el peso confirmado. Te damos una cotización justa y transparente.",
      },
      {
        q: "¿Recolectan en mi planta?",
        a: "Sí. Coordinamos la recolección en tu planta con contenedores y transporte propio.",
      },
      {
        q: "¿Cómo es el pago?",
        a: "Pago confiable una vez confirmados los pesos y la clasificación del material, en un plazo no mayor a 24 horas.",
      },
    ],
  },
  {
    slug: "cable-cobre",
    title: "Cable de cobre",
    metaTitle: "Compra de Cable de Cobre en Cd. Juárez | MARDOS",
    metaDescription:
      "Compramos cable de cobre y cobre en Ciudad Juárez. Valuación justa por kilo, pago confiable y recolección en planta. Cotiza tu material.",
    h1: "Compra de cable de cobre y cobre",
    intro:
      "Compramos cable de cobre y cobre en todas sus presentaciones. Valuamos según calibre, recubrimiento y peso, con pago confiable y recolección en tu planta.",
    items: [
      "Cable de cobre con y sin forro",
      "Cobre #1 y #2",
      "Cobre de bobinas y motores",
      "Recortes y rebabas de cobre",
    ],
    faqs: [
      {
        q: "¿Compran cable con forro?",
        a: "Sí. Valuamos el cable según su contenido de cobre, calibre y recubrimiento.",
      },
      {
        q: "¿Cómo se valúa el cobre?",
        a: "Por tipo, clasificación y peso confirmado. Te entregamos una cotización clara antes de cerrar.",
      },
    ],
  },
  {
    slug: "electronicos",
    title: "Materiales electrónicos",
    metaTitle: "Reciclaje de Electrónicos en Cd. Juárez | MARDOS",
    metaDescription:
      "Reciclaje y compra de scrap electrónico para la industria en Ciudad Juárez. Manejo responsable y trazable. Cotiza tu material con MARDOS.",
    h1: "Reciclaje de materiales electrónicos",
    intro:
      "Compramos y damos disposición responsable a tu scrap y materiales electrónicos, con manejo trazable y la documentación que tu operación requiere.",
    items: [
      "Tarjetas y componentes electrónicos",
      "Cableado y arneses",
      "Equipo electrónico fuera de uso",
      "Scrap electrónico de producción",
    ],
    faqs: [
      {
        q: "¿Qué materiales electrónicos compran?",
        a: "Tarjetas, componentes, cableado, arneses y equipo electrónico fuera de uso, entre otros. Escríbenos para evaluar tu material.",
      },
      {
        q: "¿El manejo es trazable?",
        a: "Sí. Damos disposición responsable y trazable, con documentación de respaldo.",
      },
    ],
  },
];

export function getMaterial(slug: string) {
  return materialDetails.find((m) => m.slug === slug);
}
