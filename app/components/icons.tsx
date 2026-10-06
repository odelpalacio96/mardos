// Íconos de línea (24×24, trazo 1.75) con el mismo lenguaje visual en todo el sitio.

type IconProps = { className?: string };

const svgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/** Documento con sello: certificado de destrucción. */
export function IconCertificate({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4" />
      <path d="M14 3l5 5v2" />
      <path d="M14 3v5h5" />
      <path d="M8.5 12h5M8.5 15.5h3" />
      <circle cx="17" cy="16" r="3" />
      <path d="M15.5 18.6L15 22l2-1 2 1-.5-3.4" />
    </svg>
  );
}

/** Báscula: pesos y clasificación. */
export function IconScale({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M12 3v18M7 21h10" />
      <path d="M5 7h14" />
      <path d="M5 7l-3 7a3.5 3.5 0 0 0 6 0L5 7zM19 7l-3 7a3.5 3.5 0 0 0 6 0l-3-7z" />
    </svg>
  );
}

/** Camión cruzando: solución transfronteriza. */
export function IconTruck({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M2 6h11v10H2zM13 9h4l3.5 3.5V16H13" />
      <circle cx="6" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
    </svg>
  );
}

/** Fábrica: para maquiladoras. */
export function IconFactory({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M3 21V10l5 3V10l5 3V10l5 3V4h3v17H3z" />
      <path d="M7 17h2M12 17h2M17 17h1" />
    </svg>
  );
}

/** Monedas: vender tu material. */
export function IconCoins({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <ellipse cx="9" cy="7" rx="6" ry="3" />
      <path d="M3 7v4c0 1.7 2.7 3 6 3s6-1.3 6-3V7" />
      <path d="M3 11v4c0 1.7 2.7 3 6 3 1 0 2-.1 2.8-.4" />
      <circle cx="17.5" cy="16.5" r="4.5" />
      <path d="M17.5 14.5v4M16 15.5h2.2a.9.9 0 0 1 0 1.8h-1.4a.9.9 0 0 0 0 1.8H19" />
    </svg>
  );
}

export function IconArrowRight({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg {...svgProps} className={className} strokeWidth={2}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function IconCheck({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg {...svgProps} className={className} strokeWidth={2.2}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}
