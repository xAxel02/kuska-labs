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

export const whatsappLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
