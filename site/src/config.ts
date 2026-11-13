/**
 * Configuración general del sitio. Los valores marcados con TODO
 * están pendientes de decisión del equipo.
 */

// TODO: confirmar dominio (kuskalabs.com / kuskalabs.pe)
export const SITE_URL = 'https://kuskalabs.com';

export const BRAND = 'Kuska Labs';

// TODO: número real de WhatsApp en formato internacional, sin "+" ni espacios (ej. 51987654321)
export const WHATSAPP_NUMBER = '51900000000';

// TODO: correo de contacto
export const CONTACT_EMAIL = 'hola@kuskalabs.com';

// Decisión pendiente: ¿mostramos precios "desde ..."? Cambiar a true para mostrarlos.
export const SHOW_PRICES = false;

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
