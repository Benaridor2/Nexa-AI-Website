import { useEffect, useRef } from 'react';

// The seed. NEXA's tile, the same one that sits in the middle of the
// connection panel, has a second home in [01]: the Priced column, beside the
// word "Priced.", placed on the exact vertical line of the NEXA node on the
// How-it-works stage below. As the reader scrolls on, the tile lifts off and
// hangs at the exact height where that node will sit, while the rest of [01],
// the statement and the [02] heading pass under it; the stage rises to meet
// it and, in the last stretch, the tile shrinks into the mark inside the NEXA
// node, which takes over. Scrubbed by the scroll, so it climbs back the same way. The column
// keeps a dashed outline where it left. Under 1000px and under reduced
// motion the tile stays a still in the column and the mark is simply there.
const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => (t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export function useTraveler(enabled: boolean) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const seed = ref.current;
    const home = document.querySelector<HTMLElement>('.seed-home');
    const frame_ = home?.closest<HTMLElement>('.compare');
    const hiw = document.querySelector<HTMLElement>('.hiw');
    const stage = hiw?.querySelector<HTMLElement>('.hiw-stage');
    const target = hiw?.querySelector<HTMLElement>('.hiw-mark');
    if (!seed || !home || !frame_ || !hiw || !stage || !target) return;
    const still = !enabled || matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    let state = '';
    const set = (s: 'home' | 'flying' | 'landed' | 'still') => {
      if (s === state) return;
      state = s;
      frame_.dataset.seed = s; hiw.dataset.seed = s; seed.dataset.seed = s;
    };
    const place = () => {
      // The home sits on the node's vertical line: same centre x as the mark.
      const tr = target.getBoundingClientRect();
      const head = home.parentElement!.getBoundingClientRect();
      home.style.setProperty('--seed-x', `${(tr.left + tr.width / 2 - head.left - home.offsetWidth / 2).toFixed(1)}px`);
    };
    const measure = () => {
      frame = 0;
      if (still || innerWidth < 1000) { place(); set('still'); return; }
      place();
      const stickyTop = Math.max(80, innerHeight / 2 - 260);
      const hr = home.getBoundingClientRect();
      const st = stage.getBoundingClientRect();
      const tr = target.getBoundingClientRect();
      // The tile hangs exactly where the mark will be once the stage sticks:
      // the page scrolls under it, the node rises to meet it, and only in the
      // last stretch does the tile shrink into the mark.
      const holdY = stickyTop + (tr.top - st.top) + tr.height / 2;
      const startY = scrollY + hr.top + hr.height / 2 - holdY;
      const endY = scrollY + st.top - stickyTop;
      const p = endY <= startY ? 1 : clamp((scrollY - startY) / (endY - startY));
      if (p <= 0) { set('home'); return; }
      if (p >= 1) { set('landed'); return; }
      const shrink = ease(clamp((p - .7) / .3));
      const cx = tr.left + tr.width / 2;
      const size = hr.width + (tr.height - hr.width) * shrink;
      seed.style.width = seed.style.height = `${size.toFixed(1)}px`;
      seed.style.borderRadius = `${(18 * size / hr.width).toFixed(1)}px`;
      seed.style.transform = `translate(${(cx - size / 2).toFixed(1)}px, ${(holdY - size / 2).toFixed(1)}px)`;
      seed.style.setProperty('--arc', Math.sin(Math.PI * p).toFixed(3));
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
      delete frame_.dataset.seed; delete hiw.dataset.seed; delete seed.dataset.seed;
    };
  }, [enabled]);
  return ref;
}
