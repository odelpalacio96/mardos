// Fondos del encabezado de Materiales: cada material de la lista tiene su foto
// y la página a la que lleva. Sin foto propia todavía → usa la imagen general.

export type MaterialBackground = {
  name: string;
  href: string;
  image: string;
  alt: string;
};

export const generalBackground = {
  image: "/materiales/fondos/varios.webp",
  alt: "Variedad de materiales reciclables: cobre, aluminio, acero y tarjetas electrónicas",
};

export const materialBackgrounds: MaterialBackground[] = [
  { name: "Aluminio", href: "/materiales/metales", image: "/materiales/fondos/aluminio.webp", alt: "Scrap de aluminio: perfiles, latas y viruta" },
  // Pendiente: foto de cobre sólido.
  { name: "Cobre", href: "/materiales/metales", image: generalBackground.image, alt: generalBackground.alt },
  { name: "Cable de cobre", href: "/materiales/cable-cobre", image: "/materiales/fondos/cable-cobre.webp", alt: "Cable de cobre para reciclaje" },
  { name: "Bronce", href: "/materiales/metales", image: "/materiales/fondos/bronce.webp", alt: "Piezas y tubería de bronce" },
  { name: "Acero inoxidable", href: "/materiales/metales", image: "/materiales/fondos/acero-inoxidable.webp", alt: "Conexiones y tubos de acero inoxidable" },
  { name: "Fierro", href: "/materiales/metales", image: "/materiales/fondos/fierro.webp", alt: "Piezas de fierro y motores" },
  { name: "Estaño", href: "/materiales/metales", image: "/materiales/fondos/estano.webp", alt: "Barras y alambre de estaño" },
  { name: "Zinc", href: "/materiales/metales", image: "/materiales/fondos/zinc.webp", alt: "Lámina y piezas de zinc" },
  { name: "Magnesio", href: "/materiales/metales", image: "/materiales/fondos/magnesio.webp", alt: "Piezas de magnesio" },
  { name: "Materiales electrónicos", href: "/materiales/electronicos", image: "/materiales/fondos/electronicos.webp", alt: "Tarjetas y componentes electrónicos" },
];
