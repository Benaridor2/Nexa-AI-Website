import { useEffect } from 'react';

// Threads: the violet lines that connect things. They share the mark's
// geometry: straight runs joined by one slanted segment (the N's diagonal),
// never free curves. Paths are measured from real element positions.

export type Point = { x: number; y: number };
const SLANT = Math.tan(18 * Math.PI / 180);

/** Across then down (or up) along the mark's slant, then across again. */
export function slantRoute(a: Point, b: Point, split = .5) {
  const dy = b.y - a.y, run = Math.abs(dy) * SLANT;
  const mid = a.x + (b.x - a.x) * split;
  const x1 = Math.max(a.x, Math.min(mid - run / 2, b.x)), x2 = Math.min(b.x, x1 + run);
  return `M${a.x.toFixed(1)} ${a.y.toFixed(1)} H${x1.toFixed(1)} L${x2.toFixed(1)} ${b.y.toFixed(1)} H${b.x.toFixed(1)}`;
}

/** Down then across along the slant, for vertical layouts. */
export function slantRouteDown(a: Point, b: Point, split = .5) {
  const dx = b.x - a.x, run = Math.abs(dx) / SLANT;
  const mid = a.y + (b.y - a.y) * split;
  const y1 = Math.max(a.y, Math.min(mid - run / 2, b.y)), y2 = Math.min(b.y, y1 + run);
  return `M${a.x.toFixed(1)} ${a.y.toFixed(1)} V${y1.toFixed(1)} L${b.x.toFixed(1)} ${y2.toFixed(1)} V${b.y.toFixed(1)}`;
}

export function anchor(el: Element, box: DOMRect, side: 'left' | 'right' | 'top' | 'bottom' | 'center'): Point {
  const r = el.getBoundingClientRect();
  const x = side === 'left' ? r.left : side === 'right' ? r.right : r.left + r.width / 2;
  const y = side === 'top' ? r.top : side === 'bottom' ? r.bottom : r.top + r.height / 2;
  return { x: x - box.left, y: y - box.top };
}

export function setPath(path: SVGPathElement | null, d: string) {
  if (!path || path.getAttribute('d') === d) return;
  path.setAttribute('d', d);
  path.style.setProperty('--len', String(Math.ceil(path.getTotalLength()) + 2));
}

/** Redraws a section's threads whenever it resizes. */
export function useThreads(root: React.RefObject<HTMLElement | null>, draw: (root: HTMLElement, box: DOMRect) => void, deps: unknown[] = []) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const run = () => draw(el, el.getBoundingClientRect());
    const ro = new ResizeObserver(run);
    ro.observe(el);
    void document.fonts?.ready.then(run);
    run();
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
