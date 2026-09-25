import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Only completed data checks have a small magnetic landing zone. Everything
// else, including the question and website handoff, follows scroll distance.
const checkpoints: Record<string, number[]> = {
  priced: [.65, .755, .86],
  'how-it-works': [.43],
};
const scenes = new Set(['guest-story', 'priced', 'how-it-works', 'connector']);

export function useNarrativeScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let settling = false;
    let direction = 0;
    const cancelLanding = () => {
      clearTimeout(timer);
      if (settling) {
        settling = false;
        lenis.scrollTo(lenis.scroll, { immediate: true });
      }
    };
    const activeScene = () => ScrollTrigger.getAll().find(trigger => {
      const el = trigger.trigger as HTMLElement | undefined;
      return el?.id && scenes.has(el.id) && trigger.progress > 0 && trigger.progress < 1 && el.getBoundingClientRect().top <= 1;
    });
    const landNearby = () => {
      const trigger = activeScene();
      if (!trigger || document.querySelector('dialog[open]')) return;
      const points = checkpoints[(trigger.trigger as HTMLElement).id];
      if (!points) return;
      // Never pull against a gesture or jump across a narrative beat.
      const target = points.map(p => trigger.start + (trigger.end - trigger.start) * p)
        .find(y => (y - lenis.scroll) * direction > 2 && Math.abs(y - lenis.scroll) < 42);
      if (target === undefined) return;
      settling = true;
      lenis.scrollTo(target, {
        duration: .24,
        easing: t => 1 - Math.pow(1 - t, 3),
        onComplete: () => { settling = false; },
      });
    };
    const lenis = new Lenis({
      lerp: .18,
      smoothWheel: true,
      syncTouch: false,
      anchors: true,
      prevent: node => Boolean(node.closest('dialog')),
      virtualScroll: data => {
        cancelLanding();
        if (data.event.type !== 'wheel' || (data.event as WheelEvent).ctrlKey || document.querySelector('dialog[open]')) return true;
        direction = Math.sign(data.deltaY);
        // Small wheel/trackpad input is unchanged. Only unusually large
        // impulses are compressed: no minimum distance or forced next step.
        if (activeScene()) {
          const distance = Math.abs(data.deltaY);
          if (distance > 180) data.deltaY = direction * (180 + 420 * (1 - Math.exp(-(distance - 180) / 420)));
          timer = setTimeout(landNearby, 260);
        }
        return true;
      },
    });
    window.addEventListener('keydown', cancelLanding);
    window.addEventListener('pointerdown', cancelLanding, { passive: true });
    window.addEventListener('touchstart', cancelLanding, { passive: true });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (seconds: number) => lenis.raf(seconds * 1000);
    gsap.ticker.add(tick);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', cancelLanding);
      window.removeEventListener('pointerdown', cancelLanding);
      window.removeEventListener('touchstart', cancelLanding);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [enabled]);
}
