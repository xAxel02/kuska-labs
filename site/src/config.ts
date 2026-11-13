/**
 * Configuración general del sitio. Los valores marcados con TODO
 * están pendientes de decisión del equipo.
 */

// URL pública del sitio (canonical, sitemap, imágenes para redes).
// TODO: al tener dominio, cambiar a 'https://kuskalabs.com' (o .pe).
export const SITE_URL = 'https://kuska-labs-web.renatovr25.workers.dev';

export const BRAND = 'Kuska Labs';

// WhatsApp del equipo en formato internacional, sin "+" ni espacios
export const WHATSAPP_NUMBER = '51960098421'; // +51 960 098 421

// Correo del equipo (Gmail compartido)
export const CONTACT_EMAIL = 'kuskalabs.pe@gmail.com'; // cuando haya dominio: hola@kuskalabs.com (reenvía a este Gmail)

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

export const whatsappLink =(message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
