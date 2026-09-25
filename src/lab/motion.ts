import { useEffect } from 'react';

// One motion system, five verbs. Every animation on the page is one of these.
//   reveal     something arrives and stays (text, a face, a value)
//   focus      attention moves to one thing (a panel, a state)
//   connect    a line or path joins two things (PMS → layer, answer → website)
//   transform  the object changes shape or context (fold, unfold, tuck)
//   settle     a small, physical landing at the end of a transform
export const MOTION = {
  reveal: { duration: .7, ease: 'power3.out' },
  focus: { duration: .45, ease: 'power2.out' },
  connect: { duration: .8, ease: 'power2.inOut' },
  transform: { duration: 1.25, ease: 'power3.inOut' },
  settle: { duration: .5, ease: 'back.out(1.5)' },
} as const;

export const prefersReducedMotion = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

// The still version: reduced motion, a low-power device, or ?still in the URL.
// Everything is shown in its finished, readable state; nothing waits to animate.
export const isStill = () => {
  if (prefersReducedMotion() || new URLSearchParams(location.search).has('still')) return true;
  const nav = navigator as Navigator & { deviceMemory?: number };
  return (nav.deviceMemory ?? 8) <= 2 || (nav.hardwareConcurrency ?? 8) <= 2;
};

// Elements marked data-reveal get .is-in once they reach the viewport, and keep it:
// returning to a section never hides what was already read.
export function useReveal(root: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const items = [...el.querySelectorAll<HTMLElement>('[data-reveal]')];
    if (isStill() || !('IntersectionObserver' in window)) { items.forEach(i => i.classList.add('is-in')); return; }
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    }), { rootMargin: '0px 0px -12% 0px', threshold: .15 });
    items.forEach(i => io.observe(i));
    return () => io.disconnect();
  }, [root]);
}
