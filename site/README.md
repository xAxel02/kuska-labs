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
| `npm run dev` | Servidor local con recarga automática (sin el Worker: el formulario no envía) |
| `npm run check` | Revisa tipos de la web y del Worker (correrlo antes de abrir un PR) |
| `npm run build` | Genera el sitio final en `dist/` |
| `npm run preview` | Build + `wrangler dev`: web **y** Worker como en producción, en http://localhost:8787 |
| `npm run db:migrate:local` | Crea las tablas en la base D1 local (una vez, antes de `preview`) |
| `npm run deploy` | Build y publicación manual en Cloudflare (requiere `npx wrangler login`) |

**Probar el formulario en local:**
1. Copia `.env.example` como `.env` y `.dev.vars.example` como `.dev.vars`. Ambos traen las claves de prueba de Turnstile.
2. Corre `npm run db:migrate:local` y luego `npm run preview`.
3. Los correos no se envían de verdad: Wrangler los guarda en `.wrangler/tmp/email/` y muestra la ruta en la consola.

## Dónde se edita cada cosa

| Quiero cambiar… | Archivo |
|---|---|
| Textos de la interfaz (menú, títulos, botones, formulario) | `src/i18n/ui.ts` (bloques `es` y `en`) |
| Pasos del proceso | `src/i18n/ui.ts` → `processSteps` |
| Un servicio | `src/content/services/es/<servicio>.md` **y** `src/content/services/en/<servicio>.md` |
| Un proyecto del portafolio | `src/content/projects/es|en/<proyecto>.md` |
| Integrantes del equipo | `src/content/team/<nombre>.md` (copiar `_ejemplo.md`) |
| WhatsApp, correo, dominio, mostrar precios | `src/config.ts` |
| Formulario (backend) | `worker/index.ts` + `wrangler.jsonc` |
| Política de privacidad | `src/components/Privacy.astro` |
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
  pages/                    ← rutas: index (es), en/index, privacidad, en/privacy, 404
  styles/                   ← tokens.css (marca) + global.css
public/                     ← archivos que se copian tal cual (íconos, logo, _headers)
worker/index.ts             ← Worker: /api/contacto (Turnstile + D1 + correo)
migrations/                 ← esquema de la base D1 de leads
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

## Formulario y analítica

**Cómo funciona el formulario:**
1. El visitante envía el formulario, que va a `POST /api/contacto`. Lo atiende el Worker en [`worker/index.ts`](worker/index.ts).
2. El Worker valida Turnstile (antispam) y un campo trampa para bots, el honeypot.
3. Guarda el lead en D1, en la tabla `leads` (ver [`migrations/`](migrations/)).
4. Envía un correo a `MAIL_TO` con *Reply-To* apuntando al cliente.

**Fallback:** si `PUBLIC_TURNSTILE_SITE_KEY` está vacía, el formulario abre WhatsApp con el mensaje armado. Así la web funciona aunque no se haya activado nada.

**Ver los leads:**

```bash
npx wrangler d1 execute kuska-leads --remote --command "SELECT id, created_at, name, contact, business, status FROM leads ORDER BY id DESC LIMIT 20"
```

**Analítica (Umami, sin cookies):** registra las visitas y estos eventos de conversión:

| Evento | Cuándo | Propiedad |
|---|---|---|
| `cta-diagnosis` | Clic en "Agenda tu diagnóstico" | `location`: header, menu, hero |
| `whatsapp` | Clic en cualquier enlace de WhatsApp | `location`: hero, float, contact, footer, form-success |
| `email` | Clic en el correo | `location` |
| `form-submit` | Formulario enviado | `mode`: api o whatsapp |
| `form-error` | Error al enviar | `reason` |

Para medir un botón nuevo, agrégale `data-umami-event="nombre"` y `data-umami-event-location="seccion"`.

### Activación (una sola vez, cuando tengan dominio)

1. **Dominio en Cloudflare:** comprarlo o transferirlo y agregarlo a la cuenta.
2. **Email Routing** (Email → Email Routing):
   - Activarlo.
   - Crear la dirección `hola@` reenviada a `kuskalabs.pe@gmail.com`.
   - Verificar `kuskalabs.pe@gmail.com` como *destination address* (llega un correo de confirmación). Debe coincidir con `MAIL_TO` en `wrangler.jsonc`.
   - Descomentar el bloque `send_email` en `wrangler.jsonc`.
   - Cambiar `CONTACT_EMAIL` en `src/config.ts` a `hola@kuskalabs.com`.
3. **Turnstile** (Turnstile → Add widget):
   - Usar el dominio del sitio y el modo *Managed*.
   - Guardar la clave pública como variable de build `PUBLIC_TURNSTILE_SITE_KEY`.
   - Guardar la clave secreta con `npx wrangler secret put TURNSTILE_SECRET`.
4. **Base de datos:** el primer `wrangler deploy` crea `kuska-leads` automáticamente. Luego hay que correr `npm run db:migrate:remote`.
5. **Umami:**
   - Crear una cuenta gratis en umami.is y agregar el sitio.
   - Guardar el *Website ID* como variable de build `PUBLIC_UMAMI_WEBSITE_ID`.
6. **Google Search Console:**
   - Agregar la propiedad de dominio y verificarla por DNS (Cloudflare lo hace con un clic).
   - Enviar `https://<dominio>/sitemap-index.xml`.
7. **Si quieren publicar antes de tener dominio** (en `*.workers.dev`): comenten el bloque `send_email` en `wrangler.jsonc`. Los leads se guardarán igual en D1.

## Pendientes (decisiones del equipo)

- [ ] Dominio definitivo → `SITE_URL` en `src/config.ts` (hoy apunta a la URL de workers.dev)
- [x] Correo del equipo: `kuskalabs.pe@gmail.com`
- [x] WhatsApp: +51 960 098 421
- [x] Precios visibles (`SHOW_PRICES = true`)
- [ ] Activar formulario y analítica (ver "Activación" arriba)
- [ ] Revisión legal de la política de privacidad (`src/components/Privacy.astro`): Ley 29733 y, de ser necesario, inscripción del banco de datos ante la ANPD
- [x] Textos finales v1.0 (`src/i18n/ui.ts`)
- [ ] Foto y LinkedIn del equipo (opcional)
- [x] Imagen para redes 1200×630 (`brand/og/`, se regenera con `python brand/og/render_og.py`)
