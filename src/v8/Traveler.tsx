import { useEffect, useRef } from 'react';

// The orb travels. NEXA sits in the middle of the connection panel as a
// purple sphere, the one connection between the PMS systems and the AI
// agents. As the reader scrolls on, the sphere lifts off the panel, rides
// along at reading height over the two verdicts, the statement and the next
// heading, swinging out a little and rolling as it goes, and shrinks into
// its place on the How-it-works stage: the NEXA node on the line between
// the guest's AI and your PMS, where the mechanism it powers is about to be
// shown. The panel keeps a dashed outline where it left.
//
// The flight is scrubbed by the scroll, so it flies back the same way, and
// it is measured from the page on every frame, so the landing spot is exact
// whatever the viewport. Under reduced motion the sphere stays in the panel.
const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => (t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export function useTraveler(enabled: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const orb = ref.current;
    const mid = document.querySelector<HTMLElement>('.hub-mid');
    const home = mid?.querySelector<HTMLElement>('.hub');
    const hiw = document.querySelector<HTMLElement>('.hiw');
    const stage = hiw?.querySelector<HTMLElement>('.hiw-stage');
    const target = hiw?.querySelector<HTMLElement>('.hiw-node.is-nexa');
    if (!orb || !mid || !home || !hiw || !stage || !target) return;
    if (!enabled || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    let state = '';
    const set = (s: 'home' | 'flying' | 'landed') => {
      if (s === state) return;
      state = s;
      mid.dataset.ask = s; hiw.dataset.ask = s; orb.dataset.ask = s;
    };
    const measure = () => {
      frame = 0;
      const phone = innerWidth < 700;
      const liftY = Math.round(innerHeight * (phone ? .36 : .42));
      const stickyTop = phone ? 64 : Math.max(80, innerHeight / 2 - 300);
      const hr = home.getBoundingClientRect();
      const st = stage.getBoundingClientRect();
      const tr = target.getBoundingClientRect();
      // From the scroll position where the sphere's centre reaches reading
      // height to the one where the stage sticks and step 1 begins.
      const startY = scrollY + hr.top + hr.height / 2 - liftY;
      const endY = scrollY + st.top - stickyTop;
      const p = endY <= startY ? 1 : clamp((scrollY - startY) / (endY - startY));
      if (p <= 0) { set('home'); return; }
      if (p >= 1) { set('landed'); return; }
      const e = ease(p);
      const arc = Math.sin(Math.PI * p);
      const fromCx = hr.left + hr.width / 2;
      const toCx = tr.left + tr.width / 2;
      const toCy = stickyTop + (tr.top - st.top) + tr.height / 2;
      const drift = -(phone ? 36 : Math.min(160, innerWidth * .11)) * arc;
      const size = hr.width + (tr.height - hr.width) * e;
      const cx = fromCx + (toCx - fromCx) * e + drift;
      const cy = liftY + (toCy - liftY) * e;
      orb.style.width = orb.style.height = `${size.toFixed(1)}px`;
      orb.style.transform = `translate(${(cx - size / 2).toFixed(1)}px, ${(cy - size / 2).toFixed(1)}px) rotate(${(p * 220).toFixed(1)}deg)`;
      orb.style.setProperty('--arc', arc.toFixed(3));
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
      delete mid.dataset.ask; delete hiw.dataset.ask; delete orb.dataset.ask;
    };
  }, [enabled]);
  return ref;
}
