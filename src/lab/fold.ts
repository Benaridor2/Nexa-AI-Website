import gsap from 'gsap';

// The Nexa fold: a three-panel card hinged like an accordion.
//
//   panel 1  the place   (what a guest sees)
//   panel 2  the layer   (Nexa's lining: live data from the PMS, the route home)
//   panel 3  the offer   (what an AI can recommend and send to the property's website)
//
// Closed, only the place shows, with a violet seam at the fold. Half open, the
// profile seen from above draws the N of the Nexa mark. Open flat, the whole
// record reads like one page. Geometry is computed here and written as CSS 3D
// transforms, so every word on the panels stays real, selectable text.

export type FoldState = {
  /** Half-angle of each fold in degrees: 0 flat, 90 closed. */
  fold: number;
  /** Camera around the object, degrees. */
  yaw: number;
  pitch: number;
  roll: number;
  /** Composition offset in px, and scale. */
  x: number;
  y: number;
  scale: number;
  /** How far the Nexa layer is seated in its slot: 0 absent, 1 in place. */
  link: number;
  /** How well the offer is aligned to the rest: 0 loose (unpriced), 1 locked. */
  lock: number;
  /** Floor shadows and contact, 0..1. */
  ground: number;
  /** The layer tucked away: 0 open, 1 folded flat into a seam between place and offer. */
  tuck: number;
};

export const FOLD_DEFAULT: FoldState = { fold: 38, yaw: -16, pitch: -14, roll: 0, x: 0, y: 0, scale: 1, link: 1, lock: 1, ground: 1, tuck: 0 };

type Vec = { x: number; z: number };
const rad = (d: number) => d * Math.PI / 180;

export function createFold(root: HTMLElement) {
  const rig = root.querySelector<HTMLElement>('.fold-rig')!;
  const panels = [...root.querySelectorAll<HTMLElement>('.fold-panel')];
  const shades = panels.map(p => p.querySelector<HTMLElement>('.fold-shade'));
  const shadows = [...root.querySelectorAll<SVGPolygonElement>('.fold-shadow')];
  const contacts = [...root.querySelectorAll<SVGLineElement>('.fold-contact')];
  const floor = root.querySelector<HTMLElement>('.fold-floor');
  const slot = root.querySelector<HTMLElement>('.fold-slot');
  const state: FoldState = { ...FOLD_DEFAULT };

  const render = () => {
    const vertical = root.dataset.orientation === 'vertical';
    const w = panels[0].offsetWidth, h = panels[0].offsetHeight, t = 6;
    // The length each hinge advances along: across on desktop, down on phones.
    const span = vertical ? h : w;
    const a = state.fold;
    // Alternate the folds so the profile zigzags: +a, -a, +a.
    const turns = [a, -a, a];
    // Hinge points in the profile plane: (along, depth).
    const pts: Vec[] = [{ x: 0, z: 0 }];
    turns.forEach((f, i) => { const p = pts[i]; pts.push(vertical ? { x: p.x + span * Math.cos(rad(f)), z: p.z + span * Math.sin(rad(f)) } : { x: p.x + span * Math.cos(rad(f)), z: p.z - span * Math.sin(rad(f)) }); });
    const xs = pts.map(p => p.x), zs = pts.map(p => p.z);
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cz = (Math.min(...zs) + Math.max(...zs)) / 2;

    // Panel 2 slides in along the mark's slant; panel 3 hangs loose until locked.
    const unseat = 1 - state.link, loose = 1 - state.lock;
    panels.forEach((panel, i) => {
      const p = pts[i];
      // Stack offsets keep closed panels from z-fighting.
      const stack = (state.fold / 90) * t * 1.2 * i;
      let extra = '';
      const tuck = state.tuck, seam = 5 / span;
      if (i === 1) extra = (vertical ? ` translate(${-unseat * w * 0.58}px, ${-unseat * h * 0.22}px)` : ` translate(${unseat * w * 0.2}px, ${-unseat * h * 0.62}px)`) + (tuck ? (vertical ? ` scaleY(${1 - tuck * (1 - seam)})` : ` scaleX(${1 - tuck * (1 - seam)})`) : '');
      if (i === 2) extra = (vertical ? ` translate(${loose * w * 0.05}px, ${loose * h * 0.14 - tuck * (h - 5)}px) rotateZ(${loose * -2.6}deg)` : ` translate(${loose * w * 0.09 - tuck * (w - 5)}px, ${loose * h * 0.07}px) rotateZ(${loose * 3.2}deg)`);
      if (i === 0 && tuck) extra = vertical ? ` translateY(${tuck * (h - 5) / 2}px)` : ` translateX(${tuck * (w - 5) / 2}px)`;
      if (i === 1 && tuck) extra = (vertical ? ` translateY(${tuck * (h - 5) / 2}px)` : ` translateX(${tuck * (w - 5) / 2}px)`) + extra;
      if (i === 2 && tuck) extra = (vertical ? ` translateY(${tuck * (h - 5) / 2}px)` : ` translateX(${tuck * (w - 5) / 2}px)`) + extra;
      const seat = vertical
        ? `translate3d(${-w / 2}px, ${p.x - cx}px, ${p.z - cz - stack}px) rotateX(${turns[i]}deg)`
        : `translate3d(${p.x - cx}px, ${-h / 2}px, ${p.z - cz - stack}px) rotateY(${turns[i]}deg)`;
      panel.style.transform = seat + extra;
      // The empty slot marks where the layer belongs while it is missing.
      if (i === 1 && slot) { slot.style.transform = seat; slot.style.opacity = String(Math.max(0, 1 - state.link * 2.2) * (1 - state.tuck)); }
      if (i === 1) panel.style.opacity = String(Math.min(1, state.link * 1.6));
      // Light from the front left and above: faces turned toward it are brighter.
      let lit: number;
      if (vertical) { const f = rad(turns[i] + state.pitch); lit = Math.max(0, 0.55 * Math.sin(f) + 0.83 * Math.cos(f)); }
      else { const f = rad(turns[i] + state.yaw); lit = Math.max(0, -0.78 * Math.sin(f) + 0.62 * Math.cos(f)); }
      const shade = shades[i];
      if (shade) shade.style.opacity = String(Math.min(0.62, Math.max(0, (0.88 - lit) * 0.72)));
    });

    rig.style.transform = `translate3d(${state.x}px, ${state.y}px, 0) scale(${state.scale}) rotateX(${state.pitch}deg) rotateY(${state.yaw}deg) rotateZ(${state.roll}deg)`;

    // Shadows on the floor: each panel projected along the light, from its bottom edge.
    if (floor) {
      floor.style.display = vertical ? 'none' : '';
      if (vertical) return;
      floor.style.transform = `translate3d(0, ${h / 2}px, 0) rotateX(90deg)`;
      floor.style.opacity = String(state.ground);
      const off = { x: h * 0.62, z: -h * 0.36 };
      panels.forEach((_, i) => {
        if (!shadows[i]) return;
        const a0 = pts[i], a1 = pts[i + 1];
        const present = i === 1 ? state.link : 1;
        const lift = i === 2 ? (1 - state.lock) * 10 : i === 1 ? (1 - state.link) * h * 0.62 : 0;
        const q = (p: Vec, k: number) => `${(p.x - cx + off.x * k + lift * 0.4).toFixed(1)},${(p.z - cz + off.z * k).toFixed(1)}`;
        shadows[i].setAttribute('points', [q(a0, 0), q(a1, 0), q(a1, 1), q(a0, 1)].join(' '));
        shadows[i].style.opacity = String(present * 0.9);
        const c = contacts[i];
        if (c) { c.setAttribute('x1', String(a0.x - cx)); c.setAttribute('y1', String(a0.z - cz)); c.setAttribute('x2', String(a1.x - cx)); c.setAttribute('y2', String(a1.z - cz)); c.style.opacity = String(present * Math.max(0, 1 - lift / 30)); }
      });
    }
  };

  const set = (next: Partial<FoldState>) => { Object.assign(state, next); render(); };
  return { state, render, set };
}

export type FoldController = ReturnType<typeof createFold>;

// Tween the fold's state; interrupting a running tween continues from wherever it is.
export function tweenFold(fold: FoldController, to: Partial<FoldState>, vars: gsap.TweenVars = {}) {
  gsap.killTweensOf(fold.state);
  return gsap.to(fold.state, { ...to, duration: 1.1, ease: 'power3.inOut', ...vars, onUpdate: fold.render });
}
