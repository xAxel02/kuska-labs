/** @jsxImportSource preact */
/**
 * Demo 1 · Sistema de citas para un consultorio.
 * Vista del paciente (reservar en 3 pasos) y panel del consultorio (agenda, ocupación, acciones).
 * Datos ficticios en localStorage; se regeneran cada día para que la agenda siempre sea "actual".
 */
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { load, save, clear, isoDay, addDays, uid } from './store';

type Lang = 'es' | 'en';
type Status = 'booked' | 'done' | 'cancelled';
type Appt = { id: string; day: string; time: string; service: string; name: string; phone: string; status: Status; mine?: boolean };
type Data = { seededOn: string; appts: Appt[] };

const KEY = 'citas-v1';

const T = {
  es: {
    business: 'Sonrisa Dental',
    tabPatient: 'Reservar (paciente)', tabAdmin: 'Panel del consultorio',
    step1: '1. Elige el servicio', step2: '2. Elige día y hora', step3: '3. Tus datos',
    min: 'min', name: 'Nombre y apellido', phone: 'WhatsApp', confirm: 'Confirmar cita',
    needService: 'Elige un servicio.', needSlot: 'Elige un día y una hora.', needName: 'Escribe tu nombre.', needPhone: 'Escribe un número de WhatsApp válido.',
    doneTitle: 'Cita confirmada', reminder: 'Recordatorio que recibirías por WhatsApp un día antes:',
    reminderMsg: (n: string, s: string, d: string, h: string) => `Hola ${n}, te recordamos tu cita de ${s} mañana ${d} a las ${h}. Responde 1 para confirmar o 2 para reprogramar.`,
    another: 'Reservar otra cita', seePanel: 'Ver en el panel',
    agenda: 'Agenda del día', noAppts: 'No hay citas para este día.', attended: 'Atendida', cancel: 'Cancelar', cancelled: 'Cancelada', booked: 'Reservada', you: 'tu reserva',
    kToday: 'Citas del día', kOcc: 'Ocupación del día', kWeek: 'Citas en la semana', kIncome: 'Ingresos estimados (día)',
    reset: 'Reiniciar demo', closed: 'Cerrado',
    services: [
      { id: 'consulta', label: 'Consulta general', dur: 30, price: 60 },
      { id: 'limpieza', label: 'Limpieza dental', dur: 45, price: 120 },
      { id: 'ortodoncia', label: 'Evaluación de ortodoncia', dur: 30, price: 80 },
    ],
    money: (n: number) => `S/ ${n.toLocaleString('en-US')}`,
    names: ['Rosa Quispe', 'Luis Mamani', 'Carla Torres', 'Jorge Huamán', 'Ana Flores', 'Miguel Rojas', 'Lucía Castro', 'Pedro Vargas', 'Sofía Ramos', 'Diego Chávez'],
    dayFmt: (d: Date) => d.toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric', month: 'short' }),
  },
  en: {
    business: 'Bright Smile Dental',
    tabPatient: 'Book (patient)', tabAdmin: 'Clinic dashboard',
    step1: '1. Pick a service', step2: '2. Pick a day and time', step3: '3. Your details',
    min: 'min', name: 'Full name', phone: 'WhatsApp', confirm: 'Confirm appointment',
    needService: 'Pick a service.', needSlot: 'Pick a day and a time.', needName: 'Enter your name.', needPhone: 'Enter a valid WhatsApp number.',
    doneTitle: 'Appointment confirmed', reminder: 'Reminder you would get on WhatsApp the day before:',
    reminderMsg: (n: string, s: string, d: string, h: string) => `Hi ${n}, this is a reminder of your ${s} appointment tomorrow, ${d} at ${h}. Reply 1 to confirm or 2 to reschedule.`,
    another: 'Book another appointment', seePanel: 'See it in the dashboard',
    agenda: 'Daily schedule', noAppts: 'No appointments for this day.', attended: 'Attended', cancel: 'Cancel', cancelled: 'Cancelled', booked: 'Booked', you: 'your booking',
    kToday: 'Appointments today', kOcc: 'Occupancy (day)', kWeek: 'Appointments this week', kIncome: 'Estimated revenue (day)',
    reset: 'Reset demo', closed: 'Closed',
    services: [
      { id: 'consulta', label: 'General check-up', dur: 30, price: 20 },
      { id: 'limpieza', label: 'Teeth cleaning', dur: 45, price: 35 },
      { id: 'ortodoncia', label: 'Orthodontic evaluation', dur: 30, price: 25 },
    ],
    money: (n: number) => `$${n.toLocaleString('en-US')}`,
    names: ['Rose Miller', 'Luis Gomez', 'Carla Torres', 'George Hill', 'Anna Flores', 'Mike Ross', 'Lucy Castro', 'Peter Vance', 'Sophie Reed', 'Diego Chavez'],
    dayFmt: (d: Date) => d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' }),
  },
};

/** Horarios: lunes a viernes 9:00–17:30 (almuerzo 13:00–14:00), sábado 9:00–12:30, domingo cerrado. */
function slotsFor(date: Date): string[] {
  const dow = date.getDay();
  if (dow === 0) return [];
  const end = dow === 6 ? 13 : 18;
  const out: string[] = [];
  for (let h = 9; h < end; h++) {
    if (h === 13) continue;
    out.push(`${String(h).padStart(2, '0')}:00`, `${String(h).padStart(2, '0')}:30`);
  }
  return out;
}

const toMin = (h: string) => Number(h.slice(0, 2)) * 60 + Number(h.slice(3));
const toHHMM = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
/** Turnos de 30 min que ocupa un servicio (una limpieza de 45 min ocupa 2). */
const slotsNeeded = (dur: number) => Math.ceil(dur / 30);
/** Horas ocupadas en un día, contando la duración de cada servicio. */
function occupied(appts: Appt[], day: string, durOf: (id: string) => number): Set<string> {
  const out = new Set<string>();
  for (const a of appts) {
    if (a.day !== day || a.status === 'cancelled') continue;
    for (let k = 0; k < slotsNeeded(durOf(a.service)); k++) out.add(toHHMM(toMin(a.time) + 30 * k));
  }
  return out;
}
/** ¿Se puede empezar a esa hora? Todos los turnos necesarios deben existir (sin cruzar almuerzo ni cierre) y estar libres. */
function canStart(time: string, dur: number, daySlots: string[], taken: Set<string>): boolean {
  for (let k = 0; k < slotsNeeded(dur); k++) {
    const h = toHHMM(toMin(time) + 30 * k);
    if (!daySlots.includes(h) || taken.has(h)) return false;
  }
  return true;
}

/** Próximos 6 días con atención (hoy incluido si aún abre). */
function nextDays(): Date[] {
  const out: Date[] = [];
  let d = new Date();
  while (out.length < 6) {
    if (slotsFor(d).length) out.push(new Date(d));
    d = addDays(d, 1);
  }
  return out;
}

/** Generador pseudoaleatorio determinista para que la agenda de ejemplo sea estable durante el día. */
function rng(seed: number) {
  return () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
}

function seed(lang: Lang): Data {
  const t = T[lang];
  const today = isoDay(new Date());
  const rand = rng(Number(today.replace(/-/g, '')) % 233280);
  const appts: Appt[] = [];
  for (const d of nextDays()) {
    const daySlots = slotsFor(d);
    for (const time of daySlots) {
      if (rand() < 0.42) {
        const svc = t.services[Math.floor(rand() * t.services.length)];
        const taken = occupied(appts, isoDay(d), (id) => t.services.find((x) => x.id === id)!.dur);
        if (!canStart(time, svc.dur, daySlots, taken)) continue;
        appts.push({
          id: uid(), day: isoDay(d), time, service: svc.id,
          name: t.names[Math.floor(rand() * t.names.length)], phone: '9' + String(Math.floor(rand() * 1e8)).padStart(8, '0'),
          status: 'booked',
        });
      }
    }
  }
  return { seededOn: today, appts };
}

export default function Citas({ lang }: { lang: Lang }) {
  const t = T[lang];
  const days = useMemo(nextDays, []);
  const [data, setData] = useState<Data>(() => ({ seededOn: '', appts: [] }));
  const [tab, setTab] = useState<'patient' | 'admin'>('patient');

  // Carga en el cliente (localStorage); si la agenda es de otro día, se regenera.
  useEffect(() => {
    const stored = load<Data | null>(`${KEY}-${lang}`, () => null);
    setData(stored && stored.seededOn === isoDay(new Date()) ? stored : seed(lang));
  }, []);
  useEffect(() => { if (data.seededOn) save(`${KEY}-${lang}`, data); }, [data]);

  const svcOf = (id: string) => t.services.find((s) => s.id === id)!;
  const reset = () => { clear(`${KEY}-${lang}`); setData(seed(lang)); setTab('patient'); };

  return (
    <div class="dm-app">
      <div class="dm-bar">
        <span class="dm-brand"><i aria-hidden="true">SD</i>{t.business}</span>
        <div class="dm-tabs" role="tablist">
          <button role="tab" id="tab-patient" aria-controls="panel-citas" aria-selected={tab === 'patient'} onClick={() => setTab('patient')}>{t.tabPatient}</button>
          <button role="tab" id="tab-admin" aria-controls="panel-citas" aria-selected={tab === 'admin'} onClick={() => setTab('admin')}>{t.tabAdmin}</button>
        </div>
        <button class="dm-btn ghost" onClick={reset}>{t.reset}</button>
      </div>
      <div class="dm-body" id="panel-citas" role="tabpanel" aria-labelledby={tab === 'patient' ? 'tab-patient' : 'tab-admin'}>
        {tab === 'patient' ? (
          <Patient t={t} days={days} data={data} setData={setData} svcOf={svcOf} onSeePanel={() => setTab('admin')} />
        ) : (
          <Admin t={t} days={days} data={data} setData={setData} svcOf={svcOf} />
        )}
      </div>
    </div>
  );
}

type TDict = (typeof T)['es'];

function Patient({ t, days, data, setData, svcOf, onSeePanel }: {
  t: TDict; days: Date[]; data: Data; setData: (fn: (d: Data) => Data) => void; svcOf: (id: string) => TDict['services'][number]; onSeePanel: () => void;
}) {
  const [service, setService] = useState('');
  const [day, setDay] = useState(isoDay(days[0]));
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState<Appt | null>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  const dayDate = days.find((d) => isoDay(d) === day)!;
  const daySlots = slotsFor(dayDate);
  const taken = occupied(data.appts, day, (id) => svcOf(id).dur);
  const dur = service ? svcOf(service).dur : 30;
  const now = new Date();
  const isPast = (hhmm: string) => day === isoDay(now) && hhmm <= `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  useEffect(() => { if (done) doneRef.current?.focus(); }, [done]);

  const submit = (e: Event) => {
    e.preventDefault();
    if (!service) return setError(t.needService);
    if (!time) return setError(t.needSlot);
    if (!name.trim()) return setError(t.needName);
    if (phone.replace(/\D/g, '').length < 7) return setError(t.needPhone);
    const appt: Appt = { id: uid(), day, time, service, name: name.trim(), phone, status: 'booked', mine: true };
    setData((d) => ({ ...d, appts: [...d.appts, appt] }));
    setDone(appt);
    setError('');
  };

  if (done) {
    const s = svcOf(done.service);
    const dd = t.dayFmt(days.find((d) => isoDay(d) === done.day)!);
    return (
      <div class="dm-grid dm-enter" ref={doneRef} tabIndex={-1} style="outline:none">
        <div class="dm-toast" role="status"><b>{t.doneTitle}:</b> {s.label} · {dd} · {done.time}</div>
        <div class="dm-panel">
          <p class="dm-muted" style="margin-bottom:0.6rem">{t.reminder}</p>
          <p class="wa-bubble">{t.reminderMsg(done.name.split(' ')[0], s.label.toLowerCase(), dd, done.time)}</p>
        </div>
        <div class="dm-chips">
          <button class="dm-btn primary" onClick={() => { setDone(null); setTime(''); setService(''); setName(''); setPhone(''); }}>{t.another}</button>
          <button class="dm-btn" onClick={onSeePanel}>{t.seePanel}</button>
        </div>
      </div>
    );
  }

  return (
    <form class="dm-grid" onSubmit={submit} noValidate>
      <fieldset class="dm-panel">
        <legend class="dm-legend">{t.step1}</legend>
        <div class="dm-chips">
          {t.services.map((s) => (
            <button type="button" class="dm-chip" aria-pressed={service === s.id} onClick={() => { setService(s.id); setError(''); if (time && !canStart(time, s.dur, daySlots, taken)) setTime(''); }}>
              {s.label}<small>{s.dur} {t.min} · {t.money(s.price)}</small>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset class="dm-panel">
        <legend class="dm-legend">{t.step2}</legend>
        <div class="dm-chips" style="margin-bottom:0.9rem">
          {days.map((d) => (
            <button type="button" class="dm-chip" aria-pressed={day === isoDay(d)} onClick={() => { setDay(isoDay(d)); setTime(''); }}>
              {t.dayFmt(d)}
            </button>
          ))}
        </div>
        <div class="dm-chips slots">
          {daySlots.map((h) => {
            const off = !canStart(h, dur, daySlots, taken) || isPast(h);
            return (
              <button type="button" class="dm-chip" disabled={off} aria-pressed={time === h} onClick={() => { setTime(h); setError(''); }}>
                {h}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset class="dm-panel">
        <legend class="dm-legend">{t.step3}</legend>
        <div class="dm-grid two">
          <div class="dm-field">
            <label for="ct-name">{t.name}</label>
            <input id="ct-name" class="dm-input" value={name} onInput={(e) => setName((e.target as HTMLInputElement).value)} autoComplete="name" />
          </div>
          <div class="dm-field">
            <label for="ct-phone">{t.phone}</label>
            <input id="ct-phone" class="dm-input" inputMode="tel" value={phone} onInput={(e) => setPhone((e.target as HTMLInputElement).value)} autoComplete="tel" />
          </div>
        </div>
      </fieldset>

      {error && <p class="dm-error" role="alert">{error}</p>}
      <div><button type="submit" class="dm-btn primary">{t.confirm}</button></div>
    </form>
  );
}

function Admin({ t, days, data, setData, svcOf }: {
  t: TDict; days: Date[]; data: Data; setData: (fn: (d: Data) => Data) => void; svcOf: (id: string) => TDict['services'][number];
}) {
  const mineDay = data.appts.find((a) => a.mine && a.status === 'booked')?.day;
  const [day, setDay] = useState(mineDay ?? isoDay(days[0]));
  const dayDate = days.find((d) => isoDay(d) === day) ?? days[0];
  const list = data.appts.filter((a) => a.day === day).sort((a, b) => a.time.localeCompare(b.time));
  const active = list.filter((a) => a.status !== 'cancelled');
  const slots = slotsFor(dayDate).length;
  const week = data.appts.filter((a) => a.status !== 'cancelled').length;
  const income = active.reduce((sum, a) => sum + svcOf(a.service).price, 0);

  const setStatus = (id: string, status: Status) =>
    setData((d) => ({ ...d, appts: d.appts.map((a) => (a.id === id ? { ...a, status } : a)) }));

  return (
    <div class="dm-grid">
      <div class="dm-chips">
        {days.map((d) => (
          <button type="button" class="dm-chip" aria-pressed={day === isoDay(d)} onClick={() => setDay(isoDay(d))}>{t.dayFmt(d)}</button>
        ))}
      </div>
      <div class="dm-kpis">
        <div class="dm-kpi"><span>{t.kToday}</span><strong>{active.length}</strong></div>
        <div class="dm-kpi gold"><span>{t.kOcc}</span><strong>{slots ? Math.round((occupied(data.appts, day, (id) => svcOf(id).dur).size / slots) * 100) : 0} %</strong></div>
        <div class="dm-kpi"><span>{t.kWeek}</span><strong>{week}</strong></div>
        <div class="dm-kpi"><span>{t.kIncome}</span><strong>{t.money(income)}</strong></div>
      </div>
      <div class="dm-panel">
        <h2>{t.agenda}</h2>
        {list.length === 0 ? (
          <p class="dm-muted">{t.noAppts}</p>
        ) : (
          <div class="dm-table-wrap">
            <table class="dm-table">
              <tbody>
                {list.map((a) => (
                  <tr class={a.mine ? 'mine' : ''}>
                    <td style="width:4.5rem;color:var(--color-text);font-variant-numeric:tabular-nums">{a.time}</td>
                    <td>
                      <span style="color:var(--color-text)">{a.name}</span>
                      {a.mine && <> <span class="dm-badge gold">{t.you}</span></>}
                      <br /><span class="dm-muted">{svcOf(a.service).label}</span>
                    </td>
                    <td>
                      <span class={`dm-badge ${a.status === 'done' ? 'ok' : a.status === 'cancelled' ? 'muted' : 'gold'}`}>
                        {a.status === 'done' ? t.attended : a.status === 'cancelled' ? t.cancelled : t.booked}
                      </span>
                    </td>
                    <td class="num">
                      {a.status === 'booked' && (
                        <span class="dm-chips" style="justify-content:flex-end">
                          <button class="dm-btn" onClick={() => setStatus(a.id, 'done')}>{t.attended}</button>
                          <button class="dm-btn ghost" onClick={() => setStatus(a.id, 'cancelled')}>{t.cancel}</button>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
