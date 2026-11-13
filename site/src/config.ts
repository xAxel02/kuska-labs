/**
 * Configuración general del sitio. Los valores marcados con TODO
 * están pendientes de decisión del equipo.
 */

// URL pública del sitio (canonical, sitemap, imágenes para redes).
// Dominio propio (comprado el 2026-11-13). La URL antigua de workers.dev redirige aquí.
export const SITE_URL = 'https://kuskalabs.com';

export const BRAND = 'Kuska Labs';

// WhatsApp del equipo en formato internacional, sin "+" ni espacios
export const WHATSAPP_NUMBER = '51960098421'; // +51 960 098 421

// Correo del equipo (Gmail compartido)
export const CONTACT_EMAIL = 'hola@kuskalabs.com'; // reenvía a kuskalabs.pe@gmail.com (Email Routing)

// Precios referenciales "desde ..." (soles en español, dólares en inglés). false = ocultarlos.
export const SHOW_PRICES = true;

/**
 * Formulario: si hay clave pública de Turnstile, el formulario se envía a /api/contacto
 * (Worker de Cloudflare -> D1 + correo). Si no, abre WhatsApp con el mensaje armado.
 * Se configura con variables de entorno (ver .env.example).
 */
export const TURNSTILE_SITE_KEY: string = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ?? '';
export const CONTACT_ENDPOINT = '/api/contacto';

/** Analítica sin cookies (Umami). Sin ID, no se carga ningún script. */
export const UMAMI_WEBSITE_ID: string = import.meta.env.PUBLIC_UMAMI_WEBSITE_ID ?? '';
export const UMAMI_SCRIPT_URL: string = import.meta.env.PUBLIC_UMAMI_SCRIPT_URL || 'https://cloud.umami.is/script.js';
/** Umami solo cuenta visitas en el dominio público (no en localhost ni en vistas previas). */
export const UMAMI_DOMAINS = new URL(SITE_URL).hostname;

/** Código de verificación de Google Search Console (método "etiqueta HTML"). Vacío = no se agrega. */
export const GOOGLE_SITE_VERIFICATION: string = import.meta.env.PUBLIC_GOOGLE_SITE_VERIFICATION ?? '';

export const whatsappLink =(message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
