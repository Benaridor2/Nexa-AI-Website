import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PACING, toScroll } from './pacing';

type Span = { start: number; end: number };
const scenes = new Set(['guest-story', 'priced', 'how-it-works', 'connector']);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const scrollKeys = new Set(['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Spacebar']);

// Lenis smooths wheel scrolling; touch keeps its native momentum. The scroll
// is never held or slowed: every gesture travels its full distance. Two gentle
// rules apply inside the pinned scenes:
// 1. Scrolling that comes to rest just short of the end of a transition (see
//    pacing.ts) completes it, in the direction of travel, so a pause never
//    leaves a card half faded. Only the last short stretch is completed.
// 2. Unusually large single wheel impulses are compressed.
export function useNarrativeScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    let spans: Span[] = [], pinned: [number, number][] = [];
    const measure = () => {
      const triggers = ScrollTrigger.getAll().filter(trigger => scenes.has((trigger.trigger as HTMLElement | undefined)?.id ?? ''));
      spans = triggers.flatMap(trigger => {
        const pacing = PACING[(trigger.trigger as HTMLElement).id];
        if (!pacing) return [];
        const length = trigger.end - trigger.start;
        return pacing.windows.map(([a, b]) => ({ start: trigger.start + length * toScroll(pacing, a), end: trigger.start + length * toScroll(pacing, b) }));
      });
      // Only the pinned part of a scene: its entrance scrolls like the page.
      pinned = triggers.map(trigger => [Math.max(trigger.start, (trigger.trigger as HTMLElement).getBoundingClientRect().top + window.scrollY), trigger.end]);
    };

    let direction = 0, lastY = window.scrollY, touching = false, settling = false;
    let input: 'wheel' | 'touch' | 'key' | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const blocked = () => Boolean(document.querySelector('dialog[open]'));

    // Rule 1: finish a transition the scroll stopped just short of. Anywhere
    // else the page stays exactly where the reader left it.
    const settle = (position: number, glide: (goal: number) => void) => {
      if (blocked() || !direction) return;
      const span = spans.find(s => position > s.start + 1 && position < s.end - 1);
      if (!span) return;
      const goal = direction > 0 ? span.end : span.start;
      if (Math.abs(goal - position) > innerHeight * .22) return;
      settling = true;
      glide(goal);
    };
    const done = () => { settling = false; };
    const settleWheel = () => settle(lenis.targetScroll, goal => lenis.scrollTo(goal, { lerp: .12, onComplete: done }));
    const settleNative = () => settle(window.scrollY, goal => lenis.scrollTo(goal, { duration: .4, easing: easeOut, onComplete: done }));
    const interrupt = () => {
      clearTimeout(timer);
      if (settling) { settling = false; lenis.scrollTo(lenis.scroll, { immediate: true }); }
    };

    const lenis = new Lenis({
      lerp: .18,
      smoothWheel: true,
      syncTouch: false,
      anchors: true,
      prevent: node => Boolean(node.closest('dialog')),
      virtualScroll: data => {
        const event = data.event as WheelEvent;
        if (event.type !== 'wheel' || event.ctrlKey || blocked()) return true;
        const dir = Math.sign(data.deltaY);
        if (!dir) return true;
        input = 'wheel';
        clearTimeout(timer);
        settling = false;
        direction = dir;
        timer = setTimeout(settleWheel, 180);
        // Rule 2.
        const distance = Math.abs(data.deltaY), from = lenis.targetScroll;
        if (pinned.some(([a, b]) => from >= a && from <= b) && distance > 180) data.deltaY = dir * (180 + 420 * (1 - Math.exp(-(distance - 180) / 420)));
        return true;
      },
    });

    // Touch momentum and keyboard scrolling are native: settle once they end.
    const onScroll = () => {
      const y = window.scrollY;
      if (!settling && y !== lastY && input !== 'wheel') direction = Math.sign(y - lastY);
      lastY = y;
      if ((input === 'touch' || input === 'key') && !touching && !settling) {
        clearTimeout(timer);
        timer = setTimeout(settleNative, 130);
      }
    };
    const onTouchStart = () => { interrupt(); input = 'touch'; touching = true; };
    const onTouchEnd = () => { touching = false; clearTimeout(timer); timer = setTimeout(settleNative, 130); };
    const onKey = (event: KeyboardEvent) => {
      interrupt();
      const target = event.target as HTMLElement | null;
      input = scrollKeys.has(event.key) && !target?.closest('input, textarea, select, [contenteditable]') ? 'key' : null;
    };
    // A mouse press (a click, the scrollbar) is not a scroll to settle; touches are handled above.
    const onPointer = (event: PointerEvent) => { interrupt(); if (event.pointerType === 'mouse') input = null; };

    measure();
    ScrollTrigger.addEventListener('refresh', measure);
    ScrollTrigger.config({ ignoreMobileResize: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd, { passive: true });
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onPointer, { passive: true });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (seconds: number) => lenis.raf(seconds * 1000);
    gsap.ticker.add(tick);
    // As Lenis recommends: after a slow frame, catch up instead of slowing down.
    gsap.ticker.lagSmoothing(0);
    return () => {
      clearTimeout(timer);
      ScrollTrigger.removeEventListener('refresh', measure);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onPointer);
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, [enabled]);
}
