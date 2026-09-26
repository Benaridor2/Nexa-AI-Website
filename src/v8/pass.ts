import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// The reading pass. A heading arrives on the page in a quiet grey; as it
// reaches the reading zone, a soft highlight runs over its words in reading
// order, and every word it passes turns to ink. The key phrase turns purple:
// the AI has read it, and NEXA has made it an answer. The pass follows the
// scroll, both ways. Section labels draw their baseline the same way.
//
// Under reduced motion, and where color-mix is not supported, the words are
// simply ink and the key phrase purple.
const clamp = (v: number) => Math.min(1, Math.max(0, v));

export function useReadingPass(root: React.RefObject<HTMLElement | null>, enabled = true) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const passes = [...el.querySelectorAll<HTMLElement>('[data-pass]')];
    const lines = [...el.querySelectorAll<HTMLElement>('[data-line]')];
    // Words become spans once. Text inside <em>, <strong> or .k is the key phrase.
    const split = (node: HTMLElement) => {
      if (node.dataset.split) return;
      node.dataset.split = '1';
      let i = 0;
      const walk = (parent: Node) => {
        [...parent.childNodes].forEach(child => {
          if (child.nodeType === Node.TEXT_NODE) {
            const key = Boolean((child.parentElement as HTMLElement | null)?.closest('em, strong, .k'));
            const frag = document.createDocumentFragment();
            (child.textContent || '').split(/(\s+)/).forEach(part => {
              if (!part) return;
              if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
              const w = document.createElement('span');
              w.className = key ? 'w k' : 'w';
              w.style.setProperty('--i', String(i++));
              w.textContent = part;
              frag.appendChild(w);
            });
            parent.replaceChild(frag, child);
          } else if (child.nodeType === Node.ELEMENT_NODE) walk(child);
        });
      };
      walk(node);
      node.style.setProperty('--n', String(i));
    };
    passes.forEach(split);
    const still = !enabled || matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (still) { passes.forEach(p => p.classList.add('is-read')); lines.forEach(l => l.style.setProperty('--p', '1')); return; }

    // One measure for everything, on every scroll: cheap, and never out of step.
    let frame = 0;
    const measure = () => {
      frame = 0;
      const vh = innerHeight;
      const atEnd = scrollY >= ScrollTrigger.maxScroll(window) - 2;
      passes.forEach(p => {
        const top = p.getBoundingClientRect().top;
        // The pass runs while the heading travels from 90% of the viewport up to 45%.
        const progress = atEnd && top < vh ? 1 : clamp((vh * .9 - top) / (vh * .45));
        p.style.setProperty('--p', progress.toFixed(4));
      });
      lines.forEach(l => {
        const top = l.getBoundingClientRect().top;
        const progress = atEnd && top < vh ? 1 : clamp((vh * .94 - top) / (vh * .34));
        l.style.setProperty('--p', progress.toFixed(4));
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    ScrollTrigger.addEventListener('refresh', schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      ScrollTrigger.removeEventListener('refresh', schedule);
    };
  }, [root, enabled]);
}
