## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Reglas del proyecto Kuska Labs

- Kuska Labs es un **colectivo/equipo**, no una empresa: nunca escribir "empresa", "S.A.C." ni "emitimos factura" (cada integrante emite recibo por honorarios).
- Sitio bilingüe: todo contenido nuevo va en `es/` y `en/` con el mismo nombre de archivo; textos de interfaz en `src/i18n/ui.ts`.
- Usar siempre los tokens de `src/styles/tokens.css` (`var(--...)`); no hardcodear colores ni fuentes. Oro Inti es el único acento.
- Todo debe llevar a WhatsApp o a "Agenda tu diagnóstico gratis".
- Antes de un PR: `npm run check` y `npm run build` sin errores.
