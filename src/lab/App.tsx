import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource-variable/mona-sans/standard.css';
import { useEffect, useRef } from 'react';
import { Fold, Mark } from './Fold';
import { Scene } from './Scene';
import { PMS } from './data';
import type { FoldController } from './fold';

function Header() {
  return <header className="lab-header">
    <a className="lab-logo" href="/lab" aria-label="Nexa home"><img src="/nexa-purple.png" alt="Nexa" width="116" height="25"/></a>
    <nav aria-label="Main">
      <a href="#layer">The layer</a>
      <a href="/solutions">Solutions</a>
      <a href="/pricing">Pricing</a>
      <a href="/about">About</a>
    </nav>
    <a className="lab-button is-primary" href="#get-priced">Get priced</a>
  </header>;
}

function Hero() {
  const fold = useRef<FoldController | null>(null);
  const section = useRef<HTMLElement>(null);
  // Draw the seam from the headline's dot to the left hinge of the Nexa layer.
  useEffect(() => {
    const root = section.current!;
    const draw = () => {
      const vertical = root.querySelector<HTMLElement>('.hero-fold')?.dataset.orientation === 'vertical';
      const svg = root.querySelector<SVGSVGElement>('.hero-thread'), dot = root.querySelector('.hero-seam'), hinge = root.querySelector(vertical ? '.panel-2 .layer-anchor-end' : '.panel-2 .layer-anchor');
      if (!svg || !dot || !hinge) return;
      const box = root.getBoundingClientRect(), a = dot.getBoundingClientRect(), b = hinge.getBoundingClientRect();
      const x1 = a.left - box.left, y1 = a.top + a.height / 2 - box.top, x2 = b.left - box.left, y2 = b.top + b.height / 2 - box.top;
      // Desktop: across, then down the slant into the hinge. Phones: along the seam, down the margin, into the panel.
      const edge = box.width - 12;
      svg.querySelector('path')!.setAttribute('d', vertical ? `M${x1} ${y1} H${edge} V${y2} H${x2}` : `M${x1} ${y1} H${x1 + (x2 - x1) * .72} L${x2} ${y2}`);
      const c = svg.querySelector('circle')!; c.setAttribute('cx', String(x2)); c.setAttribute('cy', String(y2));
    };
    const loop = () => { draw(); frame = requestAnimationFrame(loop); };
    let frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);
  return <section className="lab-hero" aria-labelledby="hero-title" ref={section}>
    <div className="set" aria-hidden="true"><div className="set-wall"/><div className="set-floor"/><div className="set-light"><i/><i/><i/></div></div>
    <div className="hero-head">
      <p className="kicker">Nexa AI Connector · for hotels and vacation rentals</p>
      <h1 id="hero-title"><span className="hero-ask">Your next guest is asking an AI.</span><span className="hero-seam" aria-hidden="true"><i/></span><span className="hero-answer">Be the answer.</span></h1>
    </div>
    <Fold className="hero-fold" label="The Pearl of Jaffa as an AI can present it: the place, the Nexa layer with live availability and final price from the PMS, and the offer to book direct on the property's website." onReady={f => { fold.current = f; }} initial={{ fold: 40, yaw: -6, pitch: -17, roll: 0 }}/>
    <div className="hero-body">
      <p className="hero-lead">Nexa gives AI assistants your live availability, your final price and a direct route to your own website, straight from the PMS you already run. So the AI can recommend you, and the guest books with you.</p>
      <div className="hero-actions"><a className="lab-button is-primary" href="#get-priced">Get priced</a><a className="lab-button is-quiet" href="#layer">Open the layer <span aria-hidden="true">↓</span></a></div>
      <p className="hero-pms"><span>Connects through</span> {PMS.join(' · ')}</p>
    </div>
    <svg className="hero-thread" aria-hidden="true"><path/><circle r="3.5"/></svg>
    <p className="hero-note"><Mark tone="purple"/>Illustrative stay. Sea N' Rent is a property example, not a customer endorsement.</p>
  </section>;
}

export default function App() {
  useEffect(() => { document.title = 'Nexa · Be the answer (lab)'; }, []);
  return <div className="lab">
    <a className="lab-skip" href="#main">Skip to content</a>
    <Header/>
    <main id="main">
      <Hero/>
      <Scene/>
      <section className="lab-after" style={{ height: '100vh' }}/>
    </main>
  </div>;
}
