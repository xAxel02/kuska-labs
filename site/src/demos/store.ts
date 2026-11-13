/**
 * Persistencia de las demos: localStorage del visitante (datos ficticios, nunca salen del navegador).
 * Todas las lecturas/escrituras toleran modo privado o almacenamiento bloqueado.
 */
const PREFIX = 'kuska-demo:';

export function load<T>(key: string, fallback: () => T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    /* sin almacenamiento: se usa el valor inicial */
  }
  return fallback();
}

export function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* sin almacenamiento: la demo funciona igual, pero no recuerda los cambios */
  }
}

export function clear(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    /* nada que hacer */
  }
}

/** Fecha local en formato YYYY-MM-DD (sin desfases por zona horaria). */
export function isoDay(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

export const uid = () => Math.random().toString(36).slice(2, 9);
