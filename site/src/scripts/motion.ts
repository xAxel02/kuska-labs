const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

export const prefersReducedMotion = () => reducedMotion.matches;
export function onReducedMotionChange(cb: (reduced: boolean) => void) {
  const listener = (event: MediaQueryListEvent) => cb(event.matches);
  reducedMotion.addEventListener('change', listener);
  return () => reducedMotion.removeEventListener('change', listener);
}

export const supportsScrollTimeline = CSS.supports('animation-timeline: scroll()');

export function observeReveal(selector: string) {
  const targets = document.querySelectorAll<HTMLElement>(selector);
  const showAll = () => targets.forEach((el) => el.classList.add('is-in'));
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) { showAll(); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  targets.forEach((el) => { el.classList.add('reveal-ready'); io.observe(el); });
  onReducedMotionChange((reduced) => { if (reduced) { io.disconnect(); showAll(); } });
}
