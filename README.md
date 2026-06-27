# MARDOS Reciclados — Sitio web

Sitio de [MARDOS Reciclados](https://www.mardosreciclados.com), recicladora industrial en Ciudad Juárez (+18 años, operaciones IMMEX, filial en EE.UU.).

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4**
- Desplegado en **Vercel** (auto-deploy desde la rama `main`)

## Desarrollo local

Requiere Node.js (instalado vía nvm).

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción
```

## Estructura

- `app/` — rutas (App Router) y componentes en `app/components/`
- `lib/site.ts` — datos de contacto, navegación, materiales
- `lib/services.ts` · `lib/materials.ts` — contenido de las landings
- `app/sitemap.ts` · `app/robots.ts` — SEO técnico

## Páginas

Home, `/nosotros`, `/servicios` (+5 detalle), `/materiales` (+3 detalle), `/immex`, `/blog`, `/contacto`, `/cotizacion`.
