import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Cada servicio/proyecto es un archivo Markdown dentro de su carpeta de idioma:
 *   src/content/services/es/web-informativa.md
 *   src/content/services/en/web-informativa.md   (mismo nombre de archivo = misma pieza traducida)
 */

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(), // una línea, orientada al beneficio
    // web · systems (sistemas a medida) · ai (IA y automatización) · care (mantenimiento)
    group: z.enum(['web', 'systems', 'ai', 'care']),
    order: z.number(),
    priceFrom: z.object({
      pen: z.number(), // Perú (S/)
      usd: z.number(), // exterior (USD)
    }),
    // one-time: pago único · plus-monthly: "+ mensualidad" · monthly: precio por mes
    billing: z.enum(['one-time', 'plus-monthly', 'monthly']).default('one-time'),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    order: z.number(),
    tags: z.array(z.string()).default([]),
    // client: proyecto real para un cliente · demo: demo propia del equipo
    kind: z.enum(['client', 'demo']).default('demo'),
    status: z.enum(['live', 'building']).default('building'),
    url: z.url().optional(), // sitio publicado o demo en línea
    image: z.string().optional(), // captura 16:9 en /public, ej. /portfolio/seyer-peru.webp
    imageAlt: z.string().optional(),
  }),
});

// El equipo no se traduce por archivo: un solo archivo por integrante con el rol en ambos idiomas.
const team = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/team' }),
  schema: z.object({
    name: z.string(),
    role: z.object({ es: z.string(), en: z.string() }),
    order: z.number().default(99),
    photo: z.string().optional(), // ruta en /public, ej. /team/ana.webp
    linkedin: z.url().optional(),
    github: z.url().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { services, projects, team };
