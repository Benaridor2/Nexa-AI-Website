import { useLayoutEffect, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
export const clamp = (n: number) => Math.min(1, Math.max(0, n));
export const phase = (p: number, a: number, b: number) => { const t = clamp((p - a) / (b - a)); return t * t * t * (t * (t * 6 - 15) + 10); };
export const between = (p: number, a: number, b: number, c: number, d: number) => phase(p, a, b) * (1 - phase(p, c, d));

type Renderer = (root: HTMLElement) => (progress: number) => void;

// A local, paused timeline is sought directly by native scroll. No catch-up,
// timers, wheel interception, or threshold-triggered playback owns its state.
export function useScene(ref: RefObject<HTMLElement | null>, enabled: boolean, setup: Renderer) {
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || !enabled) return;
    const originalAttributes = new Map([...root.querySelectorAll<HTMLElement>('[data-animated]')].map(el => [el, { style: el.getAttribute('style'), hidden: el.getAttribute('aria-hidden'), inert: el.hasAttribute('inert') }]));
    const draw = setup(root);
    const clock = { p: 0 };
    let active = true;
    const render = (p: number) => { if (!active) return; draw(p); root.dataset.progress = p.toFixed(5); };
    const tl = gsap.timeline({ paused: true }).fromTo(clock, { p: 0 }, {
      p: 1, duration: 1, ease: 'none', onUpdate: () => {
        render(clock.p);
      },
    });
    const trigger = ScrollTrigger.create({
      trigger: root, start: root.id === 'guest-story' ? 'top 82%' : 'top top', end: 'bottom bottom', animation: tl,
      scrub: .35, invalidateOnRefresh: true,
      onRefresh: self => { tl.progress(self.progress); render(self.progress); },
    });
    render(trigger.progress);
    return () => {
      active = false;
      trigger.kill(); tl.kill();
      originalAttributes.forEach((original, el) => {
        if (original.style === null) el.removeAttribute('style'); else el.setAttribute('style', original.style);
        if (original.hidden === null) el.removeAttribute('aria-hidden'); else el.setAttribute('aria-hidden', original.hidden);
        el.inert = original.inert;
      });
      root.removeAttribute('data-progress');
    };
  }, [ref, enabled, setup]);
}

export function styles(el: HTMLElement | null, values: Record<string, string | number>) {
  if (!el) return;
  for (const [key, value] of Object.entries(values)) el.style.setProperty(key, String(value));
}
export function visible(el: HTMLElement | null, opacity: number, semantic = true) {
  if (!el) return;
  el.style.opacity = String(opacity);
  if (semantic) {
    el.inert = opacity < .85;
    el.setAttribute('aria-hidden', String(opacity < .85));
  }
}
