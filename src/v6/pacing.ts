// Scroll pacing for the pinned scenes.
//
// `knots` re-time a scene without touching its choreography: each pair maps a
// point of the story (the progress the renderer sees) to a point of the scroll
// (the section's own progress). Long quiet stretches get shorter and quick,
// busy transitions get more room, so every bit of scrolling shows something.
//
// `windows` are the transitions that look unfinished when frozen halfway (a
// card fading in, a crossfade, a panel sliding). Scrolling that stops just
// short of a window's end completes it in the direction of travel.
export type Pacing = {
  readonly knots?: readonly (readonly [story: number, scroll: number])[];
  readonly windows: readonly (readonly [start: number, end: number])[];
};

export const PACING: Record<string, Pacing> = {
  // The OTA beat gets more of PRICED's 3.4 viewport heights; the rest is a little tighter.
  priced: {
    knots: [[0, 0], [.28, .25], [.33, .3147], [.395, .4324], [1, 1]],
    windows: [[.20, .28], [.28, .365], [.395, .48], [.53, .57], [.57, .64], [.675, .745], [.78, .85], [.865, .93], [.93, .96]],
  },
  'how-it-works': {
    windows: [[.13, .20], [.4606, .5302], [.6346, .7338], [.786, .817], [.8695, .9165], [.9426, .9687]],
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
