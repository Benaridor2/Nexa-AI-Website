// Scroll pacing for the pinned scenes.
//
// `knots` re-time a scene without touching its choreography: each pair maps a
// point of the story (the progress the renderer sees) to a point of the scroll
// (the section's own progress). Long quiet stretches get shorter and quick,
// busy transitions get more room, so every bit of scrolling shows something.
//
// `windows` are the transitions that look unfinished when frozen halfway (a
// card fading in, a crossfade, a panel sliding). Scrolling that stops inside
// one completes it in the direction of travel. A fast gesture stops once at
// the end of a `key` window, so the main beats are never flicked past.
export type Pacing = {
  readonly knots?: readonly (readonly [story: number, scroll: number])[];
  readonly windows: readonly (readonly [start: number, end: number, key?: 'key'])[];
};

// Scroll positions below come from lengths in viewport heights over the
// conversation's 6.75 viewport heights of travel (700svh, starting at 75%).
export const PACING: Record<string, Pacing> = {
  'guest-story': {
    knots: [[0, 0], [.455, .455], [.54, .529], [.57, .5809], [.60, .6164], [.655, .6831], [.76, .735], [.826, .7972], [.877, .889], [.892, .9039], [.921, .9409], [1, 1]],
    windows: [[.135, .18], [.2825, .295], [.325, .335], [.36, .47, 'key'], [.563, .585], [.585, .655, 'key'], [.826, .877, 'key']],
  },
  // 480svh: the added distance goes to the line reaching the OTA and its hold.
  priced: {
    knots: [[0, 0], [.28, .2505], [.33, .3163], [.395, .4532], [1, 1]],
    windows: [[.20, .28], [.28, .365, 'key'], [.395, .48, 'key'], [.53, .57], [.57, .64, 'key'], [.675, .745, 'key'], [.78, .85, 'key'], [.865, .93, 'key'], [.93, .96]],
  },
  'how-it-works': {
    windows: [[.13, .20], [.4606, .5302, 'key'], [.6346, .7338, 'key'], [.786, .817], [.8695, .9165, 'key'], [.9426, .9687]],
  },
};

const map = (knots: Pacing['knots'], value: number, from: 0 | 1) => {
  if (!knots) return value;
  const to = from ? 0 : 1;
  for (let i = 1; i < knots.length; i++) {
    const a = knots[i - 1], b = knots[i];
    if (value <= b[from] || i === knots.length - 1) {
      const t = (value - a[from]) / (b[from] - a[from] || 1);
      return a[to] + (b[to] - a[to]) * Math.min(1, Math.max(0, t));
    }
  }
  return value;
};
// Section scroll progress to story progress, and back.
export const toStory = (pacing: Pacing | undefined, scroll: number) => map(pacing?.knots, scroll, 1);
export const toScroll = (pacing: Pacing | undefined, story: number) => map(pacing?.knots, story, 0);
