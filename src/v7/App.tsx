import { useEffect, useRef, useState } from 'react';
import { Arrow, Conversation } from '../v6/Scenes';
import { SiteHeader } from '../v6/Header';
import { SiteFooter, useOnboarding } from '../v6/Shell';

// V7 homepage. The structure and proportions follow what the best product
// sites share (see DESIGN_V7.md): a short headline beside the product, a
// trust strip, feature sections that pair a heading with a real product
// visual, proof, a closing call to action. The page scrolls plainly; the
// ChatGPT conversation plays itself in the hero.

import { Below, PMS, useReveal } from './Below';
export default function App() {
  const page = useRef<HTMLDivElement>(null);
  const { open, element: onboarding } = useOnboarding();
  const [reduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  useReveal(page);
  useEffect(() => { document.title = 'NEXA - Be the answer.'; }, []);
  useEffect(() => {
    if (!location.hash) return;
    void document.fonts.ready.then(() => requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView()));
  }, []);
  const watch = () => {
    const chat = document.getElementById('guest-story');
    chat?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    chat?.dispatchEvent(new Event('film-replay'));
  };
  return <div className="v3-page v7-light v7 v7-film" ref={page}>
    <a className="skip-link" href="#main">Skip to content</a>
    <SiteHeader onGetPriced={() => open('priced')} onSignIn={() => open('signin')}/>
    <main id="main">

      <section className="v7-hero wrap" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="v7-kicker">The AI connector for hotels &amp; vacation rentals</p>
          <h1 id="hero-title">Your next guest is asking an AI.<br/><span>Be the answer.</span></h1>
          <p className="hero-lead">NEXA gives AI assistants your live availability, your final price and a direct route to your own website, straight from the PMS you already run. So the AI can recommend you, and the guest books with you.</p>
          <div className="hero-actions"><button type="button" className="v7-button" onClick={() => open()}>Get Priced <Arrow diagonal/></button><button type="button" className="v7-button is-outline" onClick={watch}>Watch a booking happen</button></div>
          <p className="hero-pms"><span>Connects through</span> {PMS.join(' · ')}</p>
        </div>
        <div className="hero-demo">
          <Conversation motion mode="film"/>
        </div>
      </section>

      <Below open={() => open()} watch={watch}/>
    </main>
    <SiteFooter home/>
    {onboarding}
  </div>;
}
