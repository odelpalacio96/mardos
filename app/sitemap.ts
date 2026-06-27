import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { serviceDetails } from "@/lib/services";
import { materialDetails } from "@/lib/materials";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.domain;
  const staticRoutes = [
    "",
    "/nosotros",
    "/servicios",
    "/materiales",
    "/immex",
    "/blog",
    "/contacto",
    "/cotizacion",
  ];

  const routes: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
  }));

  for (const s of serviceDetails) {
    routes.push({
      url: `${base}/servicios/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }
  for (const m of materialDetails) {
    routes.push({
      url: `${base}/materiales/${m.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  return routes;
}
