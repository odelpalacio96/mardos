// Estilos de botón compartidos. Responden al presionar (escala 0.97 en 100 ms)
// y el hover solo aplica en dispositivos con puntero (Tailwind 4 ya lo limita).

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-[color,background-color,border-color,scale] duration-100 ease-out active:scale-[0.97] select-none";

const size = {
  md: "px-6 py-3",
  sm: "px-4 py-2 text-sm",
} as const;

type Size = keyof typeof size;

export const btn = {
  /** Verde sólido, texto blanco. */
  primary: (s: Size = "md") => `${base} ${size[s]} bg-brand-solid text-white hover:bg-brand-dark`,
  /** Contorno sobre fondos claros. */
  outline: (s: Size = "md") => `${base} ${size[s]} border border-line text-ink hover:border-brand hover:text-brand`,
  /** Contorno sobre fondos oscuros (navy o verde). */
  outlineLight: (s: Size = "md") => `${base} ${size[s]} border border-white/40 text-white hover:bg-white/10`,
  /** Blanco sólido sobre fondos de color. */
  white: (s: Size = "md") => `${base} ${size[s]} bg-white text-brand-dark hover:bg-white/90`,
  /** WhatsApp. */
  whatsapp: (s: Size = "md") => `${base} ${size[s]} bg-[#157a3a] text-white hover:bg-[#106630]`,
};

/** Enlace de texto con flecha ("Ver más →"). */
export const textLink =
  "inline-flex items-center gap-1 font-semibold text-brand transition-colors duration-150 hover:text-brand-dark dark:hover:text-brand-light";
