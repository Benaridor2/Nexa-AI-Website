import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNarrativeScroll } from './useNarrativeScroll';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Arrow, BookingJourney, Comparison, Conversation, Label } from './Scenes';



const PMS = ['Guesty', 'Hostaway', 'BoomNow', 'Hospitable', 'Rentals United', 'HotelSync'];
const FAQ = [
  ['Where does the guest complete the booking?', "On your property's own website, using your existing booking and payment flow. The reservation then reaches your PMS as a direct website booking."],
  ['Does the guest need to install or activate anything?', 'No. Guests ask the AI assistant they already use. There is no guest installation, account connection, or NEXA activation step.'],
  ['What does my property need to connect?', 'Operator onboarding connects your PMS booking data and your direct booking destination. We review your PMS and website setup with you; guest simplicity does not mean the property has no setup.'],
  ['Can I keep my existing website and channels?', 'Yes. Your own website remains the booking destination. NEXA adds a route from AI discovery to your direct channel, alongside your existing distribution.'],
  ['Are Direct and Agent separate packages?', 'They describe two types of demand through one connection. Direct is a request naming your property or brand. Agent is a destination-led request for a suitable stay.'],
  ['What happens to the guest relationship?', "Booking and payment take place with the property. Your website and PMS continue to handle the reservation. Specific data handling is reviewed during onboarding."],
  ['Does NEXA guarantee a recommendation?', 'No. AI assistants decide which answers and recommendations to show. NEXA makes actionable property data available; it does not promise placement or selection in every answer.'],
  ['How is NEXA priced?', 'Commercial terms are being finalized. Get Priced to see the information needed for a conversation about your property. This prototype does not publish commission rates or savings promises.'],
];

export default function App() {
  const [flow, setFlow] = useState(() => matchMedia('(prefers-reduced-motion: reduce), (max-height: 619px)').matches || new URLSearchParams(location.search).get('view') === 'static');
  const page = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const open = () => { opener.current = document.activeElement as HTMLElement; dialog.current?.showModal(); };
  const trapDialogFocus = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== 'Tab') return;
    const buttons = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('button')];
    const first = buttons[0], last = buttons.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  };
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce), (max-height: 619px)');
    const change = () => setFlow(media.matches || new URLSearchParams(location.search).get('view') === 'static');
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, []);
  useNarrativeScroll(!flow);
  useLayoutEffect(() => {
    if (flow || !page.current) return;
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.section-label').forEach(el => {
        gsap.fromTo(el, { '--chapter-light': 0 }, { '--chapter-light': 1, ease: 'none', scrollTrigger: { trigger: el.closest('section'), start: 'top 85%', end: 'top 15%', scrub: true } });
      });
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(el => {
        gsap.fromTo(el, { y: 32, opacity: .4 }, { y: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 65%', scrub: true } });
      });
      gsap.fromTo('.proof-strip', { '--proof-light': 0 }, { '--proof-light': 1, ease: 'none', scrollTrigger: { trigger: '.proof-strip', start: 'top 88%', end: 'top 45%', scrub: true } });
      gsap.fromTo('.proof-strip strong', { y: 18, scale: .92 }, { y: 0, scale: 1, stagger: .15, ease: 'power2.out', scrollTrigger: { trigger: '.proof-strip', start: 'top 88%', end: 'top 45%', scrub: true } });
      const hero = gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      hero.to('.hero-content', { y: -90, opacity: 0, scale: .93, ease: 'none' }, 0)
        .to('.hero-grid', { y: 130, scale: 1.2, ease: 'none' }, 0);
      const connector = gsap.timeline({ scrollTrigger: { trigger: '.connector', start: 'top top', end: 'bottom bottom', scrub: true } });
      connector.fromTo('.product-explanation', { opacity: 1, y: 0 }, { opacity: 0, y: -24, duration: .65 }, 2.5)
        .fromTo('.connector-diagram', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .7 }, 3.2)
        .fromTo('.query-direct', { borderColor: '#863db3', backgroundColor: '#863db32b' }, { borderColor: '#863db350', backgroundColor: '#863db30d', duration: .7 }, 4)
        .fromTo('.merge-lines path', { strokeDasharray: 400, strokeDashoffset: 400 }, { strokeDashoffset: 0, duration: 1 }, 4.5)
        .fromTo('.connector-node', { scale: .85, opacity: .25 }, { scale: 1, opacity: 1, duration: .8 }, 5.2)
        .fromTo('.destination-line', { scaleX: 0 }, { scaleX: 1, duration: .7 }, 6)
        .fromTo('.connector-destination', { y: 25, opacity: .15 }, { y: 0, opacity: 1, duration: .8 }, 6.7)
        .to('.connector-destination', { boxShadow: '0 0 45px #863db34d', duration: .5 }, 7.5)
        .to({}, { duration: 1.5 });
      gsap.utils.toArray<HTMLElement>('.economics-ledger>div').forEach((el,i) => {
        gsap.fromTo(el, { x: 70, opacity: .15 }, { x: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: '.economics-ledger', start: `top ${85-i*12}%`, end: `top ${65-i*12}%`, scrub: true } });
      });
      gsap.utils.toArray<HTMLElement>('.architectural i').forEach((el,i) => {
        gsap.fromTo(el, { y: 110+(i%4)*25, rotateX: -65, opacity: .1 }, { y: 0, rotateX: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: el.closest('.architectural'), start: 'top 90%', end: 'top 35%', scrub: true } });
      });
      gsap.fromTo('.closing-aperture i:first-child', { xPercent: 0 }, { xPercent: -100, ease: 'none', scrollTrigger: { trigger: '.closing', start: 'top 95%', end: 'top 15%', scrub: true } });
      gsap.fromTo('.closing-aperture i:last-child', { xPercent: 0 }, { xPercent: 100, ease: 'none', scrollTrigger: { trigger: '.closing', start: 'top 95%', end: 'top 15%', scrub: true } });
      gsap.fromTo('.closing h2', { scale: .75, y: 60 }, { scale: 1, y: 0, ease: 'none', scrollTrigger: { trigger: '.closing', start: 'top 95%', end: 'top 15%', scrub: true } });
    }, page);
    return () => context.revert();
  }, [flow]);
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
  const action = (className = 'button') => <button className={className} onClick={open}>Get Priced <Arrow diagonal /></button>;

  return <div className={`v3-page ${flow ? 'is-flow' : 'is-motion'}`} ref={page}>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="main-header wrap"><a href="#" aria-label="Nexa home"><img src="/nexa-white.png" width="128" height="28" alt="Nexa"/></a><nav aria-label="Main navigation"><a href="#how-it-works">How it works</a><a href="#connector">The connector</a><a href="#faq">FAQ</a></nav>{action('button button-outline')}</header>
    <main id="main">
      <section className="hero wrap" aria-labelledby="hero-title">
        <div className="hero-grid" aria-hidden="true"/><div className="hero-content"><Label>THE AI CONNECTOR FOR HOTELS & VACATION RENTALS</Label><h1 id="hero-title">Your next guest is asking an AI.<br/><em>Be the answer.</em></h1><p>Right now, as you read this, a traveler is asking ChatGPT where to stay. If your property is not part of that conversation, your competitor's is. NEXA AI makes sure your property is priced, listed, bookable direct.</p><div className="hero-actions">{action('button button-dark')}<a className="text-link" href="#how-it-works">Watch a booking happen <Arrow/></a></div><p className="hero-promise">Built to Power Your Business, Never Compete With It</p></div>
      </section>
      <Conversation motion={!flow}/>
      <section className="connection-strip wrap" aria-labelledby="connection-title"><Label>HOW IT CONNECTS</Label><h2 id="connection-title">Your PMS. <span className="connection-line" aria-hidden="true"/> One connection. <span className="connection-line" aria-hidden="true"/> Your website.</h2><p>Exactly like connecting Airbnb or Booking.com, through the PMS you already run. No developer. No code. Live in days.</p><p className="legal-line">The guest books on your website, under your terms and your payment. Your website. Not the OTA's. Guest data belongs to YOU.</p><ul className="pms-names" aria-label="PMS integrations">{PMS.map(name => <li key={name}>{name}</li>)}</ul></section>
      <section className="proof-strip" aria-label="At a glance"><div className="wrap"><p><strong>65%+</strong><span>of the vote from global hospitality leaders</span></p><p><strong>WINNER</strong><span>HVC Startup Competition by SHIC, Zurich 2026</span></p><p><strong>37</strong><span>countries, USA &amp; EMEA</span></p></div></section>
      <Comparison motion={!flow}/>
      <BookingJourney motion={!flow}/>
      <section className="journey-steps wrap" aria-label="Four steps to a direct booking"><div><span>01</span><h3>The guest asks.</h3><p>Their AI turns to your website, backed by the NEXA AI Connector.</p></div><div><span>02</span><h3>NEXA AI answers.</h3><p>Instantly, in AI-to-AI communication.</p></div><div><span>03</span><h3>The AI recommends you.</h3><p>By name, with your final price and your best-price guarantee.</p></div><div><span>04</span><h3>The guest books with you.</h3><p>On your own website. The reservation reaches your PMS like any direct booking.</p></div><p className="guest-reassurance">The guest installs nothing. No application needed. No plugin installed in the chat by the guest. The guest just asks, the AI simply answers.</p></section>
      <div className="walkthrough-link wrap"><div><small>SEE THE COMPLETE JOURNEY</small><h3>Watch a booking happen, step by step.</h3></div><a className="button button-dark" href="/how-it-works">Watch now <Arrow diagonal/></a></div><section className="connector section-pad" id="connector" aria-labelledby="connector-title"><div className="wrap"><Label>[03] THE PRODUCT / NEXA AI CONNECTOR</Label><header className="split-heading" data-reveal><div><h2 id="connector-title">One connection.<br/><em>Two kinds of guests.</em></h2></div><p>Both book direct. You do not choose between them. One connection answers both.</p></header><div className="product-explanation"><article><span>NEXA DIRECT</span><h3>They ask for you.<br/><em>By name.</em></h3><p>They already know your property.<br/>Direct brings that booking home.</p></article><article><span>NEXA AGENT</span><h3>They ask for a stay.<br/><em>You become the answer.</em></h3><p>They are looking in your destination.<br/>Agent puts your property in the answer, priced and bookable.</p></article><strong>You do not choose between them. One connection answers both.</strong></div><div className="connector-diagram"><div className="query-paths"><div className="query-direct"><span>NEXA DIRECT</span><p>“Find me a Sea N' Rent apartment.”</p><small>They asked for you by name. Direct brings that booking home.</small></div><div className="query-agent"><span>NEXA AGENT</span><p>“A sea-view apartment in Tel Aviv.”</p><small>They asked for a stay in your city. Agent puts your property in the answer, priced and bookable.</small></div></div><div className="merge-lines" aria-hidden="true"><svg viewBox="0 0 200 250" preserveAspectRatio="none"><path d="M0 30C90 30 70 125 140 125H200M0 220C90 220 70 125 140 125" fill="none" stroke="currentColor" strokeWidth="1"/></svg></div><div className="connector-node"><img src="/nexa-white.png" alt="Nexa" width="128" height="28"/><span>ONE CONNECTION</span></div><span className="destination-line" aria-hidden="true"><i/></span><div className="connector-destination"><div className="destination-window" aria-hidden="true"><span>YOUR WEBSITE</span><i/><i/><b>Book direct</b></div><p>Your website <Arrow diagonal/></p><small>Your booking. Your guest.</small></div></div></div></section>
      <section className="economics section-pad" id="economics" aria-labelledby="economics-title"><div className="wrap"><Label>[04] THE DIRECT CHANNEL / YOUR ADVANTAGE</Label></div><div className="wrap economics-grid"><div data-reveal><h2 id="economics-title">New discovery.<br/><em>Your direct channel.</em></h2><p>Bring AI-originated demand to the booking experience you already own.</p>{action('button button-dark')}</div><div className="economics-ledger" data-reveal><div><span>01</span><h3>Your website</h3><p>The destination for the booking.</p></div><div><span>02</span><h3>Your checkout</h3><p>The guest pays through your existing flow.</p></div><div><span>03</span><h3>Your relationship</h3><p>A direct website reservation in your PMS.</p></div><small>Commercial terms are discussed for your property.</small></div></div></section>
      <section className="audience section-pad wrap" id="for-you" aria-labelledby="audience-title"><Label>[05] WHO IT IS FOR / HOTELS AND VACATION RENTALS</Label><header className="split-heading" data-reveal><div><h2 id="audience-title">Your property.<br/><em>Your next chapter.</em></h2></div></header><div className="audience-grid"><article data-reveal><div className="architectural hotel-lines" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div><span>01 / HOTELS</span><h3>I run a hotel.</h3><p>Defend your loyalty program, fill the gaps, shrink the OTA bill.</p><a className="audience-link" href="/nexa-ai-connector">Explore NEXA for hotels <Arrow diagonal/></a></article><article data-reveal><div className="architectural rental-lines" aria-hidden="true"><i/><i/><i/></div><span>02 / VACATION RENTALS</span><h3>I run vacation rentals.</h3><p>Defend your brand, from one unit to a 3,000-unit portfolio.</p><a className="audience-link" href="/nexa-ai-connector">Explore NEXA for vacation rentals <Arrow diagonal/></a></article></div></section>
      <section className="faq section-pad wrap" id="faq" aria-labelledby="faq-title"><Label>[06] FAQ / STRAIGHT ANSWERS</Label><div><h2 id="faq-title">Straight answers.<br/><em>No sales voice.</em></h2></div><div className="faq-list">{FAQ.map(([q,a], i) => <details key={q}><summary><span className="faq-number">0{i+1}</span>{q}<span className="faq-plus" aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div></section>
      <section id="get-priced" className="closing section-pad" aria-labelledby="closing-title"><div className="closing-aperture" aria-hidden="true"><i/><i/></div><div className="wrap"><Label>GET PRICED</Label><h2 id="closing-title">Get PRICED<br/><em>before your competitor does.</em></h2>{action('button button-light')}<p>For hotels and vacation rental operators.</p></div></section>
    </main>
    <footer className="footer wrap"><div className="footer-top"><a href="#" aria-label="Nexa home"><img src="/nexa-white.png" alt="Nexa" width="128" height="28"/></a><p>Be where your next guest is asking, not where they used to search.</p><a href="#main">Back to top ↑</a></div><div className="footer-bottom"><span>© 2026 NEXA</span><div><a href="/v1">V1</a><a href="/v2">V2</a><a href="/v3">V3</a><a href="/v4">V4</a><a href="/v5">V5</a></div></div><p className="example-note">Sea N' Rent is used as a property example, not a customer endorsement. All booking data shown is illustrative.</p></footer>
    <dialog ref={dialog} aria-labelledby="get-priced-title" onKeyDown={trapDialogFocus} className="onboarding-dialog" onClose={() => opener.current?.focus()} onClick={e => { if (e.target === dialog.current) dialog.current.close(); }}><div><button className="dialog-close" aria-label="Close" onClick={() => dialog.current?.close()}>×</button><Label>GET PRICED</Label><h2 id="get-priced-title">A direct connection<br/><em>starts with your property.</em></h2><p>The next step is a conversation about your PMS, your booking website, and the properties you operate.</p><ul><li>Your existing PMS</li><li>Your direct booking website</li><li>Your hotel or rental portfolio</li></ul><p className="dialog-note">Prototype preview. No information is collected or submitted. Commercial terms and an onboarding contact will be added when approved.</p><button className="button button-dark" onClick={() => dialog.current?.close()}>Back to NEXA <Arrow/></button></div></dialog>
  </div>;
}

