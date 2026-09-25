import { useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { clamp } from './motion';
import { smoothScroll } from './useNarrativeScroll';

// The booking conversation follows the scroll, as a short pinned scene.
// Scrolling it into place opens the window; while it is pinned, the scroll
// plays the story at the pace of TIMELINE, so a relaxed scroll reads like
// watching it. Play makes the page scroll through it by itself, Skip jumps
// past it, and the chapters jump within it. The reader's own scroll takes over at once.

// When each beat of the story happens, in seconds: [story progress, time].
// Typing and streaming are quick; the reading holds are longer.
const TIMELINE: readonly (readonly [number, number])[] = [
  [.088, 0], [.18, 3.2], [.235, 5], [.25, 5.8], [.295, 7.6], [.325, 8.1], [.3725, 9.7], [.425, 11.9], [.47, 13.3],
  [.54, 16.1], [.585, 17.9], [.655, 20.1], [.76, 21.7], [.826, 23.5], [.877, 24.7], [1, 27.1],
];
export const STORY_SECONDS = TIMELINE[TIMELINE.length - 1][1];
const OPEN = TIMELINE[0][0];

const lerp = (value: number, from: 0 | 1) => {
  const to = from ? 0 : 1;
  for (let i = 1; i < TIMELINE.length; i++) {
    const a = TIMELINE[i - 1], b = TIMELINE[i];
    if (value <= b[from] || i === TIMELINE.length - 1) return a[to] + (b[to] - a[to]) * clamp((value - a[from]) / (b[from] - a[from]));
  }
  return value;
};
const storyAt = (seconds: number) => lerp(seconds, 1);
const timeOf = (story: number) => lerp(story, 0);

export const CHAPTERS = [
  { label: 'Ask', title: 'The guest asks', story: OPEN },
  { label: 'Dates', title: 'ChatGPT asks for dates', story: .18 },
  { label: 'Answer', title: 'Two apartments, priced', story: .325 },
  { label: 'Pool', title: 'A pool, please', story: .54 },
  { label: 'Book direct', title: 'Book direct', story: .655 },
  { label: 'Checkout', title: "The property's checkout", story: .826 },
].map((chapter, i, all) => ({ ...chapter, start: timeOf(chapter.story), end: i < all.length - 1 ? timeOf(all[i + 1].story) : STORY_SECONDS }));

export type PlayerStatus = 'idle' | 'playing' | 'ended';
export type PlayerControls = { toggle: () => void; seek: (seconds: number) => void; skip: () => void };

type Renderer = (root: HTMLElement) => (progress: number) => void;
const easeInOut = (t: number) => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function useStoryPlayer(ref: RefObject<HTMLElement | null>, enabled: boolean, setup: Renderer) {
  const [status, setStatus] = useState<PlayerStatus>('idle');
  const controls = useRef<PlayerControls>({ toggle: () => undefined, seek: () => undefined, skip: () => undefined });
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || !enabled) return;
    const originalAttributes = new Map([...root.querySelectorAll<HTMLElement>('[data-animated]')].map(el => [el, { style: el.getAttribute('style'), hidden: el.getAttribute('aria-hidden'), inert: el.hasAttribute('inert') }]));
    const draw = setup(root);
    const chapters = [...root.querySelectorAll<HTMLElement>('.player-chapter')], labels = [...root.querySelectorAll<HTMLElement>('.player-labels li')];
    const track = root.querySelector<HTMLElement>('.player-track');
    const now = root.querySelector<HTMLElement>('.player-now');
    // entry: the section scrolling into place (opens the window). u: the pinned story.
    let active = true, entry = 0, u = 0, playing = false, shownChapter = -2, shownStatus: PlayerStatus = 'idle';
    const set = (next: PlayerStatus) => { if (next !== shownStatus) { shownStatus = next; setStatus(next); } };

    const render = () => {
      if (!active) return;
      const seconds = u * STORY_SECONDS;
      const story = u > 0 ? storyAt(seconds) : OPEN * entry;
      draw(story);
      root.dataset.story = story.toFixed(5);
      chapters.forEach((el, i) => el.style.setProperty('--fill', String(clamp((seconds - CHAPTERS[i].start) / (CHAPTERS[i].end - CHAPTERS[i].start)))));
      let current = -1;
      if (u > 0 || entry >= 1) CHAPTERS.forEach((chapter, i) => { if (seconds >= chapter.start - .01) current = i; });
      if (current !== shownChapter) {
        shownChapter = current;
        [chapters, labels].forEach(list => list.forEach((el, i) => el.classList.toggle('is-current', i === current)));
        track?.setAttribute('aria-valuetext', current < 0 ? 'Not started' : `${CHAPTERS[current].title}, chapter ${current + 1} of ${CHAPTERS.length}`);
        if (now) now.textContent = `${Math.max(0, current) + 1} / ${CHAPTERS.length} · ${CHAPTERS[Math.max(0, current)].title}`;
      }
      track?.setAttribute('aria-valuenow', seconds.toFixed(1));
      if (track) track.dataset.seconds = seconds.toFixed(3);
      if (!playing) set(u >= .999 ? 'ended' : 'idle');
    };

    const opening = ScrollTrigger.create({
      trigger: root, start: 'top 75%', end: 'top top',
      onUpdate: self => { entry = self.progress; render(); },
      onRefresh: self => { entry = self.progress; render(); },
    });
    const trigger = ScrollTrigger.create({
      trigger: root, start: 'top top', end: 'bottom bottom',
      onUpdate: self => { u = self.progress; render(); },
      onRefresh: self => { u = self.progress; render(); },
    });
    const yAt = (at: number) => trigger.start + (trigger.end - trigger.start) * at;
    const go = (y: number, options: { duration: number; easing?: (t: number) => number; onComplete?: () => void }) => {
      const lenis = smoothScroll.lenis;
      if (lenis) lenis.scrollTo(y, { easing: easeInOut, ...options, force: true });
      else window.scrollTo({ top: y, behavior: 'smooth' });
    };
    const jump = (y: number) => { if (smoothScroll.lenis) smoothScroll.lenis.scrollTo(y, { immediate: true, force: true }); else window.scrollTo(0, y); };
    const stop = () => { if (!playing) return; playing = false; smoothScroll.lenis?.scrollTo(smoothScroll.lenis.animatedScroll, { immediate: true, force: true }); render(); };
    // Play: the page scrolls through the rest of the story at its own pace.
    const play = () => {
      if (u >= .999) jump(yAt(0));
      playing = true; set('playing');
      const run = () => {
        if (!playing) return;
        const remaining = STORY_SECONDS * (1 - u);
        go(yAt(1), { duration: Math.max(.3, remaining), easing: t => t, onComplete: () => { playing = false; render(); } });
      };
      if (u <= 0 && window.scrollY < yAt(0) - 2) go(yAt(0), { duration: 1.1, onComplete: run }); else run();
    };
    const seek = (seconds: number) => { stop(); go(yAt(clamp(seconds / STORY_SECONDS)), { duration: .9 }); };
    const skip = () => { stop(); go(root.getBoundingClientRect().bottom + window.scrollY, { duration: 1.1 }); };
    controls.current = { toggle: () => { if (playing) stop(); else play(); }, seek, skip };

    // Any scroll of the reader's own takes over from Play.
    const takeOver = (event: Event) => {
      if (!playing) return;
      if (event.type === 'keydown' && !['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Home', 'End'].includes((event as KeyboardEvent).key)) return;
      if ((event.target as Element | null)?.closest?.('.story-player')) return;
      playing = false; render();
    };
    const onPointer = (event: Event) => { if (playing && root.querySelector('.chat-window')?.contains(event.target as Node)) stop(); };
    window.addEventListener('wheel', takeOver, { passive: true });
    window.addEventListener('touchstart', takeOver, { passive: true });
    window.addEventListener('keydown', takeOver);
    root.addEventListener('pointerdown', onPointer);
    // "Watch a booking happen": glide to the start of the story and play it.
    // On window, after React has handled the click and before Lenis's anchor handling.
    const watch = (event: MouseEvent) => {
      if (!(event.target as Element | null)?.closest?.('a[href$="#watch-a-booking"]') || location.pathname !== '/') return;
      event.preventDefault(); event.stopImmediatePropagation();
      stop();
      playing = true; set('playing');
      go(yAt(0), { duration: 1.2, onComplete: () => { playing = false; play(); } });
    };
    window.addEventListener('click', watch);
    const redraw = () => render();
    const seekTo = (event: Event) => { const detail = (event as CustomEvent<{ story?: number; seconds?: number }>).detail ?? {}; const seconds = detail.seconds ?? timeOf(detail.story ?? OPEN); stop(); jump(yAt(clamp(seconds / STORY_SECONDS))); };
    root.addEventListener('scene-redraw', redraw);
    root.addEventListener('story-seek', seekTo);
    render();
    return () => {
      active = false;
      trigger.kill(); opening.kill();
      window.removeEventListener('wheel', takeOver);
      window.removeEventListener('touchstart', takeOver);
      window.removeEventListener('keydown', takeOver);
      root.removeEventListener('pointerdown', onPointer);
      window.removeEventListener('click', watch);
      root.removeEventListener('scene-redraw', redraw);
      root.removeEventListener('story-seek', seekTo);
      originalAttributes.forEach((original, el) => {
        if (original.style === null) el.removeAttribute('style'); else el.setAttribute('style', original.style);
        if (original.hidden === null) el.removeAttribute('aria-hidden'); else el.setAttribute('aria-hidden', original.hidden);
        el.inert = original.inert;
      });
      root.removeAttribute('data-story');
    };
  }, [ref, enabled, setup]);
  return { status, controls };
}
