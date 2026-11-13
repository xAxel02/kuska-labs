# Web de Kuska Labs

Sitio bilingüe (español / inglés) hecho con **Astro 7**. Es estático: no tiene servidor ni base de datos. Se publica en **Cloudflare**.

- Español: `/`
- Inglés: `/en/`

## Empezar

Requisitos: Node 22 o superior.

```bash
cd site
npm install
npm run dev        # http://localhost:4321
```

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor local con recarga automática |
| `npm run check` | Revisa tipos y errores (correrlo antes de abrir un PR) |
| `npm run build` | Genera el sitio final en `dist/` |
| `npm run preview` | Sirve `dist/` para revisarlo como en producción |
| `npm run deploy` | Build y publicación manual en Cloudflare (requiere `npx wrangler login`) |

## Dónde se edita cada cosa

| Quiero cambiar… | Archivo |
|---|---|
| Textos de la interfaz (menú, títulos, botones, formulario) | `src/i18n/ui.ts` (bloques `es` y `en`) |
| Pasos del proceso | `src/i18n/ui.ts` → `processSteps` |
| Un servicio | `src/content/services/es/<servicio>.md` **y** `src/content/services/en/<servicio>.md` |
| Un proyecto del portafolio | `src/content/projects/es|en/<proyecto>.md` |
| Integrantes del equipo | `src/content/team/<nombre>.md` (copiar `_ejemplo.md`) |
| WhatsApp, correo, dominio, mostrar precios | `src/config.ts` |
| Colores, tipografía y tamaños | `src/styles/tokens.css` (fuente de verdad de la marca) |
| Logo e íconos | `public/brand/` y `public/*.png|ico|svg` (generados desde `../brand/logo`) |

**Reglas de contenido:**
- Cada servicio y cada proyecto existe en los dos idiomas, con **el mismo nombre de archivo** en `es/` y `en/`.
- Nunca escribir "empresa", "S.A.C." ni "emitimos factura". Somos un **equipo** o **colectivo**, y cada integrante emite recibo por honorarios.
- Los precios están en el frontmatter (`priceFrom.pen` / `priceFrom.usd`) y se muestran solo si `SHOW_PRICES = true`.
- Para publicar una demo, cambia en el proyecto `status: live` y agrega `demoUrl`.

## Estructura

```
src/
  components/
    Header.astro, Footer.astro, WhatsAppFloat.astro
    Home.astro              ← arma la página de inicio con las secciones
    sections/               ← Hero, Services, Portfolio, Team, Process, Contact
  content/                  ← contenido en Markdown (por idioma)
  content.config.ts         ← esquema de cada colección (valida los campos)
  i18n/                     ← textos y utilidades de idioma
  layouts/Layout.astro      ← <head>: SEO, hreflang, Open Graph, íconos
  pages/                    ← rutas: index (es), en/index, 404
  styles/                   ← tokens.css (marca) + global.css
public/                     ← archivos que se copian tal cual (íconos, logo, _headers)
wrangler.jsonc              ← configuración de Cloudflare
```

## Flujo de trabajo del equipo

1. Crea una rama desde `main`, por ejemplo `feat/seccion-equipo` o `fix/texto-hero`.
2. Haz tus cambios y corre `npm run check` y `npm run build`.
3. Abre un pull request. Cloudflare genera una URL de vista previa del PR.
4. Al menos una persona revisa y aprueba. Luego se hace merge a `main`, y Cloudflare publica automáticamente.

## Publicar en Cloudflare (configuración única)

1. Sube el repositorio a GitHub (organización del equipo).
2. En el panel de Cloudflare entra a **Workers & Pages → Create → Import a repository** y elige el repo.
3. Configura:
   - **Root directory:** `site`
   - **Build command:** `npm run build`
   - **Deploy command:** `npx wrangler deploy`
4. Cuando tengamos el dominio, agrégalo en **Settings → Domains & Routes** y actualiza `SITE_URL` en `src/config.ts`.

## Pendientes (decisiones del equipo)

- [ ] Dominio definitivo → `SITE_URL` en `src/config.ts`
- [ ] Número de WhatsApp y correo → `src/config.ts`
- [ ] Mostrar precios o no → `SHOW_PRICES`
- [ ] Destino del formulario. Hoy abre WhatsApp con el mensaje armado; ver el comentario en `sections/Contact.astro`.
- [ ] Textos finales (los actuales son borrador)
- [ ] Integrantes del equipo y sus fotos
- [ ] Imagen para redes 1200×630 (`og:image`)
- [ ] Analítica
