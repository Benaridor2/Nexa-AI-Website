import { useRef } from 'react';
import { STAY } from './stay';
import { between, phase, styles, useScene, visible } from './motion';

export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? 'M5 19 19 5M5 5h14v14' : 'M4 12h16m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.5" /></svg>;
}
export function Photo({ name = 'balcony', className = '', eager = false }: { name?: string; className?: string; eager?: boolean }) {
  const alt = name === 'balcony' ? "The Mediterranean-facing balcony of Sea N' Rent's Tel Aviv apartment" : name === 'bedroom' ? "The apartment's bedroom with a sea view" : "The living area of Sea N' Rent's Tel Aviv apartment";
  return <img className={className} src={`/seanrent/${name}.jpg`} alt={alt} width="1080" height="721" loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'} />;
}
export function Label({ children }: { children: React.ReactNode }) { return <p className="eyebrow">{children}</p>; }
function ComposerTools() {
  return <span className="composer-tools" aria-hidden="true"><span className="plus">+</span><span className="composer-right"><svg viewBox="0 0 24 24" fill="none"><rect x="9" y="3" width="6" height="12" rx="3" stroke="currentColor" strokeWidth="1.5"/><path d="M6 10v2a6 6 0 0 0 12 0v-2M12 18v3" stroke="currentColor" strokeWidth="1.5"/></svg><span className="send-arrow">↑</span></span></span>;
}

const chatRenderer = (root: HTMLElement) => {
  const q = (s: string) => root.querySelector<HTMLElement>(s);
  const frame = q('.chat-window'), query = q('.query-morph'), welcome = q('.chat-welcome'), tools = q('.query-tools'), dock = q('.chat-dock'), search = q('.chat-search'), response = q('.chat-response');
  const chunks = [...root.querySelectorAll<HTMLElement>('.query-chunk')];
  const lines = [...root.querySelectorAll<HTMLElement>('.answer-beat')];
  const photo = q('.answer-photo');
  const narrow = matchMedia('(max-width: 699px)');
  return (p: number) => {
    const send = phase(p, .30, .42), focus = between(p, .72, .81, .90, 1);
    const composeFocus = between(p, .08, .18, .30, .44) * (narrow.matches ? .015 : .06);
    styles(frame, { transform: `translateY(${24 * (1 - phase(p, 0, .12)) - 7 * focus}px) scale(${.90 + .10 * phase(p, 0, .16) + .015 * focus + composeFocus}) perspective(1600px) rotateX(${8 * (1-phase(p,0,.18))}deg)` });
    const surface = Math.round(255 - 14 * send);
    styles(query, { '--send': send, width: `${narrow.matches ? 90 : 76 - 8 * send}%`, transform: `translateY(${(1 - send) * 130}px)`, 'border-radius': `${26 - 6 * send}px`, 'font-size': narrow.matches ? '' : `${17 - 2 * send}px`, background: `rgb(${surface},${surface},${surface})`, 'border-color': `rgba(150,150,150,${.3 * (1 - send)})` });
    visible(welcome, 1 - phase(p, .25, .34));
    visible(tools, 1 - phase(p, .30, .34), false);
    styles(tools, { height: `${36 * (1 - phase(p, .34, .42))}px`, 'margin-top': `${12 * (1 - phase(p, .34, .42))}px` });
    chunks.forEach((el, i) => visible(el, phase(p, .12 + i * .032, .15 + i * .032), false));
    visible(dock, phase(p, .34, .42), false);
    visible(search, between(p, .42, .45, .50, .55));
    visible(response, phase(p, .52, .56));
    lines.forEach((el, i) => {
      const t = phase(p, .52 + i * .034, .57 + i * .034);
      visible(el, t); styles(el, { transform: `translateY(${14 * (1 - t)}px)` });
    });
    styles(photo, { 'clip-path': `inset(${(1 - phase(p, .58, .69)) * 100}% 0 0 0 round 10px)` });
  };
};

export function Conversation({ motion }: { motion: boolean }) {
  const ref = useRef<HTMLElement>(null);
  useScene(ref, motion, chatRenderer);
  return <section id="guest-story" className="conversation scene-section" ref={ref} aria-labelledby="guest-title">
    <div className="scene-stage wrap">
      <h2 className="sr-only" id="guest-title">A question becomes a bookable answer</h2><div className="scene-orbit" aria-hidden="true"/><div className="story-cue"><span>THE GUEST'S EXISTING AI ASSISTANT</span><span>SCROLL TO FOLLOW THE CONVERSATION</span></div>
      <div className="chat-window" data-animated>
        <div className="chat-rail" aria-hidden="true"><span>◧</span><svg viewBox="0 0 24 24" fill="none"><path d="M15 4H5v15h15V9M10 14 20 4l2 2-10 10-3 1 1-3Z" stroke="currentColor" strokeWidth="1.5"/></svg></div>
        <div className="chat-app-header"><span>AI assistant <span className="chevron">⌄</span></span><span className="chat-header-actions" aria-hidden="true">↗ &nbsp; ···</span></div>
        <p className="chat-welcome" data-animated>Where should we begin?</p>
        <div className="query-morph" data-animated><p>{STAY.queryChunks.map((text, i) => <span className="query-chunk" data-animated key={i}>{text}</span>)}</p><div className="query-tools" data-animated><ComposerTools /></div></div>
        <div className="chat-search" data-animated><span aria-hidden="true">◎</span><div>Searching the web<small>Sea N' Rent · Tel Aviv apartments</small></div></div>
        <div className="chat-response" data-animated>
          <p className="answer-beat" data-animated>Here's an option that fits:</p>
          <h3 className="answer-beat" data-animated>{STAY.property}</h3>
          <p className="answer-beat answer-description" data-animated>One bedroom, a private balcony and a sea view.</p>
          <div className="answer-beat answer-photo" data-animated><Photo eager /></div>
          <div className="answer-beat connected-badge" data-animated>Connected to NEXA AI</div><div className="answer-beat answer-facts" data-animated><span>{STAY.shortDates} · {STAY.guests} · {STAY.nights}</span><strong>{STAY.total} <span>final total</span></strong></div>
          <a className="answer-beat source-link" data-animated href={STAY.url} target="_blank" rel="noreferrer">Book direct on Sea N' Rent's site <Arrow diagonal /></a>
        </div>
        <div className="chat-dock" data-animated aria-hidden="true"><span>Ask anything</span><ComposerTools /></div>
      </div>
      <p className="scene-caption">{STAY.caption}</p>
    </div>
  </section>;
}

const compareRenderer = (root: HTMLElement) => {
  const rows = [...root.querySelectorAll<HTMLElement>('.comparison-row')];
  const state = root.querySelector<HTMLElement>('.priced-word'), old = root.querySelector<HTMLElement>('.unpriced-word');
  return (p: number) => {
    rows.forEach((row, i) => {
      const t = phase(p, .14 + i * .2, .29 + i * .2);
      const focus = between(p, .08 + i * .2, .14 + i * .2, .28 + i * .2, .37 + i * .2);
      styles(row, { transform: `translateX(${-12 * focus}px) scale(${1 + .035 * focus})`, '--row-ready': t });
      const missing = row.querySelector<HTMLElement>('.row-missing');
      const ready = row.querySelector<HTMLElement>('.row-ready');
      styles(missing, { 'clip-path': `inset(0 0 0 ${t * 100}%)` });
      styles(ready, { 'clip-path': `inset(0 ${(1 - t) * 100}% 0 0)` });
      missing?.setAttribute('aria-hidden', String(t > .5));
      ready?.setAttribute('aria-hidden', String(t <= .5));
    });
    visible(old, 1 - phase(p, .68, .8));
    styles(state, { 'clip-path': `inset(${100 * (1 - phase(p, .68, .8))}% 0 0 0)` });
    state?.setAttribute('aria-hidden', String(p < .77));
  };
};

export function Comparison({ motion }: { motion: boolean }) {
  const ref = useRef<HTMLElement>(null); useScene(ref, motion, compareRenderer);
  return <section className="comparison scene-section" id="priced" ref={ref} aria-labelledby="priced-title"><div className="scene-stage wrap">
    <div className="comparison-copy"><Label>[01] THE TWO WORDS / PRICED OR UNPRICED</Label><h2 id="priced-title">Being mentioned is nice. <br/><em>Being bookable is where the money is.</em></h2><p>Two words decide who gets the booking. The AI needs live availability, a final price, and a trusted way to book direct.</p><div className="price-word-wrap"><span className="unpriced-word" data-animated>UNPRICED</span><span className="priced-word" data-animated>PRICED<span>↗</span></span></div></div>
    <div className="comparison-card"><div className="comparison-property"><span className="property-symbol" aria-hidden="true">N</span><div><small>SAME GUEST. SAME QUESTION.</small><h3>Your property. Two possible answers.</h3></div></div>
      <div className="comparison-table">{[
        ['Availability', 'Not available in this example', `${STAY.dates} · ${STAY.guests}`],
        ['Final price', 'Unknown', `${STAY.total} · ${STAY.nights}`],
        ['Direct booking', 'Link unavailable', "Sea N' Rent's own website ↗"],
      ].map(([label, missing, ready], i) => <div className="comparison-row" key={label} data-animated><span className="row-index">0{i+1}</span><div><h4>{label}</h4><div className="comparison-values"><p className="row-missing" data-animated><span>−</span>{missing}</p><p className="row-ready" data-animated><span>✓</span>{ready}</p></div></div></div>)}</div>
      <p className="comparison-note">The AI knows you exist. With NEXA, it has the information to answer for you. Illustrative comparison.</p>
    </div>
  </div></section>;
}

const journeyRenderer = (root: HTMLElement) => {
  const nodes = new Map<string, HTMLElement | null>();
  const q = (s: string) => { if (!nodes.has(s)) nodes.set(s, root.querySelector<HTMLElement>(s)); return nodes.get(s)!; };
  const narrow = matchMedia('(max-width: 699px)');
  return (p: number) => {
    const travel = phase(p, .35, .61), confirmation = phase(p, .77, .83), received = phase(p, .87, .93);
    visible(q('.system-flow'), 1 - phase(p, .3, .43));
    visible(q('.journey-answer'), 1 - phase(p, .39, .52));
    visible(q('.site-ui'), phase(p, .46, .61));
    visible(q('.site-booking'), phase(p, .60, .67));
    const m = narrow.matches;
    styles(q('.handoff-photo'), {
      left: `${m ? 6 - 6 * travel : 53 - 50 * travel}%`,
      top: `${m ? 44 - 26 * travel : 31 - 5 * travel}%`,
      width: `${m ? 88 + 12 * travel : 42 + 10 * travel}%`,
      height: `${m ? 25 + travel : 39 + 12 * travel}%`,
      'border-radius': `${10 * (1 - travel)}px`,
      transform: `perspective(1200px) rotateY(${-5 * (1-travel)}deg)`,
    });
    styles(q('.flow-facts'), { '--data-progress': phase(p, .06, .27) });
    visible(q('.booking-before'), 1 - confirmation);
    visible(q('.booking-confirmed'), confirmation);
    visible(q('.pms-receipt'), received);
    styles(q('.pms-receipt'), { transform: `translateY(${20 * (1 - received)}px)` });
    ['.journey-line-1', '.journey-line-2', '.journey-line-3'].forEach((s, i) => visible(q(s), i === 0 ? 1-phase(p,.31,.37) : i === 1 ? between(p,.32,.4,.81,.87) : phase(p,.82,.9)));
  };
};

export function BookingJourney({ motion }: { motion: boolean }) {
  const ref = useRef<HTMLElement>(null); useScene(ref, motion, journeyRenderer);
  return <section className="booking-journey scene-section" id="how-it-works" ref={ref} aria-labelledby="works-title"><div className="scene-stage wrap">
    <header className="scene-heading centered"><Label>[02] HOW IT WORKS / THE FIX</Label><h2 id="works-title">From "find me a place"<br/><em>to a booking on your site.</em></h2></header>
    <div className="journey-canvas">
      <div className="system-flow" data-animated><div className="pms-source"><span className="system-icon" aria-hidden="true">▤</span><span>Your existing PMS<small>The source of your booking data</small></span></div><div className="flow-thread" aria-hidden="true"/><div className="nexa-source"><img src="/nexa-white.png" alt="Nexa" width="110" height="24"/><small>AI CONNECTOR</small></div><div className="flow-facts" data-animated><span>Availability</span><span>Final price</span><span>Direct booking</span></div><p>One connection.<br/>The details an answer needs.</p></div>
      <div className="journey-answer" data-animated><small>IN THE GUEST'S AI ASSISTANT</small><h3>{STAY.property}</h3><div className="journey-answer-bottom"><span>{STAY.dates} · {STAY.guests}</span><strong>{STAY.total}<small>final total</small></strong><span className="visual-link">View and book on Sea N' Rent <Arrow diagonal/></span></div></div>
      <div className="handoff-photo" data-animated><Photo /></div>
      <div className="site-ui" data-animated><div className="site-browser"><span aria-hidden="true">⌑</span> booking.seanrent.com <span>Illustrative website view</span></div><div className="site-brand"><img src="/seanrent/logo.svg" width="150" height="30" alt="Sea N' Rent"/><span>Home &nbsp; Search &nbsp; About us</span></div><h3 className="site-property-title">{STAY.property}</h3><div className="site-booking" data-animated><div className="booking-status"><div className="booking-before" data-animated><small>YOUR DIRECT BOOKING</small><h4>A sea view.<br/> A stay to look forward to.</h4></div><div className="booking-confirmed" data-animated><small>ILLUSTRATIVE CONFIRMATION</small><h4>Your stay is confirmed.</h4></div></div><dl><div><dt>Check-in</dt><dd>{STAY.arrival}</dd></div><div><dt>Check-out</dt><dd>{STAY.departure}</dd></div><div><dt>Guests</dt><dd>{STAY.guests}</dd></div><div><dt>Stay</dt><dd>{STAY.nights}</dd></div></dl><div className="site-total"><span>Sample final total</span><strong>{STAY.total}</strong></div><p>Booking and payment complete<br/>on the property's own website.</p></div></div>
      <div className="pms-receipt" data-animated><span className="receipt-icon" aria-hidden="true">↙</span><div><small>YOUR PMS</small><strong>Direct website booking received</strong><span>{STAY.dates} · {STAY.guests} · {STAY.total}</span></div></div>
    </div>
    <div className="journey-lines"><p className="journey-line-1" data-animated>Your PMS supplies the details.</p><p className="journey-line-2" data-animated>The guest books on your site.</p><p className="journey-line-3" data-animated>The reservation reaches your PMS.</p></div>
    <p className="scene-caption">Illustrative journey. No reservation or payment is made. <a href={STAY.url} target="_blank" rel="noreferrer">View the real property ↗</a></p>
  </div></section>;
}
