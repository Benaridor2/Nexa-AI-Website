import { useEffect, useRef } from 'react';

// The seed. NEXA's tile, the same one that sits in the middle of the
// connection panel, waits beside the How-it-works heading, in the empty
// column above the stage. Over the last half screen of scrolling before
// the stage sticks, it slides down into its place on the stage's line, the
// NEXA node between the guest's AI and your PMS, shrinking as it goes; then
// the node's own mark takes over. Scrubbed by the scroll, so it comes back
// up the same way. Short, inside its own section, in its own lane, never
// over the text. Under reduced motion and on phones it stays a still.
const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => (t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export function useTraveler(enabled: boolean) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const seed = ref.current;
    const hiw = seed?.closest<HTMLElement>('.hiw');
    const stage = hiw?.querySelector<HTMLElement>('.hiw-stage');
    const target = hiw?.querySelector<HTMLElement>('.hiw-mark');
    if (!seed || !hiw || !stage || !target) return;
    if (!enabled || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    let state = '';
    const set = (s: 'home' | 'flying' | 'landed') => { if (s === state) return; state = s; hiw.dataset.seed = s; };
    const measure = () => {
      frame = 0;
      if (innerWidth < 1000) { seed.style.transform = ''; set('landed'); return; }
      const stickyTop = Math.max(80, innerHeight / 2 - 260);
      const st = stage.getBoundingClientRect();
      const tr = target.getBoundingClientRect();
      // The seed rests until the stage is half a screen from sticking, then travels with the scroll.
      const endY = scrollY + st.top - stickyTop;
      const span = Math.round(innerHeight * .5);
      const p = clamp((scrollY - (endY - span)) / span);
      if (p <= 0) { seed.style.transform = ''; set('home'); return; }
      if (p >= 1) { set('landed'); return; }
      seed.style.transform = '';
      const sr = seed.getBoundingClientRect();
      const e = ease(p);
      const dx = (tr.left + tr.width / 2) - (sr.left + sr.width / 2);
      const dy = (tr.top + tr.height / 2) - (sr.top + sr.height / 2);
      const scale = 1 + (tr.height / sr.height - 1) * e;
      seed.style.transform = `translate(${(dx * e).toFixed(1)}px, ${(dy * e).toFixed(1)}px) scale(${scale.toFixed(3)})`;
      set('flying');
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      delete hiw.dataset.seed; seed.style.transform = '';
    };
  }, [enabled]);
  return ref;
}
