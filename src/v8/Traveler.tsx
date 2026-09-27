import { useEffect, useRef } from 'react';

// The question travels. In [01] the guest's question sits above the two
// possible answers. As the reader scrolls on, it lifts off the page, rides
// along at reading height over the verdicts, the statement and the next
// heading, and lands in the chat on the How-it-works stage, where step 1
// begins: the same question, now asked to an AI that NEXA can answer.
//
// The flight is scrubbed by the scroll, so it flies back up the same way,
// and it is measured from the page on every frame, so the landing spot is
// exact whatever the viewport. Under reduced motion the question stays put
// and the stage types its own.
const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => (t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export function useTraveler(enabled: boolean) {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const fly = ref.current;
    const slot = document.querySelector<HTMLElement>('.s8-ask-slot');
    const home = slot?.querySelector<HTMLElement>('.s8-ask');
    const hiw = document.querySelector<HTMLElement>('.hiw');
    const stage = hiw?.querySelector<HTMLElement>('.hiw-stage');
    const target = hiw?.querySelector<HTMLElement>('.hiw-q:not(.is-second)');
    if (!fly || !slot || !home || !hiw || !stage || !target) return;
    if (!enabled || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    hiw.classList.add('has-traveler');
    let frame = 0;
    let state = '';
    const set = (s: 'home' | 'flying' | 'landed') => {
      if (s === state) return;
      state = s;
      slot.dataset.ask = s; hiw.dataset.ask = s; fly.dataset.ask = s;
    };
    const measure = () => {
      frame = 0;
      const phone = innerWidth < 700;
      const liftY = Math.round(innerHeight * (phone ? .3 : .36));
      const stickyTop = phone ? 64 : Math.max(80, innerHeight / 2 - 300);
      const sr = home.getBoundingClientRect();
      const st = stage.getBoundingClientRect();
      const tr = target.getBoundingClientRect();
      // From the scroll position where the question reaches reading height
      // to the one where the stage sticks and step 1 begins.
      const startY = scrollY + sr.top - liftY;
      const endY = scrollY + st.top - stickyTop;
      const p = endY <= startY ? 1 : clamp((scrollY - startY) / (endY - startY));
      if (p <= 0) { set('home'); return; }
      if (p >= 1) { set('landed'); return; }
      const e = ease(p);
      const toTop = stickyTop + (tr.top - st.top);
      const left = sr.left + (tr.left - sr.left) * e;
      const top = liftY + (toTop - liftY) * e;
      const width = sr.width + (tr.width - sr.width) * e;
      const arc = Math.sin(Math.PI * p);
      fly.style.width = `${width}px`;
      fly.style.transform = `translate(${left}px, ${top}px) rotate(${(-2.2 * arc).toFixed(2)}deg) scale(${(1 + .05 * arc).toFixed(3)})`;
      fly.style.setProperty('--arc', arc.toFixed(3));
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
      hiw.classList.remove('has-traveler');
      delete slot.dataset.ask; delete hiw.dataset.ask; delete fly.dataset.ask;
    };
  }, [enabled]);
  return ref;
}
