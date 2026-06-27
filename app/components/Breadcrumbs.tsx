import Link from "next/link";
import { site } from "@/lib/site";

export type Crumb = { label: string; href: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ label: "Inicio", href: "/" }, ...items];

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: `${site.domain}${c.href}`,
    })),
  };

  return (
    <nav aria-label="Ruta de navegación" className="text-sm text-muted">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ol className="flex flex-wrap items-center gap-1.5">
        {all.map((c, i) => (
          <li key={c.href} className="flex items-center gap-1.5">
            {i < all.length - 1 ? (
              <>
                <Link href={c.href} className="hover:text-brand">
                  {c.label}
                </Link>
                <span className="text-line">/</span>
              </>
            ) : (
              <span className="font-medium text-ink">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
