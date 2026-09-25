import { useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { clamp } from './motion';

// The booking conversation plays by itself, like a video, instead of asking
// for seven screens of scrolling. Scrolling into the section opens the window;
// once it is in view the story plays, and it can be paused, scrubbed, replayed
// or jumped chapter by chapter. The live chat, Edit and checkout stay usable.

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

export type PlayerStatus = 'waiting' | 'playing' | 'paused' | 'ended';
export type PlayerControls = { toggle: () => void; seek: (seconds: number) => void; replay: () => void; pause: () => void };

type Renderer = (root: HTMLElement) => (progress: number) => void;

export function useStoryPlayer(ref: RefObject<HTMLElement | null>, enabled: boolean, setup: Renderer) {
  const [status, setStatus] = useState<PlayerStatus>('waiting');
  const controls = useRef<PlayerControls>({ toggle: () => undefined, seek: () => undefined, replay: () => undefined, pause: () => undefined });
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || !enabled) return;
    const originalAttributes = new Map([...root.querySelectorAll<HTMLElement>('[data-animated]')].map(el => [el, { style: el.getAttribute('style'), hidden: el.getAttribute('aria-hidden'), inert: el.hasAttribute('inert') }]));
    const draw = setup(root);
    const frame = root.querySelector<HTMLElement>('.chat-window');
    const chapters = [...root.querySelectorAll<HTMLElement>('.player-chapter')], labels = [...root.querySelectorAll<HTMLElement>('.player-labels li')];
    const track = root.querySelector<HTMLElement>('.player-track');
    let active = true, seconds = 0, entry = 0, started = false, playing = false, userPaused = false, inView = false, replayOnView = false;
    let shownChapter = -1;

    const render = () => {
      if (!active) return;
      // Before it plays, the scroll into the section opens the window.
      const story = started ? storyAt(seconds) : OPEN * clamp(entry / .85);
      draw(story);
      root.dataset.story = story.toFixed(5);
      chapters.forEach((el, i) => el.style.setProperty('--fill', String(clamp((seconds - CHAPTERS[i].start) / (CHAPTERS[i].end - CHAPTERS[i].start)))));
      let current = -1;
      if (started) CHAPTERS.forEach((chapter, i) => { if (seconds >= chapter.start - .01) current = i; });
      if (current !== shownChapter) {
        shownChapter = current;
        [chapters, labels].forEach(list => list.forEach((el, i) => el.classList.toggle('is-current', i === current)));
        track?.setAttribute('aria-valuetext', current < 0 ? 'Not started' : `${CHAPTERS[current].title}, chapter ${current + 1} of ${CHAPTERS.length}`);
      }
      track?.setAttribute('aria-valuenow', seconds.toFixed(1));
      if (track) track.dataset.seconds = seconds.toFixed(3);
    };
    const set = (next: PlayerStatus) => { playing = next === 'playing'; setStatus(next); };
    const play = () => { if (!started) { started = true; seconds = 0; } if (seconds >= STORY_SECONDS) seconds = 0; userPaused = false; set('playing'); };
    const pause = (byUser = true) => { if (!started) return; if (byUser) userPaused = true; if (playing || byUser) set(seconds >= STORY_SECONDS ? 'ended' : 'paused'); };
    const seek = (to: number) => { started = true; seconds = clamp(to / STORY_SECONDS) * STORY_SECONDS; userPaused = true; render(); set(seconds >= STORY_SECONDS ? 'ended' : 'paused'); };
    const replay = () => { started = true; seconds = 0; render(); play(); };
    const maybeStart = () => {
      if (!inView || entry < .85) return;
      if (replayOnView) { replayOnView = false; replay(); return; }
      if (!started) { started = true; seconds = 0; play(); }
      else if (!playing && !userPaused && seconds < STORY_SECONDS) play();
    };
    controls.current = { toggle: () => { if (!started || seconds >= STORY_SECONDS) replay(); else if (playing) pause(); else play(); }, seek, replay, pause: () => pause() };

    const tick = (_time: number, delta: number) => {
      if (!playing) return;
      seconds = Math.min(STORY_SECONDS, seconds + Math.min(delta, 100) / 1000);
      render();
      if (seconds >= STORY_SECONDS) set('ended');
    };
    gsap.ticker.add(tick);

    // Scrolling into the section opens the window; scrolling well back above it
    // closes it again, and the story starts over next time.
    const entryTrigger = ScrollTrigger.create({
      trigger: root, start: 'top bottom', end: 'top top',
      onUpdate: self => {
        entry = self.progress;
        if (started && entry < .45) { started = false; seconds = 0; userPaused = false; set('waiting'); }
        render();
        maybeStart();
      },
      onRefresh: self => { entry = self.progress; render(); },
    });
    entry = entryTrigger.progress;
    render();

    const observer = new IntersectionObserver(([record]) => {
      inView = record.intersectionRatio >= .55;
      if (!inView && playing) pause(false);
      maybeStart();
    }, { threshold: [0, .35, .55, .8, 1] });
    if (frame) observer.observe(frame);

    // Taking a hand in the conversation pauses the film.
    const takeOver = (event: Event) => { if (playing && frame?.contains(event.target as Node)) pause(); };
    root.addEventListener('pointerdown', takeOver);
    root.addEventListener('focusin', takeOver);
    const redraw = () => render();
    const seekTo = (event: Event) => { const detail = (event as CustomEvent<{ story?: number; seconds?: number }>).detail ?? {}; seek(detail.seconds ?? timeOf(detail.story ?? OPEN)); };
    const replayRequest = () => { if (inView && entry >= .85) replay(); else replayOnView = true; };
    root.addEventListener('scene-redraw', redraw);
    root.addEventListener('story-seek', seekTo);
    root.addEventListener('story-replay', replayRequest);
    return () => {
      active = false;
      gsap.ticker.remove(tick);
      entryTrigger.kill();
      observer.disconnect();
      root.removeEventListener('pointerdown', takeOver);
      root.removeEventListener('focusin', takeOver);
      root.removeEventListener('scene-redraw', redraw);
      root.removeEventListener('story-seek', seekTo);
      root.removeEventListener('story-replay', replayRequest);
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
