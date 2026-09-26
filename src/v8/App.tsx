import { useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNarrativeScroll } from '../v6/useNarrativeScroll';
import { Arrow, Conversation, Label } from '../v6/Scenes';
import { SiteHeader } from '../v6/Header';
import { SiteFooter, useOnboarding } from '../v6/Shell';
import { Below, PMS, useReveal } from '../v7/Below';

// V8 homepage: the hero and the scroll-driven ChatGPT conversation from V6
// (the version that was liked), without the player bar; under them, the V7
// sections built from the research into the best product sites.
//
// The conversation follows the scroll. While it is pinned, a pill offers to
// skip it, and a flick of the wheel skips it: the conversation runs to its end
// and the page moves on.

export default function App() {
  const [flow, setFlow] = useState(() => matchMedia('(prefers-reduced-motion: reduce), (max-height: 619px)').matches || new URLSearchParams(location.search).get('view') === 'static');
  const page = useRef<HTMLDivElement>(null);
  const { open, element: onboarding } = useOnboarding();
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce), (max-height: 619px)');
    const change = () => setFlow(media.matches || new URLSearchParams(location.search).get('view') === 'static');
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, []);
  useNarrativeScroll(!flow);
  useReveal(page);
  useEffect(() => { document.title = 'NEXA - Be the answer.'; }, []);
  // Scroll restoration for the async route, as on V6: a reload returns to the
  // saved position once the page has laid out; a hash opens its section.
  useEffect(() => {
    let cancelled = false, interacted = false;
    const scrollKey = `nexa-v8-scroll:${location.pathname}${location.search}`;
    const onInput = () => { interacted = true; };
    const savePosition = () => { try { sessionStorage.setItem(scrollKey, String(scrollY)); } catch { /* Storage may be unavailable. */ } };
    window.addEventListener('pagehide', savePosition);
    window.addEventListener('wheel', onInput, { passive: true });
    window.addEventListener('touchstart', onInput, { passive: true });
    window.addEventListener('keydown', onInput);
    const images = [...(page.current?.querySelectorAll<HTMLImageElement>('img[loading="eager"]') || [])];
    void Promise.all([document.fonts.ready, ...images.map(img => img.decode().catch(() => undefined))]).then(() => {
      if (cancelled) return;
      ScrollTrigger.refresh();
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
      if (!interacted && navigation?.type === 'reload') {
        try {
          const saved = sessionStorage.getItem(scrollKey);
          sessionStorage.removeItem(scrollKey);
          if (saved !== null && Number.isFinite(Number(saved))) window.scrollTo({ top: Number(saved), behavior: 'instant' });
        } catch { /* Native scroll remains usable without storage. */ }
      } else if (!interacted && location.hash) {
        document.getElementById(location.hash.slice(1))?.scrollIntoView();
      }
      ScrollTrigger.update();
    });
    return () => {
      cancelled = true;
      window.removeEventListener('pagehide', savePosition);
      window.removeEventListener('wheel', onInput);
      window.removeEventListener('touchstart', onInput);
      window.removeEventListener('keydown', onInput);
    };
  }, [flow]);
  // "Watch a booking happen" from the sections: back to the start of the conversation.
  const watch = () => {
    const chat = document.getElementById('guest-story');
    if (!chat) return;
    if (flow) chat.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else chat.dispatchEvent(new Event('story-watch'));
  };
  return <div className={`v3-page v7-light v8 ${flow ? 'is-flow' : 'is-motion'}`} ref={page}>
    <a className="skip-link" href="#main">Skip to content</a>
    <SiteHeader onGetPriced={() => open('priced')} onSignIn={() => open('signin')}/>
    <main id="main">
      <section className="hero wrap" aria-labelledby="hero-title">
        <div className="hero-grid" aria-hidden="true"/><div className="hero-content"><Label>THE AI CONNECTOR FOR HOTELS & VACATION RENTALS</Label><h1 id="hero-title">Your next guest is asking an AI.<br/><em>Be the answer.</em></h1><p>Right now, as you read this, a traveler is asking ChatGPT where to stay. If your property is not part of that conversation, your competitor's is. NEXA AI makes sure your property is priced, listed, bookable direct.</p><div className="hero-actions"><button className="button button-dark" onClick={() => open()}>Get Priced <Arrow diagonal /></button><a className="text-link" href="#watch-a-booking">Watch a booking happen <Arrow/></a></div><p className="hero-pms"><span>Connects through the PMS you already run:</span> {PMS.map(name => name.replace(' ', ' ')).join(' · ')}</p></div>
      </section>
      <Conversation motion={!flow} controls={false}/>
      {/* The V7 scope starts here, so its type and colour rules reach the sections only; the hero and the conversation are V6 to the pixel. */}
      <div className="v7"><Below open={() => open()} watch={watch}/></div>
    </main>
    <SiteFooter home/>
    {onboarding}
  </div>;
}
