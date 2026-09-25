import { useEffect, useRef, useState } from 'react';
import { useNarrativeScroll } from './useNarrativeScroll';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Arrow, Conversation, Label } from './Scenes';
import { HowItWorksSteps, PricedOrUnpriced, ProductConnector } from './Sections';
import { SiteHeader } from './Header';
import { SiteFooter, useOnboarding, useRise } from './Shell';



const PMS = ['Guesty', 'Hostaway', 'BoomNow', 'Hospitable', 'Rentals United', 'HotelSync'];
const FAQ = [
  ['Where does the guest complete the booking?', "On your property's own website, using your existing booking and payment flow. The reservation then reaches your PMS as a direct website booking."],
  ['Does the guest need to install or activate anything?', 'No. Guests ask the AI assistant they already use. There is no guest installation, account connection, or NEXA activation step.'],
  ['What does my property need to connect?', 'Operator onboarding connects your PMS booking data and your direct booking destination. We review your PMS and website setup with you; guest simplicity does not mean the property has no setup.'],
  ['Can I keep my existing website and channels?', 'Yes. Your own website remains the booking destination. NEXA adds a route from AI discovery to your direct channel, alongside your existing distribution.'],
  ['Are Direct and Agent separate packages?', 'They describe two types of demand through one connection. Direct is a request naming your property or brand. Agent is a destination-led request for a suitable stay.'],
  ['What happens to the guest relationship?', "Booking and payment take place with the property. Your website and PMS continue to handle the reservation. Specific data handling is reviewed during onboarding."],
  ['Does NEXA guarantee a recommendation?', 'No. AI assistants decide which answers and recommendations to show. NEXA makes actionable property data available; it does not promise placement or selection in every answer.'],
  ['How is NEXA priced?', 'A commission on the bookings the AI brings you, and nothing else: no packages, no fixed monthly fees, cancel anytime. Its size depends on whether the guest asked for you by name. The full numbers are on the Pricing page.'],
];

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
  // Text never moves with the scroll or fades away: blocks appear once, gently, and stay.
  useRise();
  useEffect(() => {
    let cancelled = false;
    let interacted = false;
    const scrollKey = `nexa-v6-scroll:${location.pathname}${location.search}`;
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
      // The async route initially has no document height for native reload
      // restoration. Restore only a reload, after layout, and never after input.
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
  const action = (className = 'button') => <button className={className} onClick={() => open()}>Get Priced <Arrow diagonal /></button>;

  return <div className={`v3-page v7-light ${flow ? 'is-flow' : 'is-motion'}`} ref={page}>
    <a className="skip-link" href="#main">Skip to content</a>
    <SiteHeader onGetPriced={() => open('priced')} onSignIn={() => open('signin')}/>
    <main id="main">
      <section className="hero wrap" aria-labelledby="hero-title">
        <div className="hero-grid" aria-hidden="true"/><div className="hero-content"><Label>THE AI CONNECTOR FOR HOTELS & VACATION RENTALS</Label><h1 id="hero-title">Your next guest is asking an AI.<br/><em>Be the answer.</em></h1><p>Right now, as you read this, a traveler is asking ChatGPT where to stay. If your property is not part of that conversation, your competitor's is. NEXA AI makes sure your property is priced, listed, bookable direct.</p><div className="hero-actions">{action('button button-dark')}<a className="text-link" href="#watch-a-booking">Watch a booking happen <Arrow/></a></div><p className="hero-pms"><span>Connects through the PMS you already run:</span> {PMS.map(name => name.replace(' ', '\u00a0')).join('\u00a0· ')}</p></div>
      </section>
      <Conversation motion={!flow}/>
      <section className="connection-strip wrap" aria-labelledby="connection-title"><Label>HOW IT CONNECTS</Label><h2 id="connection-title">Your PMS. <span className="connection-line" aria-hidden="true"/> One connection. <span className="connection-line" aria-hidden="true"/> Your website.</h2><p>Exactly like connecting Airbnb or Booking.com, through the PMS you already run. No developer. No code. Live in days.</p><p className="legal-line">The guest books on your website, under your terms and your payment. Your website. Not the OTA's. Guest data belongs to YOU.</p><ul className="pms-names" aria-label="PMS integrations">{PMS.map(name => <li key={name}>{name}</li>)}</ul></section>
      <section className="proof-strip" aria-label="At a glance"><div className="wrap"><p><strong>65%+</strong><span>of the vote from global hospitality leaders</span></p><p><strong>WINNER</strong><span>HVC Startup Competition by SHIC, Zurich 2026</span></p><p><strong>37</strong><span>countries, USA &amp; EMEA</span></p></div></section>
      <PricedOrUnpriced/>
      <HowItWorksSteps/>

      <ProductConnector/>
      <section className="economics section-pad" id="economics" aria-labelledby="economics-title"><div className="wrap"><Label>[04] THE DIRECT CHANNEL / YOUR ADVANTAGE</Label></div><div className="wrap economics-grid"><div><h2 id="economics-title">New discovery.<br/><em>Your direct channel.</em></h2><p>Bring AI-originated demand to the booking experience you already own.</p><div className="economics-actions">{action('button button-dark')}<a className="text-link" href="/pricing#calculator">Calculate what you keep <Arrow/></a></div></div><div className="economics-ledger"><div><span>01</span><h3>Your website</h3><p>The destination for the booking.</p></div><div><span>02</span><h3>Your checkout</h3><p>The guest pays through your existing flow.</p></div><div><span>03</span><h3>Your relationship</h3><p>A direct website reservation in your PMS.</p></div><a className="economics-pricing" href="/pricing"><span>Pricing</span>One commission on the bookings the AI brings you. No monthly fees. <Arrow/></a></div></div></section>
      <section className="audience section-pad wrap" id="for-you" aria-labelledby="audience-title"><Label>[05] WHO IT IS FOR / HOTELS AND VACATION RENTALS</Label><header className="split-heading"><div><h2 id="audience-title">Your property.<br/><em>Your next chapter.</em></h2></div></header><div className="audience-grid"><article><div className="architectural hotel-lines" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div><span>01 / HOTELS</span><h3>I run a hotel.</h3><p>Defend your loyalty program, fill the gaps, shrink the OTA bill.</p><a className="audience-link" href="/nexa-ai-connector">Explore NEXA for hotels <Arrow diagonal/></a></article><article><div className="architectural rental-lines" aria-hidden="true"><i/><i/><i/></div><span>02 / VACATION RENTALS</span><h3>I run vacation rentals.</h3><p>Defend your brand, from one unit to a 3,000-unit portfolio.</p><a className="audience-link" href="/nexa-ai-connector">Explore NEXA for vacation rentals <Arrow diagonal/></a></article></div></section>
      <section className="faq section-pad wrap" id="faq" aria-labelledby="faq-title"><Label>[06] FAQ / STRAIGHT ANSWERS</Label><div><h2 id="faq-title">Straight answers.<br/><em>No sales voice.</em></h2></div><div className="faq-list">{FAQ.map(([q,a], i) => <details key={q}><summary><span className="faq-number">0{i+1}</span>{q}<span className="faq-plus" aria-hidden="true">+</span></summary><p>{a}{q === 'How is NEXA priced?' && <> <a className="faq-link" href="/pricing">See pricing <Arrow/></a></>}</p></details>)}</div></section>
      <section id="get-priced" className="closing section-pad" aria-labelledby="closing-title"><div className="closing-aperture" aria-hidden="true"><i/><i/></div><div className="wrap"><Label>GET PRICED</Label><h2 id="closing-title">Get PRICED<br/><em>before your competitor does.</em></h2>{action('button button-light')}<p>For hotels and vacation rental operators. Want to talk first? <a href="/contact">Leave your details</a>.</p></div></section>
    </main>
    <SiteFooter home/>
    {onboarding}
  </div>;
}

