import '@fontsource/instrument-serif/400.css';
import '@fontsource-variable/mona-sans/standard.css';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Fold, Mark } from './Fold';
import { isStill } from './motion';
import { Scene, StillScene } from './Scene';
import { Audience, Closing, Connect, Faq, Footer, Guests, PricedDialog, Proof, Yours } from './Sections';
import { PMS } from './data';
import type { FoldController, FoldState } from './fold';

// The opening pose: half open, the profile drawing the mark's N.
const HERO_REST: Record<'across' | 'down', Partial<FoldState>> = {
  across: { fold: 40, yaw: -6, pitch: -17, roll: 0, scale: 1 },
  down: { fold: 26, yaw: 18, pitch: -8, roll: 0, scale: .92 },
};
// Where it starts: closed, only the place and its violet seam.
const HERO_START: Record<'across' | 'down', Partial<FoldState>> = {
  across: { fold: -84, yaw: 68, pitch: -10, roll: 0, scale: .96 },
  down: { fold: 84, yaw: 0, pitch: -80, roll: -3, scale: .9 },
};

function Header({ onPriced }: { onPriced: () => void }) {
  // Over dark sections the header turns dark with them.
  const [dark, setDark] = useState(false);
  useEffect(() => {
    let frame = 0;
    const check = () => { frame = 0; const y = 36; setDark([...document.querySelectorAll('[data-tone="dark"]')].some(el => { const r = el.getBoundingClientRect(); return r.top <= y && r.bottom >= y; })); };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(check); };
    check();
    addEventListener('scroll', onScroll, { passive: true });
    return () => { removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
  }, []);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    if (!menu) return;
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(false); };
    addEventListener('keydown', key);
    return () => removeEventListener('keydown', key);
  }, [menu]);
  return <header className={`lab-header${dark ? ' is-dark' : ''}${menu ? ' is-menu' : ''}`}>
    <a className="lab-logo" href="/lab" aria-label="Nexa home"><img src="/nexa-purple.png" alt="Nexa" width="116" height="25"/></a>
    <button type="button" className="lab-menu-button" aria-expanded={menu} aria-controls="lab-nav" onClick={() => setMenu(!menu)}><span>{menu ? 'Close' : 'Menu'}</span></button>
    <nav aria-label="Main" id="lab-nav" onClick={e => { if ((e.target as Element).closest('a')) setMenu(false); }}>
      <a href="#layer">The layer</a>
      <a href="#connect">How it connects</a>
      <a href="/pricing">Pricing</a>
      <a href="/about">About</a>
    </nav>
    <button type="button" className="lab-button is-primary" onClick={onPriced}>Get priced</button>
  </header>;
}

function Hero({ onPriced }: { onPriced: () => void }) {
  const fold = useRef<FoldController | null>(null);
  const section = useRef<HTMLElement>(null);
  const settled = useRef(false);
  const pointer = useRef({ x: 0, y: 0, sx: 0, sy: 0 });
  const orient = () => section.current?.querySelector<HTMLElement>('.hero-fold')?.dataset.orientation === 'vertical' ? 'down' : 'across';

  // Opening: closed on the place, the thread draws from the headline, the fold opens into the N.
  useLayoutEffect(() => {
    const root = section.current!, f = fold.current;
    if (!f) return;
    const o = orient();
    if (isStill()) { f.set(HERO_REST[o]); root.classList.add('is-drawn'); settled.current = true; return; }
    f.set({ ...HERO_REST[o], ...HERO_START[o] });
    root.classList.add('is-intro');
    const img = root.querySelector<HTMLImageElement>('.place-photo img');
    const ready = Promise.race([img?.decode?.().catch(() => undefined) ?? Promise.resolve(), new Promise(r => setTimeout(r, 900))]);
    let tl: gsap.core.Timeline | null = null;
    void ready.then(() => {
      tl = gsap.timeline({ onComplete: () => { settled.current = true; } });
      tl.call(() => root.classList.add('is-drawn'), [], .2)
        .to(f.state, { ...HERO_REST[o], fold: (HERO_REST[o].fold ?? 0) + (o === 'across' ? 3 : 2), duration: 1.6, ease: 'power3.inOut', onUpdate: f.render }, .7)
        .to(f.state, { fold: HERO_REST[o].fold, duration: .5, ease: 'back.out(1.5)', onUpdate: f.render });
    });
    return () => { tl?.kill(); };
  }, []);

  // The thread follows the fold; after the opening, the fold answers the pointer a little.
  useEffect(() => {
    const root = section.current!;
    const svg = root.querySelector<SVGSVGElement>('.hero-thread')!, path = svg.querySelector('path')!, dot = root.querySelector('.hero-seam')!;
    const fine = matchMedia('(pointer: fine)').matches && !isStill();
    const move = (e: PointerEvent) => { const b = root.getBoundingClientRect(); pointer.current.x = (e.clientX - b.left) / b.width - .5; pointer.current.y = (e.clientY - b.top) / b.height - .5; };
    if (fine) root.addEventListener('pointermove', move);
    let frame = 0, on = false;
    const draw = () => {
      const o = orient(), f = fold.current;
      if (f && fine && settled.current) {
        const p = pointer.current; p.sx += (p.x - p.sx) * .06; p.sy += (p.y - p.sy) * .06;
        const rest = HERO_REST[o];
        f.set({ yaw: (rest.yaw ?? 0) + p.sx * 7, pitch: (rest.pitch ?? 0) - p.sy * 4 });
      }
      const hinge = root.querySelector(o === 'down' ? '.panel-2 .layer-anchor-end' : '.panel-2 .layer-anchor');
      if (hinge) {
        const box = root.getBoundingClientRect(), a = dot.getBoundingClientRect(), b = hinge.getBoundingClientRect();
        const x1 = a.left - box.left, y1 = a.top + a.height / 2 - box.top, x2 = b.left - box.left, y2 = b.top + b.height / 2 - box.top;
        // Desktop: across, then down the slant into the hinge. Phones: along the seam, down the margin, into the panel.
        const d = o === 'down' ? `M${x1} ${y1} H${box.width - 12} V${y2} H${x2}` : `M${x1} ${y1} H${x1 + (x2 - x1) * .72} L${x2} ${y2}`;
        if (path.getAttribute('d') !== d) { path.setAttribute('d', d); path.style.setProperty('--len', String(Math.ceil(path.getTotalLength()) + 2)); }
        const c = svg.querySelector('circle')!; c.setAttribute('cx', String(x2)); c.setAttribute('cy', String(y2));
      }
      frame = requestAnimationFrame(draw);
    };
    const io = new IntersectionObserver(([entry]) => { if (entry.isIntersecting && !on) { on = true; frame = requestAnimationFrame(draw); } else if (!entry.isIntersecting && on) { on = false; cancelAnimationFrame(frame); } });
    io.observe(root);
    return () => { io.disconnect(); cancelAnimationFrame(frame); root.removeEventListener('pointermove', move); };
  }, []);
  return <section className="lab-hero" aria-labelledby="hero-title" ref={section}>
    <div className="set" aria-hidden="true"><div className="set-wall"/><div className="set-floor"/><div className="set-light"><i/><i/><i/></div></div>
    <div className="hero-head">
      <p className="kicker">Nexa AI Connector · for hotels and vacation rentals</p>
      <h1 id="hero-title"><span className="hero-ask">Your next guest is asking an AI.</span><span className="hero-seam" aria-hidden="true"><i/></span><span className="hero-answer">Be the answer.</span></h1>
    </div>
    <Fold className="hero-fold" label="The Pearl of Jaffa as an AI can present it: the place, the Nexa layer with live availability and final price from the PMS, and the offer to book direct on the property's website." onReady={f => { fold.current = f; }} initial={HERO_REST.across}/>
    <div className="hero-body">
      <p className="hero-lead">Nexa gives AI assistants your live availability, your final price and a direct route to your own website, straight from the PMS you already run. So the AI can recommend you, and the guest books with you.</p>
      <div className="hero-actions"><button type="button" className="lab-button is-primary" onClick={onPriced}>Get priced</button><a className="lab-button is-quiet" href="#layer">Open the layer <span aria-hidden="true">↓</span></a></div>
      <p className="hero-pms"><span>Connects through</span> {PMS.join(' · ')}</p>
    </div>
    <svg className="hero-thread" aria-hidden="true"><path/><circle r="3.5"/></svg>
    <p className="hero-note"><Mark tone="purple"/>Illustrative stay. Sea N' Rent is a property example, not a customer endorsement.</p>
  </section>;
}

export default function App() {
  const [still] = useState(isStill);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const onPriced = () => { opener.current = document.activeElement as HTMLElement; dialog.current?.showModal(); };
  useEffect(() => {
    document.title = 'Nexa · Be the answer (lab)';
    const d = dialog.current, back = () => opener.current?.focus();
    d?.addEventListener('close', back);
    return () => d?.removeEventListener('close', back);
  }, []);
  return <div className={`lab${still ? ' is-still' : ''}`}>
    <a className="lab-skip" href="#main">Skip to content</a>
    <Header onPriced={onPriced}/>
    <main id="main">
      <Hero onPriced={onPriced}/>
      {still ? <StillScene/> : <Scene/>}
      <Guests/>
      <Connect/>
      <Yours/>
      <Proof/>
      <Audience/>
      <Faq/>
      <Closing onPriced={onPriced}/>
    </main>
    <Footer/>
    <PricedDialog dialog={dialog}/>
  </div>;
}
