import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Fold, useVertical } from './Fold';
import { tweenFold, type FoldController, type FoldState } from './fold';
import { money, PROPERTY } from './data';

gsap.registerPlugin(ScrollTrigger);

// One property, four chapters, one object. Scrolling picks the chapter; each
// chapter then plays on its own clock, so a quick scroll never lands on a
// half-drawn frame. The tabs and toggles drive the same states directly.

type Chapter = { id: string; tab: string; title: string; text: string };
const CHAPTERS: Chapter[] = [
  { id: 'guest', tab: 'The guest', title: 'A guest sees a place.', text: 'Stone arches, a long table, Old Jaffa outside the door. That is what makes someone want to stay, and it is all a photograph can say.' },
  { id: 'ai', tab: 'The AI', title: 'An AI has to know it can book it.', text: 'Before it recommends a stay, an assistant needs three answers: is it available, what is the final price, and where can the guest book. Nexa keeps them live from your PMS, in the layer between the place and the offer.' },
  { id: 'priced', tab: 'Priced', title: 'No layer, no answer.', text: "An AI is not allowed to guess. Without live availability and a final price, it sends the guest to someone it can confirm, usually an OTA. With the layer in place, your property is priced, and the answer can end with you." },
  { id: 'direct', tab: 'Book direct', title: 'The booking lands on your website.', text: "The same stay and the same final price, now on your own site, in your own checkout. The reservation reaches your PMS as a direct booking. Nexa never holds the guest's money." },
];

type Pose = Partial<FoldState>;
// Where the fold stands in each chapter, across (desktop) and down (phones).
const POSES: Record<'across' | 'down', Pose[]> = {
  across: [
    { fold: -84, yaw: 74, pitch: -6, roll: 0, scale: 1.18, x: 0, y: 10, link: 1, lock: 1, tuck: 0, ground: .8 },
    { fold: 0, yaw: 0, pitch: 0, roll: 0, scale: .86, x: 0, y: 30, link: 1, lock: 1, tuck: 0, ground: 0 },
    { fold: 26, yaw: -12, pitch: -14, roll: 0, scale: .94, x: 0, y: 40, tuck: 0, ground: 1 },
    { fold: 0, yaw: 0, pitch: 0, roll: 0, scale: .8, x: 0, y: 56, link: 1, lock: 1, tuck: 1, ground: 0 },
  ],
  down: [
    { fold: 84, yaw: 0, pitch: -80, roll: -3, scale: 1, x: 0, y: -6, link: 1, lock: 1, tuck: 0, ground: 0 },
    { fold: 0, yaw: 0, pitch: 0, roll: 0, scale: .74, x: 0, y: -4, link: 1, lock: 1, tuck: 0, ground: 0 },
    { fold: 22, yaw: 14, pitch: -4, roll: 0, scale: .74, x: 0, y: -2, tuck: 0, ground: 0 },
    { fold: 0, yaw: 0, pitch: 0, roll: 0, scale: .78, x: 0, y: 18, link: 1, lock: 1, tuck: 1, ground: 0 },
  ],
};

export function Scene() {
  const section = useRef<HTMLElement>(null);
  const fold = useRef<FoldController | null>(null);
  const vertical = useVertical();
  const [chapter, setChapter] = useState(0);
  const [priced, setPriced] = useState(true);
  const [view, setView] = useState<'guest' | 'ai'>('guest');
  const auto = useRef<gsap.core.Tween | null>(null);
  const reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll position picks the chapter.
  useEffect(() => {
    const root = section.current!;
    const trigger = ScrollTrigger.create({
      trigger: root, start: 'top top', end: 'bottom bottom',
      onUpdate: self => setChapter(Math.min(CHAPTERS.length - 1, Math.floor(self.progress * CHAPTERS.length * .999))),
    });
    return () => trigger.kill();
  }, []);

  // Entering a chapter sets its default state; the priced chapter plays its change once.
  useEffect(() => {
    auto.current?.kill();
    if (chapter <= 1) setView(chapter === 0 ? 'guest' : 'ai');
    if (chapter === 2) { setPriced(false); auto.current = gsap.delayedCall(reduced ? 0 : 1.3, () => setPriced(true)); }
    else setPriced(true);
    return () => { auto.current?.kill(); };
  }, [chapter, reduced]);

  // Pose the fold for the chapter, the view and the priced state.
  useEffect(() => {
    const f = fold.current;
    if (!f) return;
    const poses = POSES[vertical ? 'down' : 'across'];
    const base = chapter <= 1 ? poses[view === 'guest' ? 0 : 1] : poses[chapter];
    const d = reduced ? 0 : 1;
    if (chapter === 2 && !priced) {
      // The layer leaves first, then the offer comes loose.
      tweenFold(f, { ...base, link: 0, lock: 0 }, { duration: 1 * d, ease: 'power2.inOut' });
    } else if (chapter === 2) {
      // Connect, seat, settle: the layer slides into its slot, then the offer locks to it.
      tweenFold(f, { ...base, link: 1, lock: 0 }, { duration: .8 * d, ease: 'power3.out' });
      gsap.to(f.state, { lock: 1, duration: .55 * d, delay: .62 * d, ease: 'back.out(1.6)', onUpdate: f.render });
    } else {
      tweenFold(f, base, { duration: (chapter === 3 ? 1.2 : 1.25) * d, ease: 'power3.inOut' });
    }
  }, [chapter, view, priced, vertical, reduced]);

  // Threads and the website frame follow the object while the scene is on screen.
  useEffect(() => {
    const root = section.current!, stage = root.querySelector<HTMLElement>('.scene-stage')!;
    const pmsPath = root.querySelector<SVGPathElement>('.thread-pms')!, sitePath = root.querySelector<SVGPathElement>('.thread-site')!;
    const site = root.querySelector<HTMLElement>('.scene-site')!;
    let frame = 0, on = false;
    const setPath = (path: SVGPathElement, d: string) => { if (path.getAttribute('d') === d) return; path.setAttribute('d', d); path.style.setProperty('--len', String(Math.ceil(path.getTotalLength()) + 2)); };
    const tick = () => {
      const box = stage.getBoundingClientRect();
      const rel = (el: Element | null) => { const r = el!.getBoundingClientRect(); return { x: r.left - box.left, y: r.top - box.top, w: r.width, h: r.height }; };
      const pms = rel(root.querySelector('.scene-pms')), anchor = rel(root.querySelector('.panel-2 .layer-anchor-foot'));
      // From the PMS, along the floor, up into the foot of the layer ("Source: your PMS").
      const x1 = pms.x + pms.w, y1 = pms.y + pms.h / 2;
      setPath(pmsPath, `M${x1.toFixed(1)} ${y1.toFixed(1)} H${anchor.x.toFixed(1)} V${anchor.y.toFixed(1)}`);
      // The website wraps the joined card: place and offer.
      const a = rel(root.querySelector('.panel-1 .face-front')), b = rel(root.querySelector('.panel-3 .face-front'));
      const left = Math.min(a.x, b.x), top = Math.min(a.y, b.y), right = Math.max(a.x + a.w, b.x + b.w), bottom = Math.max(a.y + a.h, b.y + b.h);
      const pad = { t: 84, r: 22, b: 44, l: 22 };
      site.style.setProperty('--site-x', `${left - pad.l}px`); site.style.setProperty('--site-y', `${top - pad.t}px`);
      site.style.setProperty('--site-w', `${right - left + pad.l + pad.r}px`); site.style.setProperty('--site-h', `${bottom - top + pad.t + pad.b}px`);
      site.style.setProperty('--site-clip-y', `${pad.t}px`); site.style.setProperty('--site-clip-x', `${pad.l}px`);
      const dot = rel(root.querySelector('.site-pms i'));
      const sx = dot.x + dot.w / 2, sy = dot.y + dot.h / 2, px = pms.x + pms.w / 2, py = pms.y;
      setPath(sitePath, `M${sx.toFixed(1)} ${(sy + 8).toFixed(1)} V${(py - 18).toFixed(1)} H${px.toFixed(1)} V${py.toFixed(1)}`);
      frame = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([entry]) => { if (entry.isIntersecting && !on) { on = true; frame = requestAnimationFrame(tick); } else if (!entry.isIntersecting && on) { on = false; cancelAnimationFrame(frame); } });
    io.observe(root);
    return () => { io.disconnect(); cancelAnimationFrame(frame); };
  }, []);

  const go = (i: number) => {
    const root = section.current!, top = root.getBoundingClientRect().top + scrollY;
    const range = root.offsetHeight - innerHeight;
    scrollTo({ top: top + range * (i + .5) / CHAPTERS.length, behavior: reduced ? 'auto' : 'smooth' });
  };

  const current = CHAPTERS[chapter];
  return <section className="scene" id="layer" data-tone="dark" ref={section} aria-labelledby="scene-title" data-chapter={current.id} data-priced={priced} data-view={view}>
    <div className="scene-sticky">
      <div className="scene-copy">
        <p className="scene-count"><span>{String(chapter + 1).padStart(2, '0')}</span> / 0{CHAPTERS.length}</p>
        <h2 id="scene-title" className="sr-only">One property, seen by a guest and by an AI</h2>
        <div className="scene-texts">
          {CHAPTERS.map((c, i) => <article key={c.id} className={`scene-text${i === chapter ? ' is-current' : ''}`} aria-hidden={i !== chapter}>
            <h3>{c.title}</h3><p>{c.text}</p>
          </article>)}
        </div>
        <div className="scene-controls">
          {chapter <= 1 && <div className="toggle" role="group" aria-label="Perspective">
            <button type="button" aria-pressed={view === 'guest'} onClick={() => setView('guest')}>Guest view</button>
            <button type="button" aria-pressed={view === 'ai'} onClick={() => setView('ai')}>AI view</button>
          </div>}
          {chapter === 2 && <div className="toggle" role="group" aria-label="Property state">
            <button type="button" aria-pressed={!priced} onClick={() => { auto.current?.kill(); setPriced(false); }}>Unpriced</button>
            <button type="button" aria-pressed={priced} onClick={() => { auto.current?.kill(); setPriced(true); }}>Priced</button>
          </div>}
        </div>
      </div>
      <div className="scene-stage">
        <div className="scene-answer" aria-live="polite">
          <p className="answer-q">“Somewhere in Old Jaffa for May 1–5, for two.”</p>
          <p className="answer-a"><span className="answer-who">AI assistant</span>
            <span className="answer-off">I can see The Pearl of Jaffa, but I can't confirm its availability or final price for your dates. You could check a booking site.</span>
            <span className="answer-on">The Pearl of Jaffa is available May 1–5. Final price {money(PROPERTY.total)} for 4 nights. You can book direct on the property's website.</span>
          </p>
        </div>
        <div className="scene-site" aria-hidden={chapter !== 3}>
          <div className="site-bar"><i/><i/><i/><span className="site-url"><b aria-hidden="true">⌂</b>{PROPERTY.website}/the-pearl-of-jaffa</span><em>Illustrative</em></div>
          <div className="site-head"><img src="/seanrent/logo.svg" alt="" width="96" height="20"/><span>Stays</span><span>Jaffa</span><span>Contact</span></div>
          <div className="site-foot"><span className="site-pms"><i/>Arrives in your PMS as a direct booking</span></div>
        </div>
        <span className="scene-pms" aria-hidden="true"><i/>Your PMS</span>
        <Fold className="scene-fold" priced={priced} site={chapter === 3} label={chapter === 3 ? `The same stay on the property's website: ${PROPERTY.name}, ${PROPERTY.dates}, final price ${money(PROPERTY.total)}.` : `${PROPERTY.name}: the place, the Nexa layer and the offer an AI can make.`}
          onReady={f => { fold.current = f; f.set(POSES[vertical ? 'down' : 'across'][0]); }}/>
        <svg className="scene-thread" aria-hidden="true"><path className="thread-pms"/><path className="thread-site"/></svg>
      </div>
      <nav className="scene-tabs" aria-label="Chapters">
        {CHAPTERS.map((c, i) => <button key={c.id} type="button" aria-current={i === chapter ? 'step' : undefined} onClick={() => go(i)}><span>0{i + 1}</span>{c.tab}</button>)}
      </nav>
    </div>
  </section>;
}

// The still version of the scene (reduced motion, low-power devices): the same
// four chapters in normal flow, each with the object in its finished state, and
// the priced chapter showing both states side by side.
export function StillScene() {
  const vertical = useVertical();
  const poses = POSES[vertical ? 'down' : 'across'];
  const figure = (i: number, extra: Pose = {}, priced = true) => <Fold className="still-fold" priced={priced} label={i === 2 ? `${PROPERTY.name} ${priced ? 'priced: the Nexa layer in place, available, final price shown, book direct' : 'unpriced: no layer, availability and price unknown'}` : `${PROPERTY.name}: ${CHAPTERS[i].title}`}
    initial={{ ...poses[i], ...extra, scale: (poses[i].scale ?? 1) * (i === 0 ? .78 : .86) }}/>;
  return <section className="scene is-static" id="layer" data-tone="dark" aria-labelledby="still-title">
    <h2 id="still-title" className="still-title">One property, seen by a guest and by an AI.</h2>
    {CHAPTERS.map((c, i) => <article key={c.id} className={`still-chapter is-${c.id}`}>
      <div className="still-copy"><p className="scene-count"><span>0{i + 1}</span> / 0{CHAPTERS.length}</p><h3>{c.title}</h3><p>{c.text}</p></div>
      <div className="still-figure">
        {i === 0 && figure(0)}
        {i === 1 && figure(1)}
        {i === 2 && <div className="still-pair">
          <figure><figcaption><b className="is-unpriced">Unpriced</b>“I can't confirm its availability or final price. You could check a booking site.”</figcaption>{figure(2, { link: 0, lock: 0 }, false)}</figure>
          <figure><figcaption><b className="is-priced">Priced</b>“Available May 1–5. Final price {money(PROPERTY.total)}. Book direct on the property's website.”</figcaption>{figure(2, { link: 1, lock: 1 })}</figure>
        </div>}
        {i === 3 && <div className="still-site" role="img" aria-label={`The same stay on the property's website: ${PROPERTY.name}, ${PROPERTY.dates}, final price ${money(PROPERTY.total)}, continue to payment.`}>
          <div className="site-bar"><i/><i/><i/><span className="site-url">{PROPERTY.website}/the-pearl-of-jaffa</span><em>Illustrative</em></div>
          <div className="still-site-body">
            <img src={PROPERTY.photo} alt="" loading="lazy"/>
            <div><p className="section-kicker">Your stay</p><p className="still-site-name">{PROPERTY.name}</p><p className="still-site-dates">{PROPERTY.dates} · {PROPERTY.nights} nights</p><p className="still-site-total"><span>Final price</span><b>{money(PROPERTY.total)}</b></p><span className="still-site-pay">Continue to payment</span><small>Arrives in your PMS as a direct booking</small></div>
          </div>
        </div>}
      </div>
    </article>)}
  </section>;
}
