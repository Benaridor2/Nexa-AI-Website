import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Arrow, BookingJourney, Comparison, Conversation, Label, Photo } from './Scenes';
import { STAY } from './stay';

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
  const [flow, setFlow] = useState(() => matchMedia('(prefers-reduced-motion: reduce), (max-height: 759px)').matches || new URLSearchParams(location.search).get('view') === 'static');
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
    const media = matchMedia('(prefers-reduced-motion: reduce), (max-height: 759px)');
    const change = () => setFlow(media.matches || new URLSearchParams(location.search).get('view') === 'static');
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, []);
  useLayoutEffect(() => {
    if (flow || !page.current) return;
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(el => {
        gsap.fromTo(el, { y: 32, opacity: .4 }, { y: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 65%', scrub: true } });
      });
      gsap.fromTo('.query-direct', { x: -45 }, { x: 0, ease: 'none', scrollTrigger: { trigger: '.connector-diagram', start: 'top 90%', end: 'center 55%', scrub: true } });
      gsap.fromTo('.query-agent', { x: -75 }, { x: 0, ease: 'none', scrollTrigger: { trigger: '.connector-diagram', start: 'top 90%', end: 'center 55%', scrub: true } });
    }, page);
    return () => context.revert();
  }, [flow]);
  useEffect(() => {
    let cancelled = false;
    let interacted = false;
    const scrollKey = `nexa-v3-scroll:${location.pathname}${location.search}`;
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
        <div className="hero-image"><Photo eager/><span className="hero-location">HAYARKON STREET 78<br/>TEL AVIV, BY THE MEDITERRANEAN</span></div>
        <div className="hero-content"><Label>THE AI CONNECTOR FOR HOTELS & VACATION RENTALS</Label><h1 id="hero-title">Your next guest<br/>is asking an AI.<br/><em>Be the answer.</em></h1><p>Connect your live availability and final prices to AI assistants. Let guests book on your own website.</p><div className="hero-actions">{action()}<a className="text-link" href="#guest-story">See it in action <span>↓</span></a></div></div>
        <div className="hero-baseline"><span>THE NEXT CHAPTER OF DIRECT BOOKING</span><span>Their AI assistant. Your own website.</span></div>
      </section>
      <Conversation motion={!flow}/>
      <section className="connection-strip wrap" aria-labelledby="connection-title"><Label>ALREADY PART OF YOUR WORLD</Label><h2 id="connection-title">Your PMS. <span className="connection-line" aria-hidden="true"/> One connection. <span className="connection-line" aria-hidden="true"/> Your website.</h2><p>Connect your property behind the scenes. Nothing new for the guest to install.</p><ul className="pms-names" aria-label="PMS integrations">{PMS.map(name => <li key={name}>{name}</li>)}</ul></section>
      <section className="proof-strip" aria-label="At a glance"><div className="wrap"><p><strong>6</strong><span>PMS integrations</span></p><p><strong>One</strong><span>connection for two demand types</span></p><p><strong>Your own</strong><span>website and checkout</span></p></div></section>
      <Comparison motion={!flow}/>
      <BookingJourney motion={!flow}/>
      <section className="connector section-pad" id="connector" aria-labelledby="connector-title"><div className="wrap"><header className="split-heading" data-reveal><div><Label>04 / NEXA AI CONNECTOR</Label><h2 id="connector-title">Known by name.<br/><em>Discovered by need.</em></h2></div><p>Two ways a guest finds you.<br/>One connection brings them to your website.</p></header><div className="connector-diagram"><div className="query-paths"><div className="query-direct"><span>NEXA DIRECT</span><p>“Find me a Sea N' Rent apartment.”</p><small>Branded demand</small></div><div className="query-agent"><span>NEXA AGENT</span><p>“A sea-view apartment in Tel Aviv.”</p><small>Destination demand</small></div></div><div className="merge-lines" aria-hidden="true"><svg viewBox="0 0 200 250" preserveAspectRatio="none"><path d="M0 30C90 30 70 125 140 125H200M0 220C90 220 70 125 140 125" fill="none" stroke="currentColor" strokeWidth="1"/></svg></div><div className="connector-node"><img src="/nexa-white.png" alt="Nexa" width="128" height="28"/><span>ONE CONNECTION</span></div><span className="destination-line" aria-hidden="true"/><div className="connector-destination"><Photo name="interior"/><p>Your website <Arrow diagonal/></p><small>Your booking. Your guest.</small></div></div></div></section>
      <section className="economics section-pad" id="economics" aria-labelledby="economics-title"><div className="wrap economics-grid"><div data-reveal><Label>05 / THE DIRECT-CHANNEL ADVANTAGE</Label><h2 id="economics-title">New discovery.<br/><em>Your direct channel.</em></h2><p>Bring AI-originated demand to the booking experience you already own.</p>{action('button button-dark')}</div><div className="economics-ledger" data-reveal><div><span>01</span><h3>Your website</h3><p>The destination for the booking.</p></div><div><span>02</span><h3>Your checkout</h3><p>The guest pays through your existing flow.</p></div><div><span>03</span><h3>Your relationship</h3><p>A direct website reservation in your PMS.</p></div><small>Commercial terms are discussed for your property.</small></div></div></section>
      <section className="audience section-pad wrap" id="for-you" aria-labelledby="audience-title"><header className="split-heading" data-reveal><div><Label>06 / BUILT FOR HOSPITALITY</Label><h2 id="audience-title">Different properties.<br/><em>The same direct opportunity.</em></h2></div></header><div className="audience-grid"><article data-reveal><div className="audience-image"><img src="/hotel.webp" width="1440" height="960" alt="An oceanfront hotel terrace" loading="lazy"/></div><span>01 / HOTELS</span><h3>Make your next stay discoverable.</h3><p>Bring live availability and final prices into the conversation, with a route to your hotel's own checkout.</p></article><article data-reveal><div className="audience-image"><Photo name="living"/></div><span>02 / VACATION RENTALS</span><h3>Turn a destination into your address.</h3><p>Connect your portfolio's booking data to the way guests ask for their next place to stay.</p></article></div></section>
      <section className="credibility section-pad" aria-labelledby="proof-title"><div className="wrap award-layout" data-reveal><div><Label>07 / A COMPANY MILESTONE</Label><h2 id="proof-title">Hospitality saw<br/><em>what comes next.</em></h2><p>Winner of the HVC Startup Competition by SHIC.<br/>Zurich, 2026.</p></div><div className="award-type"><span>HVC</span><strong>2026</strong><span>STARTUP COMPETITION WINNER</span><p>Over <b>65%</b> of the vote</p><small>Company-supplied award result.</small></div></div></section>
      <section className="faq section-pad wrap" id="faq" aria-labelledby="faq-title"><div><Label>08 / GOOD QUESTIONS</Label><h2 id="faq-title">The details,<br/><em>made clear.</em></h2></div><div className="faq-list">{FAQ.map(([q,a], i) => <details key={q}><summary><span className="faq-number">0{i+1}</span>{q}<span className="faq-plus" aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div></section>
      <section className="closing section-pad" aria-labelledby="closing-title"><div className="wrap"><Label>THE NEXT GUEST IS ALREADY ASKING.</Label><h2 id="closing-title">Let the answer<br/><em>lead to you.</em></h2>{action('button button-light')}<p>For hotels and vacation rental operators.</p></div></section>
    </main>
    <footer className="footer wrap"><div className="footer-top"><a href="#" aria-label="Nexa home"><img src="/nexa-white.png" alt="Nexa" width="128" height="28"/></a><p>The AI connector for hospitality.</p><a href="#main">Back to top ↑</a></div><div className="footer-bottom"><span>© 2026 NEXA</span><div><a href="/v1">V1</a><a href="/v2">V2</a><a href={STAY.url} target="_blank" rel="noreferrer">Property source ↗</a></div></div><p className="example-note">Sea N' Rent is used as a property example, not a customer endorsement. All booking data shown is illustrative.</p></footer>
    <dialog ref={dialog} aria-labelledby="get-priced-title" onKeyDown={trapDialogFocus} className="onboarding-dialog" onClose={() => opener.current?.focus()} onClick={e => { if (e.target === dialog.current) dialog.current.close(); }}><div><button className="dialog-close" aria-label="Close" onClick={() => dialog.current?.close()}>×</button><Label>GET PRICED</Label><h2 id="get-priced-title">A direct connection<br/><em>starts with your property.</em></h2><p>The next step is a conversation about your PMS, your booking website, and the properties you operate.</p><ul><li>Your existing PMS</li><li>Your direct booking website</li><li>Your hotel or rental portfolio</li></ul><p className="dialog-note">Prototype preview. No information is collected or submitted. Commercial terms and an onboarding contact will be added when approved.</p><button className="button button-dark" onClick={() => dialog.current?.close()}>Back to NEXA <Arrow/></button></div></dialog>
  </div>;
}
