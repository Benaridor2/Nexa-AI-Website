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

    // Without the player bar, the scene offers a skip pill while pinned, and a
    // flick of the wheel skips the conversation.
    const quiet = root.dataset.player === 'none';
    const render = () => {
      if (!active) return;
      const seconds = u * STORY_SECONDS;
      const story = u > 0 ? storyAt(seconds) : OPEN * entry;
      draw(story);
      root.dataset.story = story.toFixed(5);
      root.classList.toggle('is-pinned', entry >= 1 && u < .965);
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
    const past = () => root.getBoundingClientRect().bottom + window.scrollY;
    const skip = () => { stop(); go(past(), { duration: 1.1 }); };
    // A flick of the wheel: the conversation runs to its end and the page moves
    // on. The flick's own momentum is swallowed so it does not carry past the
    // next section; a scroll back up cancels the glide at once.
    let burst = 0, burstAt = 0, burstFrom = 0, skipping = false, swallowUntil = 0;
    const endSkip = () => { skipping = false; root.classList.remove('is-skipping'); };
    const flickSkip = () => {
      stop(); skipping = true; root.classList.add('is-skipping');
      go(past(), { duration: 1.35, onComplete: () => { endSkip(); swallowUntil = performance.now() + 400; } });
      window.setTimeout(() => { if (skipping) endSkip(); }, 2000);
    };
    const onWheel = (event: WheelEvent) => {
      const now = performance.now();
      if (skipping || now < swallowUntil) {
        if (event.deltaY > 0) { event.preventDefault(); event.stopImmediatePropagation(); return; }
        endSkip(); swallowUntil = 0; smoothScroll.lenis?.scrollTo(smoothScroll.lenis.animatedScroll, { immediate: true, force: true });
        return;
      }
      if (!quiet || entry < 1 || u >= .965 || event.deltaY <= 0) { burst = 0; return; }
      const delta = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaMode === 2 ? event.deltaY * innerHeight : event.deltaY;
      // A flick is a lot of travel in little time. A steady turn of the wheel,
      // however long, is reading.
      if (now - burstAt > 160 || now - burstFrom > 500) { burst = 0; burstFrom = now; }
      burst += delta; burstAt = now;
      // The event that completes the flick is swallowed too: were it to reach
      // Lenis, its own scroll would take over from the glide that has just begun.
      if (burst >= 760) { burst = 0; event.preventDefault(); event.stopImmediatePropagation(); flickSkip(); }
    };
    window.addEventListener('wheel', onWheel, { capture: true, passive: false });
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
      if (quiet) { go(yAt(0), { duration: 1.2 }); return; }
      playing = true; set('playing');
      go(yAt(0), { duration: 1.2, onComplete: () => { playing = false; play(); } });
    };
    window.addEventListener('click', watch);
    // The same, from a button anywhere on the page.
    const onWatch = () => { stop(); go(yAt(0), { duration: 1.2 }); };
    root.addEventListener('story-watch', onWatch);
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
      window.removeEventListener('wheel', onWheel, { capture: true });
      root.removeEventListener('story-watch', onWatch);
      root.removeEventListener('scene-redraw', redraw);
      root.removeEventListener('story-seek', seekTo);
      originalAttributes.forEach((original, el) => {
        if (original.style === null) el.removeAttribute('style'); else el.setAttribute('style', original.style);
        if (original.hidden === null) el.removeAttribute('aria-hidden'); else el.setAttribute('aria-hidden', original.hidden);
        el.inert = original.inert;
      });
      root.removeAttribute('data-story');
      root.classList.remove('is-pinned', 'is-skipping');
    };
  }, [ref, enabled, setup]);
  return { status, controls };
}

// The film: the same story, played by time instead of by scroll. It starts
// when half of the window is on screen, pauses off screen, and ends on the
// property's checkout. Replay restarts it; reduced motion shows the answer.
export const ANSWER_SHOWN = 13.3; // seconds: both priced cards on screen
export type FilmControls = { toggle: () => void; replay: () => void; seek: (seconds: number) => void };
const FILM_SPEED = 1.15; // a little brisker than the scroll pacing

export function useFilmPlayer(ref: RefObject<HTMLElement | null>, enabled: boolean, setup: Renderer) {
  const [status, setStatus] = useState<PlayerStatus>('idle');
  const controls = useRef<FilmControls>({ toggle: () => undefined, replay: () => undefined, seek: () => undefined });
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || !enabled) return;
    const originalAttributes = new Map([...root.querySelectorAll<HTMLElement>('[data-animated]')].map(el => [el, { style: el.getAttribute('style'), hidden: el.getAttribute('aria-hidden'), inert: el.hasAttribute('inert') }]));
    const draw = setup(root);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let seconds = 0, playing = false, ended = false, frame = 0, last = 0, seen = false, shown: PlayerStatus = 'idle';
    const set = (next: PlayerStatus) => { if (next !== shown) { shown = next; setStatus(next); } };
    const render = () => { const story = storyAt(seconds); draw(story); root.dataset.story = story.toFixed(5); root.dataset.seconds = seconds.toFixed(2); };
    const stop = () => { playing = false; cancelAnimationFrame(frame); set(ended ? 'ended' : 'idle'); };
    const tick = (now: number) => {
      if (!playing) return;
      seconds = Math.min(STORY_SECONDS, seconds + (now - last) / 1000 * FILM_SPEED); last = now;
      render();
      if (seconds >= STORY_SECONDS) { ended = true; stop(); return; }
      frame = requestAnimationFrame(tick);
    };
    const play = () => { if (playing) return; if (ended) { ended = false; seconds = 0; } playing = true; set('playing'); last = performance.now(); frame = requestAnimationFrame(tick); };
    const seek = (to: number) => { seconds = Math.max(0, Math.min(STORY_SECONDS, to)); ended = seconds >= STORY_SECONDS; render(); if (!playing) set(ended ? 'ended' : 'idle'); };
    const replay = () => { stop(); delete root.dataset.paused; ended = false; seconds = 0; render(); play(); };
    controls.current = { toggle: () => { if (playing) { root.dataset.paused = 'true'; stop(); } else { delete root.dataset.paused; play(); } }, replay, seek };
    // Reduced motion: the finished answer, no film.
    if (reduced) { seek(ANSWER_SHOWN); ended = false; set('idle'); }
    else {
      render();
      const io = new IntersectionObserver(([entry]) => {
        if (entry.intersectionRatio >= .5) { if (!seen) { seen = true; play(); } else if (!ended && !playing && root.dataset.paused !== 'true') play(); }
        else if (playing) { stop(); }
      }, { threshold: [0, .5] });
      io.observe(root);
      const stopIo = () => io.disconnect();
      root.addEventListener('film-dispose', stopIo, { once: true });
    }
    // A click inside the window pauses the film, so the reader can use it.
    const onPointer = (event: Event) => { if (playing && root.querySelector('.chat-window')?.contains(event.target as Node) && !(event.target as Element).closest('.film-controls')) { root.dataset.paused = 'true'; stop(); } };
    root.addEventListener('pointerdown', onPointer);
    const redraw = () => render();
    const seekTo = (event: Event) => { const detail = (event as CustomEvent<{ story?: number; seconds?: number }>).detail ?? {}; const to = detail.seconds ?? timeOf(detail.story ?? OPEN); root.dataset.paused = 'true'; stop(); seek(to); };
    const onReplay = () => replay();
    root.addEventListener('scene-redraw', redraw);
    root.addEventListener('story-seek', seekTo);
    root.addEventListener('film-replay', onReplay);
    return () => {
      playing = false; cancelAnimationFrame(frame);
      root.dispatchEvent(new Event('film-dispose'));
      root.removeEventListener('film-replay', onReplay);
      root.removeEventListener('pointerdown', onPointer);
      root.removeEventListener('scene-redraw', redraw);
      root.removeEventListener('story-seek', seekTo);
      originalAttributes.forEach((original, el) => {
        if (original.style === null) el.removeAttribute('style'); else el.setAttribute('style', original.style);
        if (original.hidden === null) el.removeAttribute('aria-hidden'); else el.setAttribute('aria-hidden', original.hidden);
        el.inert = original.inert;
      });
      delete root.dataset.story; delete root.dataset.seconds; delete root.dataset.paused;
    };
  }, [ref, enabled, setup]);
  return { status, controls };
}
