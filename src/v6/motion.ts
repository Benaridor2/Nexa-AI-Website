import { useLayoutEffect, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PACING, toStory } from './pacing';

gsap.registerPlugin(ScrollTrigger);
export const clamp = (n: number) => Math.min(1, Math.max(0, n));
export const phase = (p: number, a: number, b: number) => { const t = clamp((p - a) / (b - a)); return t * t * (3 - 2 * t); };
export const between = (p: number, a: number, b: number, c: number, d: number) => phase(p, a, b) * (1 - phase(p, c, d));

type Renderer = (root: HTMLElement) => (progress: number) => void;

// Read the actual scroll position directly; Lenis provides one shared smoothing
// layer for wheel input. Touch, keyboard, and reduced-motion keep native behavior.
export function useScene(ref: RefObject<HTMLElement | null>, enabled: boolean, setup: Renderer) {
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || !enabled) return;
    const originalAttributes = new Map([...root.querySelectorAll<HTMLElement>('[data-animated]')].map(el => [el, { style: el.getAttribute('style'), hidden: el.getAttribute('aria-hidden'), inert: el.hasAttribute('inert') }]));
    const draw = setup(root);
    const clock = { p: 0 };
    let active = true;
    // The scene's own pacing turns scroll progress into story progress.
    const pacing = PACING[root.id];
    const render = (p: number) => {
      if (!active) return;
      const story = toStory(pacing, p);
      draw(story);
      root.dataset.progress = p.toFixed(5);
      root.dataset.story = story.toFixed(5);
    };
    const tl = gsap.timeline({ paused: true }).fromTo(clock, { p: 0 }, {
      p: 1, duration: 1, ease: 'none', onUpdate: () => {
        render(clock.p);
      },
    });
    const trigger = ScrollTrigger.create({
      trigger: root, start: root.id === 'guest-story' ? 'top 75%' : 'top top', end: 'bottom bottom', animation: tl,
      scrub: true, invalidateOnRefresh: true,
      onRefresh: self => { tl.progress(self.progress); render(self.progress); },
    });
    render(trigger.progress);
    // Click-driven state (a new chat message, the checkout opened by hand)
    // asks for a redraw at the current scroll position.
    const redraw = () => render(clock.p);
    root.addEventListener('scene-redraw', redraw);
    return () => {
      active = false;
      root.removeEventListener('scene-redraw', redraw);
      trigger.kill(); tl.kill();
      originalAttributes.forEach((original, el) => {
        if (original.style === null) el.removeAttribute('style'); else el.setAttribute('style', original.style);
        if (original.hidden === null) el.removeAttribute('aria-hidden'); else el.setAttribute('aria-hidden', original.hidden);
        el.inert = original.inert;
      });
      root.removeAttribute('data-progress'); root.removeAttribute('data-story');
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
