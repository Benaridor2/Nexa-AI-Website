import { useEffect, useRef, useState } from 'react';
import { Arrow, Label } from './Scenes';
import { STAY } from './stay';

// Homepage sections after the conversation. Each makes one point on one
// screen, in large type; motion shows the product at work (a request looking
// for data, a booking travelling, two kinds of guests meeting one connection)
// and never moves or hides the words.

// Ambient motion plays only while its section is on screen, and every section
// that moves has a pause button (loops longer than five seconds need one).
function useAmbient() {
  const ref = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const apply = (still: boolean) => {
      section.classList.toggle('is-still', still);
      section.querySelectorAll('svg').forEach(svg => { if (still) svg.pauseAnimations?.(); else svg.unpauseAnimations?.(); });
    };
    let visible = false;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; apply(paused || !visible); }, { threshold: .1 });
    observer.observe(section);
    apply(paused || !visible);
    return () => observer.disconnect();
  }, [paused]);
  return { ref, toggle: <button type="button" className="motion-toggle" aria-pressed={paused} onClick={() => setPaused(!paused)}><span className="sr-only">{paused ? 'Play the animations' : 'Pause the animations'}</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d={paused ? 'M8 5.5v13l10-6.5-10-6.5Z' : 'M8 6h3v12H8zM13 6h3v12h-3z'} fill="currentColor"/></svg></button> };
}

// ---------------------------------------------------------------- [01] Priced or unpriced

function AnswerMock({ priced }: { priced: boolean }) {
  const rows = priced
    ? [['Availability', `${STAY.shortDates} · Available`], ['Final price', `${STAY.total} · final`], ['Booking', 'Your website']]
    : [['Availability', ''], ['Final price', ''], ['Booking', '']];
  return <div className={`answer-mock ${priced ? 'is-priced' : 'is-unpriced'}`} aria-hidden="true">
    <div className="mock-card">
      <div className="mock-head"><span className="mock-orb"/><b>Your property</b><small>{priced ? 'Verified · live' : 'Not verified'}</small></div>
      <ul>{rows.map(([label, value], i) => <li key={label} style={{ '--i': i } as React.CSSProperties}><span>{label}</span>{priced ? <strong>{value}</strong> : <i className="mock-unknown">?</i>}<em className="mock-mark">{priced ? '✓' : '–'}</em></li>)}</ul>
      {!priced && <span className="mock-scan"/>}
    </div>
    <div className="mock-route"><i className="route-line"/><i className="route-dot"/></div>
    <div className="mock-destination"><small>The guest books</small><strong>{priced ? 'Direct, with you' : 'On an OTA'}</strong></div>
  </div>;
}

export function PricedOrUnpriced() {
  const motion = useAmbient();
  return <section className="duo" id="priced" aria-labelledby="priced-title" ref={motion.ref}>
    <div className="wrap">
      <Label>[01] THE TWO WORDS / PRICED OR UNPRICED</Label>
      <header className="duo-head">
        <h2 id="priced-title">Being mentioned by the AI is nice.<br/><em>Being bookable through the AI is where the money is.</em></h2>
        <p>Two words decide who gets the booking:</p>
      </header>
      <div className="duo-grid">
        {motion.toggle}
        <article className="duo-card is-unpriced">
          <AnswerMock priced={false}/>
          <h3>UNPRICED</h3>
          <p>The AI knows you exist, but cannot answer for you. It is not allowed to guess, so the booking goes to whoever is priced. <strong>Usually an OTA.</strong></p>
        </article>
        <article className="duo-card is-priced">
          <AnswerMock priced/>
          <h3>PRICED<span aria-hidden="true">↗</span></h3>
          <p>The AI sees your live availability, your final price, and a trusted way to book direct. <strong>It can recommend you, and complete the booking.</strong></p>
        </article>
      </div>
      <div className="duo-close">
        <p>You're not losing to better hotels.<br/><strong>You're losing to the OTAs.</strong></p>
        <a className="duo-story" href="/about"><span>Our whole company is based on one small sentence at the bottom of every AI chat: <q>ChatGPT can make mistakes.</q></span><b>Read the story <Arrow/></b></a>
      </div>
    </div>
  </section>;
}

// ---------------------------------------------------------------- [02] How it works

function StepVisual({ step }: { step: number }) {
  if (step === 0) return <div className="step-visual visual-ask"><span className="ask-bubble">Find me an apartment near the sea in Tel Aviv.</span><span className="ask-typing"><i/><i/><i/></span></div>;
  if (step === 1) return <div className="step-visual visual-exchange"><span className="orb">AI</span><span className="exchange-wires"><i/><i/></span><span className="orb is-nexa"><img src="/nexa-white.png" alt="" width="54" height="12"/></span></div>;
  if (step === 2) return <div className="step-visual visual-recommend"><span className="rec-photo"/><span className="rec-body"><b>Sea view · 1BR</b><strong>{STAY.total}</strong><em>Book direct ↗</em></span></div>;
  return <div className="step-visual visual-booked"><span className="booked-icon">✓</span><span><b>Direct booking received</b><small>Your PMS · {STAY.shortDates}</small></span></div>;
}

const STEPS = [
  ['The guest asks.', 'Their AI turns to your website, backed by the NEXA AI Connector.'],
  ['NEXA AI answers.', 'Instantly, in AI-to-AI communication.'],
  ['The AI recommends you.', 'By name, with your final price and your best-price guarantee.'],
  ['The guest books with you.', 'On your own website. The reservation reaches your PMS like any direct booking.'],
];

export function HowItWorksSteps() {
  const motion = useAmbient();
  return <section className="steps section-pad" id="how-it-works" aria-labelledby="works-title" ref={motion.ref}>
    <div className="wrap">
      <Label>[02] HOW IT WORKS / THE FIX</Label>
      <header className="steps-head"><h2 id="works-title">NEXA AI makes your property PRICED.<br/><em>Here is how.</em></h2><p>From "find me a place" to a booking on your site. One conversation.</p></header>
      <div className="steps-flow">
        {motion.toggle}
        <div className="flow-rail" aria-hidden="true"><span/><span/><span/><span/><i className="flow-packet"/></div>
        <ol>{STEPS.map(([title, text], i) => <li key={title} style={{ '--i': i } as React.CSSProperties}><StepVisual step={i}/><span className="step-number">0{i + 1}</span><h3>{title}</h3><p>{text}</p></li>)}</ol>
      </div>
      <div className="steps-foot">
        <p>The guest installs nothing. No application needed. No plugin installed in the chat by the guest. <strong>The guest just asks, the AI simply answers.</strong></p>
        <div><a className="button button-dark" href="#watch-a-booking">Watch a booking happen <Arrow/></a><a className="text-link" href="/how-it-works">The full journey, step by step <Arrow/></a></div>
      </div>
    </div>
  </section>;
}

// ---------------------------------------------------------------- [03] The product

export function ProductConnector() {
  const motion = useAmbient();
  return <section className="connector section-pad" id="connector" aria-labelledby="connector-title" ref={motion.ref}>
    <div className="wrap">
      <Label>[03] THE PRODUCT / NEXA AI CONNECTOR</Label>
      <header className="split-heading"><div><h2 id="connector-title">One connection.<br/><em>Two kinds of guests.</em></h2></div><p>Both book direct. You do not choose between them. One connection answers both.</p></header>
      <div className="product-flow">
        {motion.toggle}
        <div className="guest-types">
          <article className="guest-type"><h3 className="product-name">NEXA <span>Direct</span></h3><p className="product-message">They ask for you. <em>By name.</em></p><blockquote>“Find me a Sea N' Rent apartment.”</blockquote><p>They already know your property. Direct brings that booking home.</p></article>
          <article className="guest-type"><h3 className="product-name">NEXA <span>Agent</span></h3><p className="product-message">They ask for a stay. <em>You become the answer.</em></p><blockquote>“A sea-view apartment in Tel Aviv.”</blockquote><p>They are looking in your destination. Agent puts your property in the answer, priced and bookable.</p></article>
        </div>
        <svg className="product-merge" viewBox="0 0 160 400" preserveAspectRatio="none" aria-hidden="true">
          <path id="merge-direct" d="M0 100C80 100 70 200 160 200"/><path id="merge-agent" d="M0 300C80 300 70 200 160 200"/>
          <circle r="4"><animateMotion dur="2.6s" repeatCount="indefinite"><mpath href="#merge-direct"/></animateMotion></circle>
          <circle r="4"><animateMotion dur="2.6s" begin="1.3s" repeatCount="indefinite"><mpath href="#merge-agent"/></animateMotion></circle>
        </svg>
        <div className="product-node"><img src="/nexa-white.png" alt="Nexa" width="128" height="28"/><span>ONE CONNECTION</span><i className="node-ring"/></div>
        <div className="product-out" aria-hidden="true"><i/></div>
        <div className="product-destination"><div className="destination-window" aria-hidden="true"><span>YOUR WEBSITE</span><i/><i/><b>Book direct</b></div><p>Your website</p><small>Your booking. Your guest.</small></div>
      </div>
      <a className="text-link product-more" href="/nexa-ai-connector">See how one connection does both <Arrow/></a>
    </div>
  </section>;
}
