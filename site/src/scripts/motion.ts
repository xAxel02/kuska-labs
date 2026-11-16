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

/** Fine-pointer attraction; returns a disposer for reusable mounts. */
export function magnetic(el: HTMLElement) {
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const reset = () => { el.style.translate = ''; };
  const move = (event: PointerEvent) => {
    if (!fine.matches || prefersReducedMotion() || event.pointerType === 'touch' || el.matches(':disabled, :focus-visible')) { reset(); return; }
    const rect = el.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    const distance = Math.hypot(Math.max(0, Math.abs(x) - rect.width / 2), Math.max(0, Math.abs(y) - rect.height / 2));
    const strength = Math.max(0, 1 - distance / 80);
    const length = Math.max(1, Math.hypot(x, y));
    el.style.translate = `${x / length * 8 * strength}px ${y / length * 8 * strength}px`;
  };
  document.addEventListener('pointermove', move, { passive: true });
  document.addEventListener('pointerleave', reset);
  el.addEventListener('focus', reset);
  fine.addEventListener('change', reset);
  const unsubscribe = onReducedMotionChange(reset);
  return () => {
    document.removeEventListener('pointermove', move);
    document.removeEventListener('pointerleave', reset);
    el.removeEventListener('focus', reset);
    fine.removeEventListener('change', reset);
    unsubscribe(); reset();
  };
}

export function tilt(el: HTMLElement) {
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const reset = () => { el.style.removeProperty('--tilt-x'); el.style.removeProperty('--tilt-y'); el.style.removeProperty('--shadow-x'); };
  el.addEventListener('pointermove', (event) => {
    if (!fine.matches || prefersReducedMotion() || event.pointerType === 'touch') { reset(); return; }
    const rect = el.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
    const y = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
    el.style.setProperty('--tilt-x', `${-y * 4}deg`);
    el.style.setProperty('--tilt-y', `${x * 4}deg`);
    el.style.setProperty('--shadow-x', `${-x * 12}px`);
  });
  el.addEventListener('pointerleave', reset);
  fine.addEventListener('change', reset);
  onReducedMotionChange(reset);
}
