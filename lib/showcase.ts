// Fotos de material real de MARDOS. Las etiquetas de proveedores van desenfocadas
// a propósito: se nota que hay texto, pero no se lee ni se muestran marcas.

export type ShowcaseImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type ShowcaseItem = {
  title: string;
  text: string;
  image: ShowcaseImage;
  /** "cutout": producto recortado sobre fondo; "photo": foto a sangre. */
  kind: "cutout" | "photo";
};

export const solderWire: ShowcaseImage = {
  src: "/materiales/soldadura-alambre.webp",
  alt: "Carretes de alambre de soldadura",
  width: 252,
  height: 309,
};

export const solderBar: ShowcaseImage = {
  src: "/materiales/soldadura-barra.webp",
  alt: "Barra de soldadura",
  width: 231,
  height: 733,
};

export const componentReel: ShowcaseImage = {
  src: "/materiales/carrete-componentes.webp",
  alt: "Carrete de componentes electrónicos",
  width: 640,
  height: 647,
};

export const drossPhotos: ShowcaseImage[] = [
  { src: "/materiales/escoria-1.webp", alt: "Escoria de soldadura en caja", width: 620, height: 620 },
  { src: "/materiales/escoria-2.webp", alt: "Escoria de soldadura recolectada", width: 600, height: 600 },
  { src: "/materiales/escoria-3.webp", alt: "Detalle de escoria de soldadura", width: 600, height: 600 },
];

export const solderShowcase: ShowcaseItem[] = [
  {
    title: "Alambre de soldadura",
    text: "Carretes de alambre de soldadura de tu línea de producción.",
    image: solderWire,
    kind: "cutout",
  },
  {
    title: "Soldadura en barra",
    text: "Barras de soldadura para procesos de soldadura por ola.",
    image: solderBar,
    kind: "cutout",
  },
  {
    title: "Carretes de componentes",
    text: "Carretes (reels) con componentes electrónicos fuera de uso.",
    image: componentReel,
    kind: "cutout",
  },
  {
    title: "Escoria de soldadura",
    text: "Libre de plomo, y gestión de la que contiene plomo.",
    image: drossPhotos[0],
    kind: "photo",
  },
];
