export type Faq = { q: string; a: string };

export type ServiceDetail = {
  slug: string;
  title: string;
  keyword: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  includes: string[];
  benefits: string[];
  faqs: Faq[];
};

export const serviceDetails: ServiceDetail[] = [
  {
    slug: "recoleccion-scrap",
    title: "Recolección de scrap",
    keyword: "recolección de scrap industrial maquila",
    metaTitle: "Recolección de Scrap Industrial en Cd. Juárez | MARDOS",
    metaDescription:
      "Recolección de scrap productivo, secundario y de embalaje para maquiladoras en Ciudad Juárez. Contenedores, transporte y pesos en 24h. Cotiza.",
    h1: "Recolección de scrap industrial para tu maquila",
    intro:
      "Gestionamos la recolección de tu scrap productivo, secundario y de embalaje directamente en tu planta, con contenedores y transporte propio, confirmación de pesos en 24 horas y la documentación que tus auditorías y operación IMMEX requieren.",
    includes: [
      "Recolección de scrap productivo, secundario y de embalaje.",
      "Suministro de contenedores adecuados a tu volumen.",
      "Transporte propio y recolección programada en tu planta.",
      "Clasificación y confirmación de pesos en un plazo máximo de 24 horas.",
      "Documentación y certificado de disposición.",
    ],
    benefits: [
      "Cumples con tus obligaciones ambientales y de comercio exterior.",
      "Liberas espacio en planta de forma segura y ordenada.",
      "Transparencia total con pesos confirmados en 24h.",
      "Tu material no termina en el mercado negro: disposición trazable.",
    ],
    faqs: [
      {
        q: "¿Qué tipos de scrap recolectan?",
        a: "Scrap productivo, secundario y de embalaje, además de residuos de manejo especial generados por la industria. Si tienes un material específico, escríbenos y lo evaluamos.",
      },
      {
        q: "¿Ustedes ponen los contenedores?",
        a: "Sí. Suministramos los contenedores adecuados al tipo y volumen de tu material, sin costo adicional dentro del servicio de recolección.",
      },
      {
        q: "¿En cuánto tiempo confirman los pesos?",
        a: "Confirmamos pesos y clasificación en un plazo no mayor a 24 horas tras la recolección.",
      },
      {
        q: "¿Emiten certificado de disposición?",
        a: "Sí. Entregamos la documentación que protege tu marca y respalda tus auditorías y operación IMMEX.",
      },
    ],
  },
  {
    slug: "destruccion-archivo-muerto",
    title: "Destrucción de archivo muerto",
    keyword: "destrucción de archivo muerto certificada Juárez",
    metaTitle: "Destrucción de Archivo Muerto Certificada | MARDOS",
    metaDescription:
      "Destrucción segura de documentos confidenciales con certificado y evidencia en Ciudad Juárez. Cumple la Ley de Protección de Datos. Cotiza.",
    h1: "Destrucción certificada de archivo muerto y documentos confidenciales",
    intro:
      "Destruimos de forma segura y trazable tus documentos confidenciales y archivo muerto, con certificado de destrucción y evidencia que respaldan el cumplimiento de la Ley Federal de Protección de Datos y tus políticas internas.",
    includes: [
      "Recolección segura del archivo en tu empresa.",
      "Destrucción confidencial y trazable del material.",
      "Certificado de destrucción con evidencia.",
      "Reciclaje del papel resultante.",
    ],
    benefits: [
      "Proteges información sensible de tu empresa y clientes.",
      "Cumples con la normatividad de protección de datos.",
      "Respaldo documental para auditorías.",
      "Disposición responsable y amigable con el ambiente.",
    ],
    faqs: [
      {
        q: "¿Entregan un certificado de destrucción?",
        a: "Sí. Al finalizar el proceso entregamos un certificado de destrucción con evidencia del material procesado.",
      },
      {
        q: "¿El proceso es confidencial?",
        a: "Totalmente. El material se maneja de forma segura y trazable desde la recolección hasta su destrucción final.",
      },
      {
        q: "¿Qué pasa con el papel destruido?",
        a: "Se recicla, cerrando el ciclo de forma responsable con el medio ambiente.",
      },
    ],
  },
  {
    slug: "maquinaria-obsoleta",
    title: "Compra y retiro de maquinaria obsoleta",
    keyword: "compra de maquinaria obsoleta Juárez",
    metaTitle: "Compra y Retiro de Maquinaria Obsoleta | MARDOS",
    metaDescription:
      "Compramos y retiramos maquinaria y equipo obsoleto de tu planta en Ciudad Juárez. Valuación justa y retiro seguro. Cotiza con MARDOS.",
    h1: "Compra y retiro de maquinaria obsoleta",
    intro:
      "Valuamos, compramos y retiramos la maquinaria y equipo fuera de uso de tu planta, liberando espacio y convirtiendo activos obsoletos en valor, con retiro seguro y documentación en regla.",
    includes: [
      "Valuación de maquinaria y equipo obsoleto.",
      "Compra a precio justo según material y condición.",
      "Retiro seguro con personal y transporte propio.",
      "Documentación de disposición.",
    ],
    benefits: [
      "Conviertes activos obsoletos en ingreso.",
      "Liberas espacio productivo en tu planta.",
      "Retiro seguro sin afectar tu operación.",
      "Disposición responsable y trazable.",
    ],
    faqs: [
      {
        q: "¿Cómo determinan el precio de la maquinaria?",
        a: "Evaluamos el tipo de material, peso y condición del equipo para ofrecerte una valuación justa.",
      },
      {
        q: "¿Ustedes se encargan del retiro?",
        a: "Sí, contamos con personal y transporte propio para el retiro seguro desde tu planta.",
      },
    ],
  },
  {
    slug: "contenedores-transporte",
    title: "Contenedores y transporte",
    keyword: "contenedores y transporte de scrap Juárez",
    metaTitle: "Contenedores y Transporte de Material | MARDOS",
    metaDescription:
      "Suministro de contenedores y transporte propio para el manejo de tu scrap y material reciclable en Ciudad Juárez. Cotiza con MARDOS.",
    h1: "Suministro de contenedores y transporte",
    intro:
      "Te suministramos los contenedores adecuados a tu volumen y tipo de material, y los recolectamos con transporte propio en recolecciones programadas, para que el manejo de tu scrap sea ordenado, seguro y eficiente.",
    includes: [
      "Contenedores adecuados a tu tipo y volumen de material.",
      "Recolección programada según tu operación.",
      "Transporte propio y personal capacitado.",
      "Coordinación logística sin afectar tu planta.",
    ],
    benefits: [
      "Orden y seguridad en el manejo de tu material.",
      "Recolecciones a la medida de tu operación.",
      "Sin necesidad de equipo propio para el manejo.",
    ],
    faqs: [
      {
        q: "¿Qué tipos de contenedor manejan?",
        a: "Suministramos distintos tipos de contenedor según el material y el volumen que generes. Lo definimos contigo en la cotización.",
      },
      {
        q: "¿Con qué frecuencia recolectan?",
        a: "Programamos las recolecciones de acuerdo con tu volumen y operación, desde recolecciones puntuales hasta calendarios fijos.",
      },
    ],
  },
  {
    slug: "escorias-soldadura",
    title: "Escorias de soldadura libres de plomo",
    keyword: "disposición de escoria de soldadura libre de plomo",
    metaTitle: "Disposición de Escorias de Soldadura | MARDOS",
    metaDescription:
      "Disposición final segura de escorias de soldadura libres de plomo para la industria en Ciudad Juárez. Cumplimiento y trazabilidad. Cotiza.",
    h1: "Disposición de escorias de soldadura libres de plomo",
    intro:
      "Damos disposición final segura y trazable a las escorias de soldadura libres de plomo generadas por tu operación, con el manejo y la documentación que tu cumplimiento ambiental requiere.",
    includes: [
      "Recolección de escorias de soldadura en tu planta.",
      "Manejo conforme a normatividad de residuos.",
      "Disposición final segura y trazable.",
      "Documentación de disposición.",
    ],
    benefits: [
      "Cumples con la normatividad de manejo de residuos.",
      "Disposición segura y responsable.",
      "Trazabilidad y respaldo documental.",
    ],
    faqs: [
      {
        q: "¿Manejan escorias libres de plomo?",
        a: "Sí, nos especializamos en la disposición final segura de escorias de soldadura libres de plomo.",
      },
      {
        q: "¿Entregan documentación de la disposición?",
        a: "Sí, entregamos la documentación que respalda el manejo y disposición de tu material.",
      },
    ],
  },
];

export function getService(slug: string) {
  return serviceDetails.find((s) => s.slug === slug);
}
