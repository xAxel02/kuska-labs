/**
 * Worker de Kuska Labs.
 * - POST /api/contacto: recibe el formulario, valida Turnstile, guarda el lead en D1 y avisa por correo al equipo.
 * - Todo lo demás: archivos estáticos generados por Astro (binding ASSETS).
 *
 * Variables / bindings (ver wrangler.jsonc y site/README.md):
 *   TURNSTILE_SECRET  (secreto)  clave secreta de Turnstile
 *   MAIL_FROM          (var)      remitente en el dominio con Email Routing, ej. web@kuskalabs.com
 *   MAIL_TO            (var)      destino verificado en Email Routing (el Gmail del equipo)
 *   DB                 (D1)       base de datos de leads (opcional, pero recomendado)
 *   EMAIL              (send_email)
 */
import { EmailMessage } from 'cloudflare:email';

interface Env {
  ASSETS: Fetcher;
  DB?: D1Database;
  EMAIL?: SendEmail;
  TURNSTILE_SECRET?: string;
  MAIL_FROM?: string;
  MAIL_TO?: string;
  CANONICAL_HOST?: string;
  LEGACY_HOST?: string;
}

type Lead = {
  name: string;
  contact: string;
  business: string;
  message: string;
  lang: 'es' | 'en';
};

const LIMITS = { name: 120, contact: 160, business: 160, message: 4000 };

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Un solo dominio público: www.kuskalabs.com y la URL antigua de workers.dev redirigen (301)
    // a https://kuskalabs.com conservando ruta y parámetros (enlaces compartidos y SEO).
    const canonical = env.CANONICAL_HOST;
    if (canonical && (url.hostname === `www.${canonical}` || url.hostname === env.LEGACY_HOST)) {
      return Response.redirect(`https://${canonical}${url.pathname}${url.search}`, 301);
    }

    if (url.pathname === '/api/contacto') {
      if (request.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405);
      return handleContact(request, env, ctx);
    }
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;

async function handleContact(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  // Mismo origen: evita que otros sitios usen el endpoint
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) return json({ ok: false, error: 'forbidden' }, 403);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, error: 'bad_request' }, 400);
  }

  // Honeypot: campo oculto que solo llenan los bots. No se descarta en silencio: si llega lleno,
  // el lead se guarda como "spam" (sin aviso por correo) para que el equipo pueda revisarlo.
  const suspicious = Boolean(str(form.get('kl_hp')));

  const lead: Lead = {
    name: str(form.get('name')).slice(0, LIMITS.name),
    contact: str(form.get('contact')).slice(0, LIMITS.contact),
    business: str(form.get('business')).slice(0, LIMITS.business),
    message: str(form.get('message')).slice(0, LIMITS.message),
    lang: str(form.get('lang')) === 'en' ? 'en' : 'es',
  };
  const consent = str(form.get('consent')) === 'yes';

  if (!lead.name || !lead.contact || !lead.message || !consent) {
    return json({ ok: false, error: 'missing_fields' }, 422);
  }

  // Antispam: Cloudflare Turnstile
  const ip = request.headers.get('CF-Connecting-IP') ?? '';
  const human = await verifyTurnstile(str(form.get('cf-turnstile-response')), ip, env.TURNSTILE_SECRET);
  if (!human) {
    console.warn(JSON.stringify({ event: 'lead-rejected', reason: 'captcha' }));
    return json({ ok: false, error: 'captcha' }, 403);
  }

  const country = (request as Request & { cf?: { country?: string } }).cf?.country ?? '';
  const userAgent = (request.headers.get('User-Agent') ?? '').slice(0, 300);

  // 1) Guardar el lead (respaldo por si el correo falla)
  let leadId: number | null = null;
  if (env.DB) {
    try {
      const row = await env.DB.prepare(
        `INSERT INTO leads (name, contact, business, message, lang, country, user_agent, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,
      )
        .bind(lead.name, lead.contact, lead.business, lead.message, lead.lang, country, userAgent, suspicious ? 'spam' : 'nuevo')
        .first<{ id: number }>();
      leadId = row?.id ?? null;
    } catch (err) {
      console.error('D1 insert failed', err);
    }
  }

  // 2) Avisar al equipo por correo
  let emailed = false;
  if (!suspicious && env.EMAIL && env.MAIL_FROM && env.MAIL_TO) {
    try {
      const raw = buildEmail(lead, country, env.MAIL_FROM, env.MAIL_TO);
      await env.EMAIL.send(new EmailMessage(env.MAIL_FROM, env.MAIL_TO, raw));
      emailed = true;
    } catch (err) {
      console.error('Email send failed', err);
    }
  }

  if (leadId !== null && env.DB) {
    ctx.waitUntil(
      env.DB.prepare('UPDATE leads SET email_sent = ? WHERE id = ?').bind(emailed ? 1 : 0, leadId).run().then(() => {}),
    );
  }

  console.log(JSON.stringify({ event: 'lead', id: leadId, emailed, suspicious, lang: lead.lang, country }));

  // Si no se pudo guardar ni enviar, el visitante debe usar WhatsApp
  if (leadId === null && !emailed) return json({ ok: false, error: 'unavailable' }, 503);
  return json({ ok: true });
}

async function verifyTurnstile(token: string, ip: string, secret?: string): Promise<boolean> {
  if (!secret || !token) return false;
  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.error('Turnstile verify failed', err);
    return false;
  }
}

function buildEmail(lead: Lead, country: string, from: string, to: string): string {
  const subject = `Nuevo diagnóstico: ${lead.name}${lead.business ? ` (${lead.business})` : ''}`;
  const text = [
    'Nuevo mensaje desde el formulario de kuskalabs.com',
    '',
    `Nombre:   ${lead.name}`,
    `Contacto: ${lead.contact}`,
    `Negocio:  ${lead.business || '-'}`,
    `Idioma:   ${lead.lang === 'en' ? 'inglés' : 'español'}`,
    `País:     ${country || '-'}`,
    '',
    'Mensaje:',
    lead.message,
    '',
    '—',
    'Respondan en menos de 24 h. El lead también quedó guardado en la base de datos (D1).',
  ].join('\r\n');

  const domain = from.split('@')[1] ?? 'kuskalabs.com';
  const replyTo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.contact) ? lead.contact : null;
  const headers = [
    `From: "Web Kuska Labs" <${from}>`,
    `To: <${to}>`,
    replyTo ? `Reply-To: <${replyTo}>` : null,
    `Subject: =?UTF-8?B?${b64(subject)}?=`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${crypto.randomUUID()}@${domain}>`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
  ].filter(Boolean);

  const body = b64(text).replace(/.{1,76}/g, '$&\r\n');
  return `${headers.join('\r\n')}\r\n\r\n${body}`;
}

function b64(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function str(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}
