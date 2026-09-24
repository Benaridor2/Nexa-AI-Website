import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(Flip, ScrollTrigger);

const stay = {
  property: 'Example Oceanfront Hotel',
  location: 'Miami Beach',
  dates: 'May 1 - 5, 2027',
  arrival: 'May 1, 2027',
  departure: 'May 5, 2027',
  nights: 4,
  guests: 2,
  total: '$1,240',
  question: 'Find me an oceanfront stay in Miami Beach. May 1 - 5, 2027, for two guests.',
};

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M4 12h15m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function Play({ pause = false }: { pause?: boolean }) {
  return <svg aria-hidden="true" width="16" height="16" viewBox="0 0 20 20" fill="none">{pause ? <path d="M7 5v10M13 5v10" stroke="currentColor" strokeWidth="2" /> : <path d="m7 4 9 6-9 6V4Z" fill="currentColor" />}</svg>;
}
function Check() {
  return <svg aria-hidden="true" width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function Asterisk() {
  return <span className="assistant-mark" aria-hidden="true">✳</span>;
}
function HotelImage({ className = '', priority = false }: { className?: string; priority?: boolean }) {
  return <img className={className} src="/hotel.webp" srcSet="/hotel-small.webp 720w, /hotel.webp 1440w" sizes="(max-width: 700px) 100vw, 700px" width="1440" height="960" alt="Sunlit oceanfront terrace with palms and lounge chairs" loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} />;
}
function Brand({ dark = false }: { dark?: boolean }) {
  return <img className="brand" src={dark ? '/nexa.png' : '/nexa-white.png'} width="135" height="30" alt="Nexa" />;
}

const steps = [
  { label: 'The question', place: 'IN AN AI ASSISTANT', title: 'A stay starts with a question.', copy: 'The guest asks the AI assistant they already use. No installation. No activation. Just a travel question.' },
  { label: 'The answer', place: 'IN AN AI ASSISTANT', title: 'An answer they can act on.', copy: 'Live availability, a final price, and a direct route to your property. NEXA works behind the scenes.' },
  { label: 'Your website', place: "ON THE PROPERTY'S WEBSITE", title: 'The next click belongs to you.', copy: 'The guest arrives on your own website with dates and guest count prefilled. Your property. Your booking flow.' },
  { label: 'Booked direct', place: "ON THE PROPERTY'S WEBSITE", title: 'Your guest. From here on.', copy: 'Booking and payment complete on your website. The reservation reaches your PMS as a direct website booking.' },
];

function BookingDemo({ step, setStep, playing, setPlaying, reduced }: { step: number; setStep: (step: number) => void; playing: boolean; setPlaying: (playing: boolean) => void; reduced: boolean }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const currentStep = useRef(step);
  const flipRef = useRef<gsap.core.Timeline | null>(null);
  const [visualStep, setVisualStep] = useState(step);

  useLayoutEffect(() => {
    if (reduced) {
      flipRef.current?.progress(1).kill();
      if (stageRef.current) { const reveals = stageRef.current.querySelectorAll('.scene-reveal'); gsap.killTweensOf(reveals); gsap.set(reveals, { clearProps: 'opacity,transform' }); }
    }
    if (currentStep.current === step) return;
    flipRef.current?.progress(1).kill();
    if (stageRef.current) gsap.killTweensOf(stageRef.current.querySelectorAll('.scene-reveal'));
    const elements = stageRef.current?.querySelectorAll('[data-flip-id=property], [data-flip-id=photo], [data-flip-id=property-content]');
    const before = elements ? Flip.getState(elements) : null;
    currentStep.current = step;
    setVisualStep(step);
    // The same property, photo and booking details change layout, preserving visual continuity.
    const frame = requestAnimationFrame(() => {
      if (before && !reduced) {
        flipRef.current = Flip.from(before, { duration: .9, ease: 'power3.inOut', absolute: false, nested: true, scale: false });
      }
      if (!reduced && stageRef.current) gsap.fromTo(stageRef.current.querySelectorAll('.scene-reveal'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .6, delay: .25, stagger: .06, clearProps: 'all' });
    });
    return () => cancelAnimationFrame(frame);
  }, [step, reduced]);

  useEffect(() => {
    if (!playing) return;
    const timeout = window.setTimeout(() => {
      if (step < 3) setStep(step + 1);
      else setPlaying(false);
    }, step === 0 ? 4200 : 5200);
    return () => window.clearTimeout(timeout);
  }, [playing, step, setStep, setPlaying]);

  useEffect(() => {
    const pause = () => { if (document.hidden) setPlaying(false); };
    document.addEventListener('visibilitychange', pause);
    return () => document.removeEventListener('visibilitychange', pause);
  }, [setPlaying]);

  const select = (n: number) => { setPlaying(false); setStep(n); };
  const togglePlayback = () => { if (step === 3 && !playing) setStep(0); setPlaying(!playing); };
  const website = visualStep >= 2;

  return <section className="booking section-shell" id="booking" aria-labelledby="booking-title">
    <div className="section-meta"><span>02 / THE DIRECT JOURNEY</span><span>ONE STAY. ALL THE WAY.</span></div>
    <div className="booking-heading reveal"><h2 id="booking-title">From a conversation.<br /><em>To your front door.</em></h2><p>Discovery happens in AI.<br /> The booking happens with you.</p></div>
    <div className="journey-tabs" role="tablist" aria-label="Booking journey steps" onKeyDown={event => {
      if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
        event.preventDefault();
        const focusedStep = Number((event.target as HTMLElement).closest('[role=tab]')?.id.replace('journey-tab-', '') ?? step);
        const n = event.key === 'Home' ? 0 : event.key === 'End' ? 3 : (focusedStep + (event.key === 'ArrowRight' ? 1 : 3)) % 4;
        select(n);
        document.getElementById(`journey-tab-${n}`)?.focus();
      }
    }}>
      {steps.map((item, n) => <button id={`journey-tab-${n}`} key={item.label} role="tab" aria-selected={step === n} aria-controls="journey-panel" tabIndex={step === n ? 0 : -1} onClick={() => select(n)} className={step === n ? 'active' : ''}><span className="tab-number">0{n + 1}</span><span>{item.label}</span><i className={playing && step === n ? 'progress running' : 'progress'} style={{ animationDuration: `${n === 0 ? 4200 : 5200}ms` }} /></button>)}
    </div>
    <div className={`journey-stage stage-${visualStep} ${website ? 'is-website' : ''}`} ref={stageRef} id="journey-panel" role="tabpanel" aria-labelledby={`journey-tab-${step}`}>
      <div className="stage-topbar">
        <div className="browser-dots" aria-hidden="true"><i /><i /><i /></div>
        <span className="stage-location" key={website ? 'website' : 'ai'}>{website ? <><span aria-hidden="true">▢</span> example-oceanfront.test / {visualStep === 3 ? 'confirmation' : 'book'}</> : <><Asterisk /> Example in an AI assistant</>}</span>
        <span className="stage-demo">DEMO</span>
      </div>
      <div className="stage-body">
        <div className="request-scene scene-reveal" aria-hidden={visualStep !== 0} inert={visualStep !== 0}>
          <span className="eyebrow">A LITTLE CLOSER TO THE OCEAN.</span>
          <h3>Where would you<br />like to stay?</h3>
          <div className="guest-question">{stay.question}<span className="send-icon" aria-hidden="true">↑</span></div>
          <span className="request-note">The guest's existing AI assistant. Nothing new to open.</span>
        </div>
        <div className="answer-intro scene-reveal" aria-hidden={visualStep !== 1}><Asterisk /><p>Here is an oceanfront option available for your stay.</p></div>
        <div className="property-site-brand scene-reveal" aria-hidden={!website}><span className="hotel-monogram">eo.</span><div>{stay.property}<small>MIAMI BEACH</small></div><span className="site-brand-note">OFFICIAL PROPERTY WEBSITE<br />ILLUSTRATIVE EXPERIENCE</span></div>
        <article className="journey-property" data-flip-id="property" aria-hidden={visualStep === 0} inert={visualStep === 0}>
          <div className="journey-photo" data-flip-id="photo"><HotelImage /><span className="photo-caption">AN OCEANFRONT ESCAPE</span></div>
          <div className="journey-property-content" data-flip-id="property-content">
            <div className="property-heading" data-flip-id="property-heading"><span className="property-kicker">{visualStep === 3 ? 'YOUR STAY IS CONFIRMED' : 'MIAMI BEACH · OCEANFRONT'}</span><h3>{visualStep === 3 ? 'See you by the ocean.' : stay.property}</h3></div>
            <div className="confirmation-notice scene-reveal" hidden={visualStep !== 3}><span className="confirmation-check"><Check /></span><p>Illustrative booking confirmation.<br />No reservation or payment has been made.</p></div>
            <dl className="journey-details" data-flip-id="details"><div><dt>Check-in</dt><dd>{stay.arrival}</dd></div><div><dt>Check-out</dt><dd>{stay.departure}</dd></div><div><dt>Guests</dt><dd>{stay.guests} guests</dd></div><div><dt>Stay</dt><dd>{stay.nights} nights</dd></div></dl>
            <div className="journey-total" data-flip-id="total"><span>Final total<small>For the entire stay</small></span><strong>{stay.total}</strong></div>
            <button className="property-book" data-flip-id="book-button" onClick={() => { if (visualStep === 3) { setStep(0); setPlaying(true); document.getElementById('journey-tab-0')?.focus({ preventScroll: true }); } else select(visualStep === 1 ? 2 : 3); }}>{visualStep === 1 ? <>Book direct <Arrow diagonal /></> : visualStep === 2 ? <>Preview confirmation <Arrow /></> : <>Replay the journey <span aria-hidden="true">↺</span></>}</button>
            <span className="checkout-note">{visualStep === 1 ? "Continue on the property's own website" : visualStep === 2 ? 'Booking and payment happen on this property website.' : 'Direct website booking → Property PMS'}</span>
          </div>
        </article>
        <div className="site-handoff scene-reveal" aria-hidden={!website}><span className="handoff-line" /><span>{visualStep === 3 ? 'Completed with the property' : 'Same stay. Dates and guests prefilled.'}</span><span className="handoff-line" /></div>
      </div>
    </div>
    <div className="journey-caption">
      <div className="journey-explainer" aria-live="polite"><span className="eyebrow">{steps[step].place}</span><h3>{steps[step].title}</h3><p>{steps[step].copy}</p></div>
      <div className="playback"><button className="play-button" onClick={togglePlayback} aria-label={playing ? 'Pause booking demonstration' : step === 3 ? 'Replay booking demonstration' : 'Play booking demonstration'}><Play pause={playing} />{playing ? 'Pause' : step === 3 ? 'Replay' : 'Play the journey'}</button><button className="replay-button" aria-label="Restart booking demonstration" onClick={() => { setStep(0); setPlaying(true); }}>↺</button><span>ILLUSTRATIVE BOOKING · NO PAYMENT</span></div>
    </div>
  </section>;
}

function PricedScene({ reduced, onBook }: { reduced: boolean; onBook: () => void }) {
  const [priced, setPriced] = useState(false);
  const [phase, setPhase] = useState(0);
  const phaseRef = useRef<gsap.core.Timeline | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => () => { phaseRef.current?.kill(); }, []);
  useEffect(() => { if (reduced) { phaseRef.current?.kill(); setPhase(priced ? 3 : 0); } }, [reduced, priced]);
  const change = (value: boolean) => {
    phaseRef.current?.kill();
    setPriced(value);
    if (!value) { setPhase(0); return; }
    if (reduced) { setPhase(3); return; }
    setPhase(1);
    phaseRef.current = gsap.timeline().call(() => setPhase(2), [], .55).call(() => setPhase(3), [], 1.15);
  };
  return <section className="priced-section section-shell" id="priced" aria-labelledby="priced-title">
    <div className="section-meta"><span>01 / THE MISSING PIECE</span><span>FROM KNOWN TO BOOKABLE</span></div>
    <div className="priced-heading reveal"><div><h2 id="priced-title">A mention is a start.<br /><em>A price opens the door.</em></h2></div><p>Your property may be part of the conversation.<br className="desktop-break" /> NEXA makes the next step possible.</p></div>
    <div className={`priced-experiment phase-${phase}`} ref={rootRef}>
      <div className="connection-story">
        <span className="eyebrow">BEHIND THE ANSWER</span>
        <h3>Your property.<br /> Now with the full picture.</h3>
        <p className="connection-description">Live booking data from your PMS, made available to AI assistants.</p>
        <div className="data-source"><span className="source-icon" aria-hidden="true">▥</span><span>Your property PMS<small>The source of your booking data</small></span><span className="source-node" /></div>
        <div className="connection-track" aria-hidden="true"><span /></div>
        <div className="nexa-layer"><div className="layer-heading"><Brand /><span>AI CONNECTOR</span></div><div className="data-rows"><div><span>Live availability</span><span>{phase >= 2 ? 'Available' : 'Not shared in this example'}</span></div><div><span>Final price</span><span>{phase >= 2 ? stay.total : 'Not shared in this example'}</span></div><div><span>Direct booking link</span><span>{phase >= 3 ? 'Property website ↗' : 'Not shared in this example'}</span></div></div><div className="layer-scan" aria-hidden="true" /></div>
        <p className="layer-annotation">An explanation of what NEXA provides.<br />No setup or activation for the guest.</p>
      </div>
      <div className="answer-state">
        <div className="state-control" role="group" aria-label="Compare the AI answer"><button aria-pressed={!priced} onClick={() => change(false)}><i className="unpriced-dot" />UNPRICED</button><button aria-pressed={priced} onClick={() => change(true)}><i className="priced-dot" />PRICED</button></div>
        <div className="state-answer">
          <div className="example-label"><Asterisk /><span>Example in an AI assistant</span><span className="state-status">{phase >= 3 ? 'PRICED' : 'UNPRICED'}</span></div>
          <div className="state-query">{stay.question}</div>
          <div className="state-property"><HotelImage /><div><span className="property-kicker">{stay.location}</span><h3>{stay.property}</h3></div></div>
          <div className="state-values" aria-live="polite"><div><span>Availability</span><strong className={phase >= 2 ? 'available' : 'missing'}>{phase >= 2 ? <><Check /> May 1 - 5, 2027</> : 'Not available in this answer'}</strong></div><div><span>Final price · {stay.nights} nights · {stay.guests} guests</span><strong className={`state-price ${phase >= 2 ? '' : 'missing'}`}>{phase >= 2 ? stay.total : 'Unknown'}</strong></div></div>
          <button className="state-book" disabled={phase < 3} onClick={onBook}>{phase >= 3 ? <>Book direct <Arrow diagonal /></> : <>Direct booking link unavailable <span aria-hidden="true">—</span></>}</button>
          <p className="state-footnote">{phase >= 3 ? "Continue on the property's own website." : 'Known property. Missing the details to book.'}</p>
        </div>
        <div className="state-bottom"><span className={`status-label ${phase >= 3 ? 'priced' : ''}`}><i />{phase >= 3 ? 'AN ANSWER WITH A NEXT STEP' : 'A MENTION WITHOUT A NEXT STEP'}</span><span className="try-control">{priced ? 'The difference is actionable data.' : 'Select PRICED to reveal the difference ↑'}</span></div>
      </div>
    </div>
    <p className="demo-disclaimer">One fictional property. One illustrative stay. The same details, throughout.</p>
  </section>;
}

export default function App() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => { document.documentElement.style.scrollBehavior = reduced ? 'auto' : ''; }, [reduced]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setReduced(media.matches);
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, []);

  useLayoutEffect(() => {
    if (reduced) return;
    const context = gsap.context(() => {
      gsap.from('.hero-copy > *', { y: 18, opacity: .2, duration: 1, stagger: .1, ease: 'power3.out', clearProps: 'all' });
      gsap.from('.hero-answer', { y: 28, rotate: 1.3, duration: 1.4, ease: 'power3.out', clearProps: 'all' });
      gsap.fromTo('.hero-photograph img', { scale: 1.045 }, { scale: 1, duration: 1.6, ease: 'power2.out' });
      gsap.utils.toArray<HTMLElement>('.reveal').forEach(element => {
        gsap.from(element, { y: 26, opacity: .2, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 91%', once: true }, clearProps: 'all' });
      });
    }, pageRef);
    return () => context.revert();
  }, [reduced]);

  const startJourney = (from = 0, play = true) => {
    flushSync(() => { setStep(from); setPlaying(play); });
    document.getElementById(`journey-tab-${from}`)?.focus({ preventScroll: true });
    document.getElementById('booking')?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'start' });
  };
  const openPreview = () => { lastFocus.current = document.activeElement as HTMLElement; dialogRef.current?.showModal(); };
  const closePreview = () => { dialogRef.current?.close(); };

  return <div ref={pageRef} className={reduced ? 'reduced-motion' : undefined}>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header"><a className="brand-link" href="#" aria-label="Nexa home"><Brand /></a><nav aria-label="Main navigation"><a href="#priced">The difference</a><a href="#booking">The direct journey</a></nav><button className="header-cta" onClick={openPreview}>Get Priced <Arrow diagonal /></button></header>
    <main id="main">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-photograph"><HotelImage priority /><div className="photo-shade" /><span className="hero-photo-label">SOMEWHERE THEY'LL WANT TO BE.</span></div>
        <div className="hero-copy"><span className="eyebrow hero-category">THE AI CONNECTOR FOR<br className="category-break" /> HOTELS & VACATION RENTALS</span><h1 id="hero-title">Your next guest<br />is asking an AI.<br /><em>Be the answer.</em></h1><p>Connect your live availability and final prices to AI assistants. Let guests book on your own website.</p><div className="hero-actions"><button className="primary-button" onClick={openPreview}>Get Priced <Arrow diagonal /></button><button className="watch-button" onClick={() => startJourney()}><span className="play-ring"><Play /></span>Watch a booking happen</button></div><span className="hero-assurance">Their AI assistant. Your next direct booking.</span></div>
        <div className="hero-visual">
          <div className="hero-answer"><div className="example-label"><Asterisk /><span>Example in an AI assistant</span><span className="example-pill">ILLUSTRATIVE</span></div><div className="hero-question">{stay.question}</div><p className="hero-answer-intro">Here is an oceanfront option available for your stay.</p><article className="hero-property"><HotelImage priority /><div className="hero-property-info"><div className="card-location">MIAMI BEACH <span>PRICED <i /></span></div><h2>{stay.property}</h2><p>{stay.dates} <span>·</span> {stay.guests} guests</p><div className="hero-total"><div><strong>{stay.total}</strong><span>Final price · {stay.nights} nights</span></div><button onClick={() => startJourney(2, false)}>Book direct <Arrow diagonal /></button></div></div></article><div className="answer-destination"><span aria-hidden="true">↳</span> Booking completes on the property's own website.</div></div>
          <div className="hero-visual-note"><span className="note-line" /><p>Real possibility.<br /><em>Illustrative property.</em></p></div>
        </div>
        <div className="hero-bottom"><a href="#priced"><span className="scroll-mark" aria-hidden="true">↓</span> THE NEXT CHAPTER OF DIRECT BOOKING</a><span>NO GUEST INSTALLATION. NO ACTIVATION.</span></div>
      </section>
      <PricedScene reduced={reduced} onBook={() => startJourney(2, false)} />
      <BookingDemo step={step} setStep={setStep} playing={playing} setPlaying={setPlaying} reduced={reduced} />
      <section className="closing"><div><span className="eyebrow">A NEW WAY TO BE FOUND.</span><h2>The guest starts in AI.<br /><em>The relationship starts with you.</em></h2></div><button className="primary-button" onClick={openPreview}>Get Priced <Arrow diagonal /></button></section>
    </main>
    <footer><a href="#" aria-label="Nexa home"><Brand /></a><span>The AI connector for hospitality.</span><button className="motion-toggle" aria-pressed={reduced} onClick={() => setReduced(!reduced)}>Motion: {reduced ? 'reduced' : 'full'}</button><span>© 2026 NEXA · First look</span></footer>
    <dialog ref={dialogRef} className="preview-dialog" aria-labelledby="preview-heading" onKeyDown={event => {
      if (event.key !== 'Tab') return;
      const buttons = dialogRef.current?.querySelectorAll<HTMLButtonElement>('button');
      if (!buttons?.length) return;
      const first = buttons[0], last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }} onCancel={() => { lastFocus.current?.focus(); }} onClick={event => { if (event.target === event.currentTarget) closePreview(); }} onClose={() => lastFocus.current?.focus()}><div className="dialog-content"><button className="dialog-close" onClick={closePreview} aria-label="Close next-step preview">×</button><span className="eyebrow">GET PRICED / A LOOK AHEAD</span><h2 id="preview-heading">Your property.<br /><em>Ready for the conversation.</em></h2><p>The next step is to explore your property's PMS connection and direct booking website with NEXA.</p><div className="preview-checklist"><div><span>01</span><p>Your property<small>Hotels and vacation rentals</small></p></div><div><span>02</span><p>Your PMS<small>Where your live booking data lives</small></p></div><div><span>03</span><p>Your booking website<small>Where the guest completes their stay booking</small></p></div></div><p className="preview-notice">This is a prototype preview. Nothing is collected or submitted.</p><button className="primary-button" onClick={() => { lastFocus.current = null; closePreview(); startJourney(); }}>Explore the guest journey <Arrow /></button></div></dialog>
  </div>;
}
