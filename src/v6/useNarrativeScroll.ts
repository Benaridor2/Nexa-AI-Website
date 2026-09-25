import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PACING, toScroll } from './pacing';

type Span = { start: number; end: number; key: boolean };
const scenes = new Set(['guest-story', 'priced', 'how-it-works', 'connector']);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const scrollKeys = new Set(['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Spacebar']);

// Lenis smooths wheel scrolling; touch keeps its native momentum. Around the
// scenes' transitions (see pacing.ts) three rules apply:
// 1. Scrolling that stops halfway through a transition completes it, in the
//    direction of travel and only over a short distance, so a pause never
//    leaves a card half faded.
// 2. A fast wheel or trackpad flick stops once at the end of a main beat
//    instead of flying past it. Slow scrolling is never held.
// 3. Unusually large single wheel impulses are compressed.
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
        return pacing.windows.map(([a, b, key]) => ({ start: trigger.start + length * toScroll(pacing, a), end: trigger.start + length * toScroll(pacing, b), key: key === 'key' }));
      });
      // Only the pinned part of a scene: its entrance scrolls like the page.
      pinned = triggers.map(trigger => [Math.max(trigger.start, (trigger.trigger as HTMLElement).getBoundingClientRect().top + window.scrollY), trigger.end]);
    };

    let direction = 0, lastWheel = 0, lastY = window.scrollY, touching = false, settling = false;
    let input: 'wheel' | 'touch' | 'key' | null = null;
    let caught: { at: number; last: number } | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const blocked = () => Boolean(document.querySelector('dialog[open]'));

    // Rule 1: complete a transition the scroll came to rest in, in the
    // direction of travel. Barely into a long one, it goes back instead.
    const settle = (position: number, glide: (goal: number) => void) => {
      if (blocked() || !direction) return;
      const span = spans.find(s => position > s.start + 1 && position < s.end - 1);
      if (!span) return;
      const ahead = direction > 0 ? span.end : span.start, behind = direction > 0 ? span.start : span.end;
      const goal = Math.abs(ahead - position) <= innerHeight * .55 ? ahead : Math.abs(behind - position) <= innerHeight * .2 ? behind : undefined;
      if (goal === undefined) return;
      settling = true;
      glide(goal);
    };
    const done = () => { settling = false; };
    const settleWheel = () => settle(lenis.targetScroll, goal => lenis.scrollTo(goal, { lerp: .085, onComplete: done }));
    const settleNative = () => settle(window.scrollY, goal => lenis.scrollTo(goal, { duration: .5, easing: easeOut, onComplete: done }));
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
        const now = performance.now(), gap = now - lastWheel, distance = Math.abs(data.deltaY);
        lastWheel = now;
        if (dir !== direction) caught = null;
        direction = dir;
        timer = setTimeout(settleWheel, 140);
        // Rule 2: the rest of a caught flick (its decaying inertia, or a short
        // burst of wheel notches) is absorbed; a new gesture goes on.
        if (caught && gap < 90 && (now - caught.at < 380 || distance < caught.last)) {
          caught.last = distance;
          if (event.cancelable) event.preventDefault();
          return false;
        }
        caught = null;
        let delta = data.deltaY;
        const from = lenis.targetScroll;
        // Rule 3.
        if (pinned.some(([a, b]) => from >= a && from <= b) && distance > 180) delta = dir * (180 + 420 * (1 - Math.exp(-(distance - 180) / 420)));
        const to = from + delta;
        // Fast: the target runs well ahead of the page (about 2 viewports a second).
        if (Math.abs(to - lenis.animatedScroll) > innerHeight * .17) {
          const stop = spans.filter(s => s.key).map(s => dir > 0 ? s.end : s.start)
            .filter(y => dir > 0 ? y > from + 1 && y <= to : y < from - 1 && y >= to)
            .sort((a, b) => (a - b) * dir)[0];
          if (stop !== undefined) { delta = stop - from; caught = { at: now, last: distance }; }
        }
        data.deltaY = delta;
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
