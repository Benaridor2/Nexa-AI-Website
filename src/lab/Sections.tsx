import { useRef, useState } from 'react';
import { FAQ, PMS, PROPERTY } from './data';
import { Fold, Mark, useVertical } from './Fold';
import gsap from 'gsap';
import { useEffect } from 'react';
import { isStill } from './motion';
import type { FoldController } from './fold';
import { useReveal } from './motion';
import { anchor, setPath, slantRoute, slantRouteDown, useThreads } from './threads';

// The closed fold as a small object: the place, with the violet spine that
// tells you there is a layer inside.
export function ClosedCard({ src, alt, name, meta, className = '' }: { src: string; alt: string; name?: string; meta?: string; className?: string }) {
  return <div className={`closed-card ${className}`}>
    <div className="closed-body">
      <figure className="closed-face"><img src={src} alt={alt} loading="lazy" decoding="async"/>{name && <figcaption><span>{name}</span>{meta && <small>{meta}</small>}</figcaption>}</figure>
      <i className="closed-spine" aria-hidden="true"/>
    </div>
  </div>;
}

// ---------------------------------------------------------------- Two kinds of guests

export function Guests() {
  const root = useRef<HTMLElement>(null);
  const vertical = useVertical();
  useReveal(root);
  useThreads(root, (el, box) => {
    const card = el.querySelector('.guests-card .closed-body')!, site = el.querySelector('.guests-site')!;
    const [direct, agent] = [...el.querySelectorAll('.guest-slip')];
    const paths = el.querySelectorAll<SVGPathElement>('.guests-thread path');
    if (vertical) {
      const to = anchor(card, box, 'top');
      setPath(paths[0], slantRouteDown(anchor(direct, box, 'bottom'), { x: to.x - 14, y: to.y }, .55));
      setPath(paths[1], slantRouteDown(anchor(agent, box, 'bottom'), { x: to.x + 14, y: to.y }, .55));
      setPath(paths[2], slantRouteDown(anchor(card, box, 'bottom'), anchor(site, box, 'top')));
    } else {
      const to = anchor(card, box, 'left');
      setPath(paths[0], slantRoute(anchor(direct, box, 'right'), { x: to.x, y: to.y - 18 }, .6));
      setPath(paths[1], slantRoute(anchor(agent, box, 'right'), { x: to.x, y: to.y + 18 }, .6));
      setPath(paths[2], slantRoute(anchor(card, box, 'right'), anchor(site, box, 'left')));
    }
  }, [vertical]);
  return <section className="guests" id="guests" ref={root} aria-labelledby="guests-title">
    <div className="guests-copy" data-reveal>
      <p className="section-kicker">NEXA Direct · NEXA Agent</p>
      <h2 id="guests-title">Two ways in.<br/>One connection.</h2>
      <p>Some guests ask for you by name. Others ask for a place to stay. The same connection answers both, and both book on your own website.</p>
    </div>
    <div className="guests-map" data-reveal>
      <div className="guest-slip is-direct">
        <span className="slip-kind"><b>Direct</b>They ask for you, by name</span>
        <q>Find me a Sea N' Rent apartment.</q>
      </div>
      <div className="guest-slip is-agent">
        <span className="slip-kind"><b>Agent</b>They ask for a stay; you become the answer</span>
        <q>A sea-view apartment in Tel Aviv.</q>
      </div>
      <ClosedCard className="guests-card" src={PROPERTY.photo} alt={`${PROPERTY.name}, stone arches`} name={PROPERTY.name} meta="Priced · bookable"/>
      <div className="guests-site"><span>Your website</span><small>Your booking. Your guest.</small></div>
      <svg className="guests-thread" aria-hidden="true"><path/><path/><path className="is-out"/></svg>
    </div>
  </section>;
}

// ---------------------------------------------------------------- How it connects: the technical sheet

const NODES = [
  { id: 'pms', title: 'Your PMS', text: 'Availability, rates and reservations, as you run them today.' },
  { id: 'nexa', title: 'Nexa layer', text: 'Live availability, a final price and the direct route, readable by an AI.' },
  { id: 'ai', title: 'The AI assistant', text: 'The guest asks the assistant they already use. Nothing to install.' },
  { id: 'site', title: 'Your website', text: 'Booking and payment in your own checkout.' },
];

export function Connect() {
  const root = useRef<HTMLElement>(null);
  const vertical = useVertical();
  const [runs, setRuns] = useState(0);
  useReveal(root);
  useThreads(root, el => {
    // Coordinates are relative to the line itself, where the SVG and the packet live.
    const line = el.querySelector<HTMLElement>('.connect-line')!, box = line.getBoundingClientRect();
    const nodes = [...line.querySelectorAll('.node-plate')];
    const paths = line.querySelectorAll<SVGPathElement>('.connect-thread path');
    const segs: string[] = [];
    // Phones: the line runs down through the plates' dots, beside the indented text.
    const dotX = (n: Element) => { const d = n.querySelector('.node-dot, .mark')!.getBoundingClientRect(); return d.left + d.width / 2 - box.left; };
    for (let i = 0; i < nodes.length - 1; i++) {
      const a = anchor(nodes[i], box, vertical ? 'bottom' : 'right'), b = anchor(nodes[i + 1], box, vertical ? 'top' : 'left');
      segs.push(vertical ? `M${dotX(nodes[0])} ${a.y} V${b.y}` : `M${a.x} ${a.y} H${b.x}`);
    }
    setPath(paths[0], segs.join(' '));
    // The way back: the reservation returns to the PMS as a direct booking.
    const first = nodes[0].getBoundingClientRect(), last = nodes[nodes.length - 1].getBoundingClientRect();
    let back: string;
    if (vertical) {
      const x = Math.max(first.right, last.right) - box.left + 20, top = first.top - box.top + first.height / 2, bottom = last.top - box.top + last.height / 2;
      back = `M${last.right - box.left} ${bottom} H${x} V${top} H${first.right - box.left}`;
    } else {
      const y = box.height - 40;
      back = `M${last.left - box.left + last.width / 2} ${last.bottom - box.top} V${y} H${first.left - box.left + first.width / 2} V${first.bottom - box.top}`;
    }
    setPath(paths[1], back);
    // The packet travels the whole loop: out along the line, back along the return.
    const out = nodes.map((n, i) => { const c = anchor(n, box, 'center'); return `${i ? 'L' : 'M'}${c.x.toFixed(1)} ${c.y.toFixed(1)}`; }).join(' ');
    const packet = line.querySelector<HTMLElement>('.connect-packet');
    const lastC = anchor(nodes[nodes.length - 1], box, 'center');
    if (packet) packet.style.offsetPath = `path('${out} ${back.replace(/^M[^A-Z]*/, `L${lastC.x.toFixed(1)} ${lastC.y.toFixed(1)} `)}')`;
  }, [vertical]);
  return <section className="connect" id="connect" ref={root} aria-labelledby="connect-title">
    <div className="sheet-marks" aria-hidden="true"><i/><i/><i/><i/></div>
    <header className="connect-head" data-reveal>
      <p className="section-kicker">How it connects</p>
      <h2 id="connect-title">Plugs in like a channel.</h2>
      <p>Exactly like connecting Airbnb or Booking.com, through the PMS you already run. No developer. No code. Live in days.</p>
    </header>
    <div className="connect-line" data-reveal key={runs}>
      <ol className="connect-nodes">
        {NODES.map((n, i) => <li key={n.id} className={`node is-${n.id}`} style={{ '--i': i } as React.CSSProperties}>
          <div className="node-plate">{n.id === 'nexa' ? <Mark/> : <span className="node-dot"/>}<b>{n.title}</b></div>
          <p>{n.text}</p>
        </li>)}
      </ol>
      <p className="connect-return">The reservation reaches your PMS as a direct booking.</p>
      <svg className="connect-thread" aria-hidden="true"><path className="is-main"/><path className="is-return"/></svg>
      <i className="connect-packet" aria-hidden="true"/>
    </div>
    <div className="connect-foot" data-reveal>
      <dl className="spec">
        <div><dt>Setup</dt><dd>Through your PMS</dd></div>
        <div><dt>Developer</dt><dd>Not needed</dd></div>
        <div><dt>Guest installs</dt><dd>Nothing</dd></div>
        <div><dt>Live in</dt><dd>Days</dd></div>
      </dl>
      <ul className="pms-list" aria-label="Supported PMS">{PMS.map(p => <li key={p}>{p}</li>)}</ul>
      <button type="button" className="lab-link" onClick={() => setRuns(r => r + 1)}>Trace a booking again <span aria-hidden="true">↺</span></button>
    </div>
  </section>;
}

// ---------------------------------------------------------------- A quiet moment: what stays yours

export function Yours() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  return <section className="yours" ref={root} aria-labelledby="yours-title">
    <figure className="yours-photo"><img src="/lab/sea-balcony.webp" alt="A balcony over the sea in Tel Aviv, palms on the promenade below" loading="lazy" decoding="async"/></figure>
    <div className="yours-copy" data-reveal>
      <h2 id="yours-title"><span>Your website.</span><span>Your checkout.</span><span>Your guest.</span></h2>
      <p>One commission on the bookings the AI brings you. No monthly fees.</p>
      <a className="lab-link" href="/pricing#calculator">See pricing and calculate what you keep <span aria-hidden="true">→</span></a>
    </div>
  </section>;
}

// ---------------------------------------------------------------- Proof

export function Proof() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  return <section className="proof" ref={root} aria-label="Nexa at a glance">
    <dl className="proof-grid" data-reveal>
      <div className="is-wide"><dt>HVC Startup Competition by SHIC, Zurich 2026 · over 65% of the vote from global hospitality leaders</dt><dd>Winner</dd></div>
      <div><dt>Countries, USA &amp; EMEA</dt><dd>37</dd></div>
      <div><dt>PMS integrations</dt><dd>6</dd></div>
      <div><dt>Units, from a single owner up</dt><dd>3,000</dd></div>
    </dl>
  </section>;
}

// ---------------------------------------------------------------- Who it is for

export function Audience() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  return <section className="audience" ref={root} aria-labelledby="audience-title">
    <h2 id="audience-title" className="sr-only">Who Nexa is for</h2>
    <a className="audience-item" href="/solutions" data-reveal>
      <ClosedCard src="/lab/hotel-terrace.webp" alt="A hotel roof terrace with planters and loungers"/>
      <div><p className="section-kicker">Hotels</p><h3>I run a hotel.</h3><p>Defend your loyalty program, fill the gaps, shrink the OTA bill.</p><span className="lab-link">Nexa for hotels <span aria-hidden="true">→</span></span></div>
    </a>
    <a className="audience-item" href="/solutions" data-reveal>
      <ClosedCard src="/lab/arched-window.webp" alt="An apartment living room under a tall arched window in Jaffa"/>
      <div><p className="section-kicker">Vacation rentals</p><h3>I run vacation rentals.</h3><p>Defend your brand, from one unit to a 3,000-unit portfolio.</p><span className="lab-link">Nexa for vacation rentals <span aria-hidden="true">→</span></span></div>
    </a>
  </section>;
}

// ---------------------------------------------------------------- FAQ

export function Faq() {
  const [open, setOpen] = useState(0);
  return <section className="faq" id="faq" aria-labelledby="faq-title">
    <div className="faq-head"><p className="section-kicker">FAQ</p><h2 id="faq-title">Straight answers.</h2></div>
    <ul className="faq-list">
      {FAQ.map(([q, a], i) => <li key={q} className={open === i ? 'is-open' : ''}>
        <h3><button type="button" aria-expanded={open === i} aria-controls={`faq-${i}`} onClick={() => setOpen(open === i ? -1 : i)}><span className="faq-n">{String(i + 1).padStart(2, '0')}</span>{q}<i aria-hidden="true"/></button></h3>
        <div className="faq-a" id={`faq-${i}`} role="region" hidden={open !== i}><p>{a}</p></div>
      </li>)}
    </ul>
  </section>;
}

// ---------------------------------------------------------------- Closing

export function Closing({ onPriced }: { onPriced: () => void }) {
  const root = useRef<HTMLElement>(null);
  const fold = useRef<FoldController | null>(null);
  const vertical = useVertical();
  useReveal(root);
  // The bookend: the opening unfolded in daylight; this one unfolds at night, once.
  useEffect(() => {
    const el = root.current!, f = fold.current;
    if (!f) return;
    const open = vertical ? { fold: 24, yaw: 16, pitch: -6, scale: .8 } : { fold: 38, yaw: -8, pitch: -16, scale: .82 };
    const closed = vertical ? { fold: 84, yaw: 0, pitch: -80, scale: .78 } : { fold: -84, yaw: 70, pitch: -10, scale: .8 };
    if (isStill()) { f.set(open); return; }
    f.set(closed);
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      gsap.to(f.state, { ...open, duration: 1.8, delay: .2, ease: 'power3.inOut', onUpdate: f.render });
    }, { threshold: .45 });
    io.observe(el);
    return () => io.disconnect();
  }, [vertical]);
  return <section className="closing" ref={root} data-tone="dark" aria-labelledby="closing-title">
    <div className="set-light is-night" aria-hidden="true"><i/><i/><i/></div>
    <div className="closing-copy" data-reveal>
      <h2 id="closing-title">Get priced<br/>before your competitor does.</h2>
      <div className="closing-actions"><button type="button" className="lab-button is-primary is-light" onClick={onPriced}>Get priced</button><a className="lab-button is-quiet is-dark" href="/contact">Talk to a person</a></div>
    </div>
    <Fold className="closing-fold" label={`${PROPERTY.name}, priced and bookable.`} onReady={f => { fold.current = f; }}/>
  </section>;
}

export function Footer() {
  return <footer className="lab-footer">
    <div className="footer-top">
      <img src="/nexa-purple.png" alt="Nexa" width="104" height="23"/>
      <p>Be where your next guest is asking, not where they used to search.</p>
      <nav aria-label="Footer"><a href="/solutions">Solutions</a><a href="/pricing">Pricing</a><a href="/about">About</a><a href="/contact">Contact</a><a href="#faq">FAQ</a></nav>
    </div>
    <div className="footer-bottom">
      <span>© 2026 NEXA</span>
      <span>Experimental homepage concept. The current site is at <a href="/">the main homepage</a>.</span>
      <span>Sea N' Rent is used as a property example, not a customer endorsement. All booking data shown is illustrative.</span>
    </div>
  </footer>;
}

// ---------------------------------------------------------------- Get priced (a preview: nothing is collected)

export function PricedDialog({ dialog }: { dialog: React.RefObject<HTMLDialogElement | null> }) {
  return <dialog className="lab-dialog" ref={dialog} aria-labelledby="dialog-title" onClick={e => { if (e.target === dialog.current) dialog.current?.close(); }}>
    <div className="dialog-sheet">
      <i className="dialog-spine" aria-hidden="true"/>
      <button type="button" className="dialog-close" aria-label="Close" onClick={() => dialog.current?.close()}>×</button>
      <p className="section-kicker">Get priced</p>
      <h2 id="dialog-title">A direct connection starts with your property.</h2>
      <p>The next step is a conversation about three things:</p>
      <ol><li><span>01</span>Your PMS</li><li><span>02</span>Your direct booking website</li><li><span>03</span>Your hotel or rental portfolio</li></ol>
      <p className="dialog-note">Prototype preview. No information is collected or submitted.</p>
      <div className="dialog-actions"><a className="lab-button is-primary" href="/contact">Talk to a person</a><a className="lab-button is-quiet" href="/pricing">See pricing</a></div>
    </div>
  </dialog>;
}
