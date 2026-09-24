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
export function Label({ children }: { children: React.ReactNode }) {
  if (typeof children === 'string' && children.includes(' / ')) {
    const [left, ...right] = children.split(' / ');
    return <p className="eyebrow section-label"><span>{left}</span><span>{right.join(' / ')}</span></p>;
  }
  return <p className="eyebrow">{children}</p>;
}
function ComposerTools() {
  return <span className="composer-tools" aria-hidden="true"><span className="plus">+</span><span className="composer-right"><svg viewBox="0 0 24 24" fill="none"><rect x="9" y="3" width="6" height="12" rx="3" stroke="currentColor" strokeWidth="1.5"/><path d="M6 10v2a6 6 0 0 0 12 0v-2M12 18v3" stroke="currentColor" strokeWidth="1.5"/></svg><span className="send-arrow">↑</span></span></span>;
}

const chatRenderer = (root: HTMLElement) => {
  const q = (s: string) => root.querySelector<HTMLElement>(s);
  const frame = q('.chat-window'), query = q('.query-morph'), welcome = q('.chat-welcome'), tools = q('.query-tools'), dock = q('.chat-dock'), search = q('.chat-search'), response = q('.chat-response');
  const chunks = [...root.querySelectorAll<HTMLElement>('.query-chunk')];
  const lines = [...root.querySelectorAll<HTMLElement>('.answer-beat')];
  const photo = q('.answer-photo'), track=q('.conversation-track'), clarification=q('.chat-clarification'), reply=q('.chat-details');
  const replyChunks=[...root.querySelectorAll<HTMLElement>('.reply-chunk')];
  const narrow = matchMedia('(max-width: 699px)');
  const stage = q('.scene-stage'), shutters = [...root.querySelectorAll<HTMLElement>('.portal-shutter')];
  const depth = [...root.querySelectorAll<HTMLElement>('.depth-frame')];
  return (p: number) => {
    const open = phase(p, .025, .17), send = phase(p, .29, .36), focus = 0;
    styles(stage, { '--portal-open': open });
    shutters.forEach((el,i) => styles(el, { transform: `translateX(${(i ? 1 : -1)*open*110}%) rotateY(${(i ? 1 : -1)*open*35}deg)`, opacity: 1-phase(p,.11,.19) }));
    depth.forEach((el,i) => styles(el,{ transform: `perspective(1600px) translateZ(${(i+1)*-45}px) rotateX(${(1-open)*36}deg) rotateZ(${(i-1)*3*(1-open)}deg) scale(${.78+open*.22+i*.035})`, opacity: (1-open)*.5 }));
    styles(frame, { transform: `perspective(1600px) translateY(${(1-open)*-90-7*focus}px) rotateX(${(1-open)*48}deg) rotateY(${(1-open)*-12}deg) rotateZ(${(1-open)*-5}deg) scale(${.70+.30*open+.012*focus})` });
    const surface = Math.round(255 - 14 * send);
    styles(query, { '--send': send, width: `${narrow.matches ? 90 : 76 - 8 * send}%`, transform: `translateY(${(1-send)*130}px)`, 'border-radius': `${26-6*send}px`, 'font-size': narrow.matches ? '' : `${17-2*send}px`, background: `rgb(${surface},${surface},${surface})`, 'border-color': `rgba(150,150,150,${.3*(1-send)})` });
    visible(welcome,1-phase(p,.27,.32));
    visible(tools,1-phase(p,.29,.33),false);
    styles(tools,{height:`${36*(1-phase(p,.32,.36))}px`,'margin-top':`${12*(1-phase(p,.32,.36))}px`});
    chunks.forEach((el,i)=>visible(el,phase(p,.18+i*.025,.205+i*.025),false));
    visible(dock,phase(p,.32,.36),false);
    const ask=phase(p,.40,.45), details=phase(p,.53,.58);
    visible(clarification,ask);styles(clarification,{transform:`translateY(${12*(1-ask)}px)`});
    visible(reply,details);styles(reply,{transform:`translateY(${12*(1-details)}px)`});
    replyChunks.forEach((el,i)=>visible(el,phase(p,.53+i*.025,.56+i*.025),false));
    visible(search,between(p,.65,.67,.72,.745));
    styles(track,{transform:`translateY(${-phase(p,.73,.81)*(narrow.matches?300:260)}px)`});
    visible(response,phase(p,.79,.815));
    lines.forEach((el,i)=>{const t=phase(p,.79+i*.012,.823+i*.012);visible(el,t);styles(el,{transform:`translateY(${12*(1-t)}px)`});});
    styles(photo,{'clip-path':`inset(${(1-phase(p,.825,.875))*100}% 0 0 0 round 10px)`});
    styles(q('.story-progress-fill'),{transform:`scaleX(${p})`});
  };
};

export function Conversation({ motion }: { motion: boolean }) {
  const ref = useRef<HTMLElement>(null);
  useScene(ref, motion, chatRenderer);
  return <section id="guest-story" className="conversation scene-section" ref={ref} aria-labelledby="guest-title">
    <div className="scene-stage wrap" data-animated>
      <div className="depth-frame" data-animated aria-hidden="true"/><div className="depth-frame" data-animated aria-hidden="true"/><div className="depth-frame" data-animated aria-hidden="true"/><div className="portal-shutter shutter-left" data-animated aria-hidden="true"><span>ASK.</span></div><div className="portal-shutter shutter-right" data-animated aria-hidden="true"><span>ANSWER.</span></div><h2 className="sr-only" id="guest-title">A question becomes a bookable answer</h2><div className="scene-orbit" aria-hidden="true"/><div className="story-cue"><span>THE GUEST'S EXISTING AI ASSISTANT</span><span>SCROLL TO FOLLOW THE CONVERSATION</span></div>
      <div className="chat-window" data-animated>
        <div className="chat-rail" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.5"/><path d="M9 4v16" stroke="currentColor" strokeWidth="1.5"/></svg><svg viewBox="0 0 24 24" fill="none"><path d="M15 4H5v15h15V9M10 14 20 4l2 2-10 10-3 1 1-3Z" stroke="currentColor" strokeWidth="1.5"/></svg><svg viewBox="0 0 24 24" fill="none"><circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="1.5"/><path d="m15 15 5 5" stroke="currentColor" strokeWidth="1.5"/></svg></div>
        <div className="chat-app-header"><span>ChatGPT <span className="chevron">⌄</span></span><span className="chat-header-actions" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M12 15V3m-4 4 4-4 4 4M5 12v8h14v-8" stroke="currentColor" strokeWidth="1.5"/></svg><svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg></span></div>
        <p className="chat-welcome" data-animated>Where should we begin?</p>
        <div className="conversation-viewport"><div className="conversation-track" data-animated><div className="query-morph" data-animated><p>{STAY.queryChunks.map((text, i) => <span className="query-chunk" data-animated key={i}>{text}</span>)}</p><div className="query-tools" data-animated><ComposerTools /></div></div>
        <p className="chat-clarification" data-animated>{STAY.clarification}</p><div className="chat-details" data-animated>{STAY.replyChunks.map((text,i)=><span className="reply-chunk" data-animated key={i}>{text}</span>)}</div><div className="chat-search" data-animated><span aria-hidden="true">◎</span><div>Searching the web<small>Apartments near the sea in Tel Aviv</small></div></div>
        <div className="chat-response" data-animated>
          <p className="answer-beat" data-animated>Here's a Sea N' Rent apartment that fits:</p>
          <h3 className="answer-beat" data-animated>{STAY.property}</h3>
          <p className="answer-beat answer-description" data-animated>One bedroom, a private balcony and a sea view.</p>
          <div className="answer-beat answer-photo" data-animated><Photo eager /></div>
          <div className="answer-beat connected-badge" data-animated>Connected to NEXA AI</div><div className="answer-beat answer-facts" data-animated><span>{STAY.shortDates} · {STAY.guests} · {STAY.nights}</span><strong>{STAY.total} <span>final total</span></strong></div>
          <a className="answer-beat source-link" data-animated href="#how-it-works">Book direct <Arrow diagonal /></a>
        </div>
        </div></div><div className="chat-dock" data-animated aria-hidden="true"><span>Ask ChatGPT</span><ComposerTools /></div>
      </div>
      <div className="story-progress" aria-hidden="true"><i className="story-progress-fill" data-animated/></div><p className="scene-caption">Illustrative ChatGPT conversation. Dates, availability and final price are examples.</p>
    </div>
  </section>;
}

const compareRenderer = (root: HTMLElement) => {
  const rows = [...root.querySelectorAll<HTMLElement>('.comparison-row')];
  const card = root.querySelector<HTMLElement>('.comparison-card');
  const state = root.querySelector<HTMLElement>('.priced-word'), old = root.querySelector<HTMLElement>('.unpriced-word');
  return (p: number) => {
    styles(card,{transform:`perspective(1400px) rotateY(${-8*(1-phase(p,0,.3))}deg) translateY(${28*(1-phase(p,0,.3))}px)`});
    rows.forEach((row, i) => {
      const t = phase(p, .20 + i * .19, .31 + i * .19);
      const focus = between(p, .15 + i * .19, .20 + i * .19, .31 + i * .19, .37 + i * .19);
      styles(row, { transform: `translateX(${-14 * focus}px) rotateX(${-16*Math.sin(t*Math.PI)}deg) scale(${1 + .015 * focus})`, '--row-ready': t });
      const missing = row.querySelector<HTMLElement>('.row-missing');
      const ready = row.querySelector<HTMLElement>('.row-ready');
      styles(missing, { 'clip-path': `inset(0 0 0 ${t * 100}%)` });
      styles(ready, { 'clip-path': `inset(0 ${(1 - t) * 100}% 0 0)` });
      missing?.setAttribute('aria-hidden', String(t > .5));
      ready?.setAttribute('aria-hidden', String(t <= .5));
    });
    visible(old, 1 - phase(p, .79, .87));
    styles(state, { 'clip-path': `inset(${100 * (1 - phase(p, .79, .87))}% 0 0 0)` });
    state?.setAttribute('aria-hidden', String(p < .85));
  };
};

export function Comparison({ motion }: { motion: boolean }) {
  const ref = useRef<HTMLElement>(null); useScene(ref, motion, compareRenderer);
  return <section className="comparison scene-section" id="priced" ref={ref} aria-labelledby="priced-title"><div className="scene-stage wrap">
    <Label>[01] THE TWO WORDS / PRICED OR UNPRICED</Label><div className="comparison-copy"><h2 id="priced-title">Being mentioned is nice. <br/><em>Being bookable is where the money is.</em></h2><p>Two words decide who gets the booking. The AI needs live availability, a final price, and a trusted way to book direct.</p><div className="price-word-wrap"><span className="unpriced-word" data-animated>UNPRICED</span><span className="priced-word" data-animated>PRICED<span>↗</span></span></div></div>
    <div className="comparison-card" data-animated><div className="comparison-property"><span className="property-symbol" aria-hidden="true">N</span><div><small>SAME GUEST. SAME QUESTION.</small><h3>Your property. Two possible answers.</h3></div></div>
      <div className="comparison-table">{[
        ['Availability', 'Not available in this example', `${STAY.dates} · ${STAY.guests}`],
        ['Final price', 'Unknown', `${STAY.total} · ${STAY.nights}`],
        ['Direct booking', 'Link unavailable', "The property's own website"],
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
    const travel = phase(p, .30, .58), confirmation = phase(p, .79, .84), received = phase(p, .89, .94);
    const explode = between(p,.06,.22,.29,.43);
    styles(q('.system-flow'),{transform:`perspective(1200px) rotateY(${-12*explode}deg) translateX(${-18*explode}px)`});
    styles(q('.journey-answer'),{transform:`perspective(1200px) rotateY(${8*explode}deg) translateY(${-8*explode}px)`});
    styles(q('.site-ui'),{transform:`perspective(1600px) rotateY(${(1-travel)*22}deg) scale(${.88+.12*travel})`});
    visible(q('.system-flow'), 1 - phase(p, .3, .43));
    visible(q('.journey-answer'), 1 - phase(p, .38, .46));
    visible(q('.site-ui'), phase(p, .43, .49));
    styles(q('.site-ui'), { 'clip-path': 'inset(0 round 12px)' });
    visible(q('.site-booking'), phase(p, .59, .65));
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
    <Label>[02] HOW IT WORKS / THE FIX</Label><header className="scene-heading centered"><h2 id="works-title">From "find me a place"<br/><em>to a booking on your site.</em></h2></header>
    <div className="journey-canvas">
      <div className="system-flow" data-animated><div className="pms-source"><span className="system-icon" aria-hidden="true">▤</span><span>Your existing PMS<small>The source of your booking data</small></span></div><div className="flow-thread" aria-hidden="true"/><div className="nexa-source"><img src="/nexa-white.png" alt="Nexa" width="110" height="24"/><small>AI CONNECTOR</small></div><div className="flow-facts" data-animated><span>Availability</span><span>Final price</span><span>Direct booking</span></div><p>One connection.<br/>The details an answer needs.</p></div>
      <div className="journey-answer" data-animated><small>IN THE GUEST'S AI ASSISTANT</small><h3>{STAY.property}</h3><div className="journey-answer-bottom"><span>{STAY.dates} · {STAY.guests}</span><strong>{STAY.total}<small>final total</small></strong><span className="visual-link">Book direct <Arrow diagonal/></span></div></div>
      <div className="handoff-photo" data-animated><Photo /></div>
      <div className="site-ui" data-animated><div className="site-browser"><span aria-hidden="true">⌑</span> The property's own website <span>Illustrative website view</span></div><div className="site-brand"><img src="/seanrent/logo.svg" width="150" height="30" alt="Sea N' Rent"/><span>Home &nbsp; Search &nbsp; About us</span></div><h3 className="site-property-title">{STAY.property}</h3><div className="site-booking" data-animated><div className="booking-status"><div className="booking-before" data-animated><small>YOUR DIRECT BOOKING</small><h4>A sea view.<br/> A stay to look forward to.</h4></div><div className="booking-confirmed" data-animated><small>ILLUSTRATIVE CONFIRMATION</small><h4>Your stay is confirmed.</h4></div></div><dl><div><dt>Check-in</dt><dd>{STAY.arrival}</dd></div><div><dt>Check-out</dt><dd>{STAY.departure}</dd></div><div><dt>Guests</dt><dd>{STAY.guests}</dd></div><div><dt>Stay</dt><dd>{STAY.nights}</dd></div></dl><div className="site-total"><span>Sample final total</span><strong>{STAY.total}</strong></div><p>Booking and payment complete<br/>on the property's own website.</p></div></div>
      <div className="pms-receipt" data-animated><span className="receipt-icon" aria-hidden="true">↙</span><div><small>YOUR PMS</small><strong>Direct website booking received</strong><span>{STAY.dates} · {STAY.guests} · {STAY.total}</span></div></div>
    </div>
    <div className="journey-lines"><p className="journey-line-1" data-animated>Your PMS supplies the details.</p><p className="journey-line-2" data-animated>The guest books on your site.</p><p className="journey-line-3" data-animated>The reservation reaches your PMS.</p></div>
    <p className="scene-caption">Illustrative journey. No reservation or payment is made. </p>
  </div></section>;
}
