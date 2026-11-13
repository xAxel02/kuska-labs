import { ui, defaultLang, type Lang, type UIKey } from './ui';

export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  return first in ui ? (first as Lang) : defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

/** Ruta de inicio de cada idioma: "/" para español, "/en/" para inglés. */
export const homePath = (lang: Lang) => (lang === defaultLang ? '/' : `/${lang}/`);

/** id de una entrada de contenido sin el prefijo de idioma: "es/web-informativa" -> "web-informativa" */
export const slugOf = (id: string) => id.split('/').slice(1).join('/');

export const formatPrice = (lang: Lang, priceFrom: { pen: number; usd: number }) =>
  lang === 'es'
    ? `S/ ${priceFrom.pen.toLocaleString('en-US')}`
    : `US$ ${priceFrom.usd.toLocaleString('en-US')}`;
