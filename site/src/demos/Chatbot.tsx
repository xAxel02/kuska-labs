/** @jsxImportSource preact */
/**
 * Demo 3 · Chatbot de WhatsApp para un salón de belleza.
 * Asistente guiado (intenciones por palabras clave + flujo de reserva). No usa IA real:
 * en un proyecto real se conecta a la API de WhatsApp Business y, si se desea, a un modelo de IA.
 * A la derecha, el panel muestra lo que el negocio recibe en tiempo real.
 */
import { useEffect, useRef, useState } from 'preact/hooks';
import { addDays } from './store';

type Lang = 'es' | 'en';
type Msg = { from: 'user' | 'bot'; text: string };
type Event = { kind: 'lead' | 'intent' | 'booking' | 'handoff'; text: string };
type Step = 'menu' | 'service' | 'day' | 'time' | 'name';

const T = {
  es: {
    business: 'Salón Inti', online: 'en línea', placeholder: 'Escribe un mensaje', send: 'Enviar', restart: 'Reiniciar chat',
    panel: 'Lo que ve el negocio', panelEmpty: 'Aquí aparecerán los contactos, reservas y alertas que genera el chat.',
    typing: 'escribiendo…',
    greet: '¡Hola! Soy el asistente de Salón Inti. ¿En qué te ayudo?',
    menu: ['Horarios', 'Precios', 'Reservar cita', 'Hablar con una persona'],
    hours: 'Atendemos de lunes a sábado de 9:00 a 20:00 y los domingos de 10:00 a 14:00.',
    prices: 'Corte: S/ 35 · Tinte: S/ 90 · Manicure: S/ 30. ¿Quieres reservar?',
    where: 'Estamos en Av. Larco 345, Miraflores, a una cuadra del parque Kennedy.',
    thanks: '¡Con gusto! Si necesitas algo más, aquí estoy.',
    human: 'Listo, una persona del salón te escribirá en unos minutos por este mismo chat.',
    fallback: 'No te entendí del todo. Puedes elegir una opción:',
    askService: '¿Qué servicio deseas?', services: ['Corte · S/ 35', 'Tinte · S/ 90', 'Manicure · S/ 30'],
    askDay: '¿Para qué día?', dayLabels: ['Hoy', 'Mañana', 'Pasado mañana'],
    askTime: 'Tengo estos horarios libres:', times: ['10:30', '15:00', '18:30'],
    askName: '¿A nombre de quién reservo?',
    booked: (n: string, s: string, d: string, h: string) => `¡Listo, ${n}! Tu cita de ${s} quedó reservada para ${d} a las ${h}. Te enviaré un recordatorio el día anterior.`,
    ev: {
      lead: 'Nuevo contacto en WhatsApp', intent: (i: string) => `Consulta: ${i}`,
      booking: (n: string, s: string, d: string, h: string) => `Cita creada: ${n} · ${s} · ${d} ${h}`, handoff: 'Pide hablar con una persona: asignar a recepción',
    },
    intents: { hours: 'horarios', prices: 'precios', where: 'ubicación', book: 'reserva' },
    kw: {
      greet: ['hola', 'buenas', 'buen dia', 'buenos'], hours: ['horario', 'hora', 'abren', 'atienden', 'abierto'],
      prices: ['precio', 'cuanto', 'cuesta', 'costo', 'tarifa'], book: ['reserv', 'cita', 'turno', 'agend'],
      human: ['persona', 'humano', 'asesor', 'alguien', 'llamar'], where: ['donde', 'direccion', 'ubica', 'local'], thanks: ['gracias'],
    },
    dayFmt: (d: Date) => d.toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' }),
    suggest: 'Prueba escribir: «¿cuánto cuesta un corte?» o «quiero una cita».',
  },
  en: {
    business: 'Inti Salon', online: 'online', placeholder: 'Type a message', send: 'Send', restart: 'Restart chat',
    panel: 'What the business sees', panelEmpty: 'Contacts, bookings and alerts created by the chat will show up here.',
    typing: 'typing…',
    greet: "Hi! I'm Inti Salon's assistant. How can I help?",
    menu: ['Opening hours', 'Prices', 'Book an appointment', 'Talk to a person'],
    hours: "We're open Monday to Saturday 9 am–8 pm and Sundays 10 am–2 pm.",
    prices: 'Haircut: $12 · Color: $30 · Manicure: $10. Would you like to book?',
    where: "We're at 345 Larco Ave, Miraflores, one block from Kennedy Park.",
    thanks: "You're welcome! I'm here if you need anything else.",
    human: 'Done, someone from the salon will message you here in a few minutes.',
    fallback: "I didn't quite get that. You can pick an option:",
    askService: 'Which service would you like?', services: ['Haircut · $12', 'Color · $30', 'Manicure · $10'],
    askDay: 'For which day?', dayLabels: ['Today', 'Tomorrow', 'Day after tomorrow'],
    askTime: 'These times are available:', times: ['10:30', '15:00', '18:30'],
    askName: 'What name should I book it under?',
    booked: (n: string, s: string, d: string, h: string) => `All set, ${n}! Your ${s} is booked for ${d} at ${h}. I'll send you a reminder the day before.`,
    ev: {
      lead: 'New WhatsApp contact', intent: (i: string) => `Question about: ${i}`,
      booking: (n: string, s: string, d: string, h: string) => `Booking created: ${n} · ${s} · ${d} ${h}`, handoff: 'Wants to talk to a person: assign to front desk',
    },
    intents: { hours: 'opening hours', prices: 'prices', where: 'location', book: 'booking' },
    kw: {
      greet: ['hi', 'hello', 'hey', 'good morning'], hours: ['hour', 'open', 'close', 'time'],
      prices: ['price', 'cost', 'how much', 'rate'], book: ['book', 'appointment', 'schedule', 'reserv'],
      human: ['person', 'human', 'agent', 'someone', 'call'], where: ['where', 'address', 'location'], thanks: ['thank'],
    },
    dayFmt: (d: Date) => d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
    suggest: 'Try typing: "how much is a haircut?" or "I want an appointment".',
  },
};

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export default function Chatbot({ lang }: { lang: Lang }) {
  const t = T[lang];
  const [msgs, setMsgs] = useState<Msg[]>([{ from: 'bot', text: t.greet }]);
  const [quick, setQuick] = useState<string[]>(t.menu);
  const [events, setEvents] = useState<Event[]>([]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState('');
  const step = useRef<Step>('menu');
  const booking = useRef<{ service?: string; day?: string; time?: string }>({});
  const known = useRef(false);
  const scroller = useRef<HTMLDivElement>(null);
  const timer = useRef<number>(0);

  useEffect(() => { scroller.current?.scrollTo({ top: scroller.current.scrollHeight }); }, [msgs, typing]);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const log = (e: Event) => setEvents((ev) => [e, ...ev]);

  const botSay = (texts: string[], replies: string[]) => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTyping(true);
    setQuick([]);
    timer.current = window.setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, ...texts.map((text) => ({ from: 'bot' as const, text }))]);
      setQuick(replies);
    }, reduce ? 150 : 650 + Math.min(texts.join(' ').length * 8, 900));
  };

  const has = (text: string, words: string[]) => words.some((w) => text.includes(norm(w)));

  const handle = (raw: string) => {
    const text = raw.trim();
    if (!text || typing) return;
    setMsgs((m) => [...m, { from: 'user', text }]);
    setInput('');
    if (!known.current) { known.current = true; log({ kind: 'lead', text: t.ev.lead }); }
    const n = norm(text);

    // Flujo de reserva paso a paso
    if (step.current === 'service') {
      const s = t.services.find((x) => norm(x).startsWith(n.slice(0, 4))) ?? t.services.find((x) => n.includes(norm(x.split(' ')[0])));
      if (!s) return botSay([t.askService], t.services);
      booking.current.service = s.split(' · ')[0];
      step.current = 'day';
      return botSay([t.askDay], t.dayLabels);
    }
    if (step.current === 'day') {
      const i = t.dayLabels.findIndex((d) => norm(d) === n);
      if (i < 0) return botSay([t.askDay], t.dayLabels);
      booking.current.day = t.dayFmt(addDays(new Date(), i));
      step.current = 'time';
      return botSay([t.askTime], t.times);
    }
    if (step.current === 'time') {
      const h = t.times.find((x) => n.includes(x.replace(':', '')) || n.includes(x));
      if (!h) return botSay([t.askTime], t.times);
      booking.current.time = h;
      step.current = 'name';
      return botSay([t.askName], []);
    }
    if (step.current === 'name') {
      const name = text.split(' ').slice(0, 2).join(' ');
      const { service = '', day = '', time = '' } = booking.current;
      log({ kind: 'booking', text: t.ev.booking(name, service, day, time) });
      step.current = 'menu';
      booking.current = {};
      return botSay([t.booked(name.split(' ')[0], service.toLowerCase(), day, time)], t.menu);
    }

    // Intenciones generales
    const k = t.kw;
    if (has(n, k.book) || n === norm(t.menu[2])) {
      log({ kind: 'intent', text: t.ev.intent(t.intents.book) });
      step.current = 'service';
      return botSay([t.askService], t.services);
    }
    if (has(n, k.human) || n === norm(t.menu[3])) { log({ kind: 'handoff', text: t.ev.handoff }); return botSay([t.human], []); }
    if (has(n, k.prices) || n === norm(t.menu[1])) { log({ kind: 'intent', text: t.ev.intent(t.intents.prices) }); return botSay([t.prices], [t.menu[2], t.menu[0]]); }
    if (has(n, k.hours) || n === norm(t.menu[0])) { log({ kind: 'intent', text: t.ev.intent(t.intents.hours) }); return botSay([t.hours], [t.menu[2], t.menu[1]]); }
    if (has(n, k.where)) { log({ kind: 'intent', text: t.ev.intent(t.intents.where) }); return botSay([t.where], t.menu); }
    if (has(n, k.thanks)) return botSay([t.thanks], t.menu);
    if (has(n, k.greet)) return botSay([t.greet], t.menu);
    return botSay([t.fallback], t.menu);
  };

  const restart = () => {
    window.clearTimeout(timer.current);
    setMsgs([{ from: 'bot', text: t.greet }]);
    setQuick(t.menu);
    setEvents([]);
    setTyping(false);
    step.current = 'menu';
    booking.current = {};
    known.current = false;
  };

  return (
    <div class="cb-layout">
      <div class="cb-phone">
        <div class="cb-head">
          <span class="cb-avatar" aria-hidden="true">SI</span>
          <div><strong>{t.business}</strong><span>{typing ? t.typing : t.online}</span></div>
          <button class="dm-btn ghost cb-restart" onClick={restart}>{t.restart}</button>
        </div>
        <div class="cb-msgs" ref={scroller} role="log" aria-live="polite" aria-label={t.business}>
          {msgs.map((m) => <p class={`cb-msg ${m.from}`}>{m.text}</p>)}
          {typing && <span class="cb-typing" aria-hidden="true"><i /><i /><i /></span>}
        </div>
        {quick.length > 0 && (
          <div class="cb-quick">
            {quick.map((q) => <button type="button" onClick={() => handle(q)}>{q}</button>)}
          </div>
        )}
        <form class="cb-input" onSubmit={(e) => { e.preventDefault(); handle(input); }}>
          <label class="sr-only" for="cb-text">{t.placeholder}</label>
          <input id="cb-text" value={input} placeholder={t.placeholder} autoComplete="off" onInput={(e) => setInput((e.target as HTMLInputElement).value)} />
          <button type="submit" aria-label={t.send}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l16-8-6 16-2-6z" /></svg>
          </button>
        </form>
        <p class="cb-suggest">{t.suggest}</p>
      </div>

      <div class="dm-panel cb-panel">
        <h2>{t.panel}</h2>
        {events.length === 0 ? <p class="dm-muted">{t.panelEmpty}</p> : (
          <ul class="cb-events" role="list">
            {events.map((e) => (
              <li class={`dm-enter ${e.kind}`}>
                <span class={`dm-badge ${e.kind === 'booking' ? 'ok' : e.kind === 'handoff' ? 'warn' : 'gold'}`}>
                  {e.kind === 'lead' ? '●' : e.kind === 'booking' ? '✓' : e.kind === 'handoff' ? '!' : '?'}
                </span>
                {e.text}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
