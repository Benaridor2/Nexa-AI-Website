import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SlotName, createSpatialScene } from './spatialScene';

gsap.registerPlugin(ScrollTrigger);

const STAY = {
  name: 'Example Oceanfront Hotel', location: 'Miami Beach', arrival: 'May 1, 2027', departure: 'May 5, 2027',
  dates: 'May 1 - 5, 2027', guests: '2 guests', nights: '4 nights', total: '$1,240',
  question: 'Find me an oceanfront stay in Miami Beach. May 1 - 5, 2027, for two guests.',
};
const CUES = [.2, .43, .65, .98];
const CHAPTERS = ['The answer', 'The data', 'PRICED', 'Your website'];
const DURATION = 16;
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const smooth = (a: number, b: number, n: number) => { const t = clamp((n - a) / (b - a)); return t * t * (3 - 2 * t); };
const windowOpacity = (a: number, b: number, c: number, d: number, n: number) => smooth(a, b, n) * (1 - smooth(c, d, n));
const stepAt = (p: number) => p < .29 ? 0 : p < .55 ? 1 : p < .8 ? 2 : 3;
type Scene = ReturnType<typeof createSpatialScene>;
type Frame = { step: number; hero: boolean; available: boolean; priced: boolean; bookable: boolean; arrival: boolean; source: boolean };

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M4 12h15m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function PlayIcon({ paused = false }: { paused?: boolean }) {
  return <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">{paused ? <path d="M7 5v10M13 5v10" stroke="currentColor" strokeWidth="2" /> : <path d="m7 4 9 6-9 6V4Z" fill="currentColor" />}</svg>;
}
function Logo({ dark = false }: { dark?: boolean }) {
  return <img className="nexa-logo" src={dark ? '/nexa.png' : '/nexa-white.png'} width="128" height="28" alt="Nexa" />;
}
function Photo({ className = '', eager = false }: { className?: string; eager?: boolean }) {
  return <img className={className} src="/hotel.webp" width="1440" height="960" alt="The sunlit oceanfront terrace of the illustrative hotel" loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'} />;
}

export default function CinematicApp() {
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [mobile, setMobile] = useState(() => innerWidth < 700);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(() => new URLSearchParams(location.search).get('view') === 'static');
  const [playing, setPlaying] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [frame, setFrame] = useState<Frame>({ step: 0, hero: true, available: false, priced: false, bookable: false, arrival: false, source: false });
  const story = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const destinationAction = useRef<HTMLButtonElement>(null);
  const scene = useRef<Scene | null>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const seekTween = useRef<gsap.core.Tween | null>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const clock = useRef({ p: 0 });
  const frameKey = useRef('');
  const owner = useRef<'scroll' | 'control'>('scroll');
  const isPlaying = useRef(false);
  const playbackMeter = useRef({ last: 0, samples: [] as number[] });
  const currentReduced = useRef(reduced);
  const currentMobile = useRef(mobile);
  const expectedScroll = useRef<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const staticMode = reduced || failed;

  const slots = useMemo(() => Object.fromEntries((['answerHeader', 'availability', 'price', 'destination', 'source'] as SlotName[]).map(name => {
    const element = document.createElement('div');
    element.className = `spatial-slot slot-${name}`;
    element.dataset.slot = name;
    return [name, element];
  })) as Record<SlotName, HTMLDivElement>, []);

  const update = useCallback(() => {
    const p = clock.current.p;
    const el = stage.current;
    if (!el) return;
    if (isPlaying.current) {
      const now = performance.now();
      if (playbackMeter.current.last) playbackMeter.current.samples.push(now - playbackMeter.current.last);
      playbackMeter.current.last = now;
    }
    scene.current?.render(p);
    if (p >= .62 && p <= .72 && destinationAction.current) {
      // An untransformed DOM hit target avoids CSS3D's focus/scrollIntoView behavior.
      const surface = slots.destination.getBoundingClientRect();
      const container = el.getBoundingClientRect();
      Object.assign(destinationAction.current.style, { left: `${surface.left - container.left}px`, top: `${surface.top - container.top}px`, width: `${surface.width}px`, height: `${Math.max(44, surface.height)}px` });
    }
    el.style.setProperty('--progress', String(p));
    el.style.setProperty('--hero-opacity', String(1 - smooth(.025, .135, p)));
    el.style.setProperty('--hero-offset', `${-60 * smooth(.025, .135, p)}px`);
    el.style.setProperty('--answer-opacity', String(windowOpacity(.12, .17, .265, .31, p)));
    el.style.setProperty('--open-opacity', String(windowOpacity(.29, .35, .51, .565, p)));
    el.style.setProperty('--priced-opacity', String(windowOpacity(.54, .60, .72, .795, p)));
    el.style.setProperty('--canvas-opacity', String(1 - smooth(.875, .9, p)));
    el.style.setProperty('--arrival-opacity', String(smooth(.875, .9, p)));
    el.style.setProperty('--arrival-ui', String(smooth(.905, .965, p)));
    el.style.setProperty('--arrival-offset', `${28 * (1 - smooth(.905, .965, p))}px`);
    el.style.setProperty('--controls-ink', p > .9 ? '#31382f' : '#e8e2f0');
    const next: Frame = { step: stepAt(p), hero: p < .12, available: p >= .475, priced: p >= .535, bookable: p >= .62 && p <= .72, arrival: p >= .935, source: p >= .32 && p <= .56 };
    const key = JSON.stringify(next);
    if (key !== frameKey.current) { frameKey.current = key; setFrame(next); }
    if (owner.current === 'control' && trigger.current && !currentMobile.current && !currentReduced.current) {
      const y = trigger.current.start + p * (trigger.current.end - trigger.current.start);
      expectedScroll.current = y;
      window.scrollTo({ top: y, behavior: 'instant' });
    }
  }, [slots]);

  useLayoutEffect(() => {
    const tl = gsap.timeline({ paused: true, onUpdate: update, onComplete: () => {
      isPlaying.current = false; setPlaying(false);
      const samples = playbackMeter.current.samples.slice().sort((a, b) => a - b);
      if (stage.current && samples.length) {
        stage.current.dataset.playbackFrames = String(samples.length);
        stage.current.dataset.playbackP95Ms = samples[Math.floor(samples.length * .95)].toFixed(1);
        stage.current.dataset.playbackLongFrames = String(samples.filter(ms => ms > 34).length);
      }
    } });
    tl.to(clock.current, { p: 1, duration: DURATION, ease: 'none' });
    timeline.current = tl;
    update();
    return () => { seekTween.current?.kill(); tl.kill(); };
  }, [update]);

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const onMotion = () => setReduced(media.matches);
    const onSize = () => setMobile(innerWidth < 700);
    media.addEventListener('change', onMotion);
    window.addEventListener('resize', onSize);
    return () => { media.removeEventListener('change', onMotion); window.removeEventListener('resize', onSize); };
  }, []);

  useEffect(() => {
    currentReduced.current = reduced;
    currentMobile.current = mobile;
    seekTween.current?.kill();
    timeline.current?.pause();
    isPlaying.current = false; setPlaying(false);
    if (staticMode) {
      clock.current.p = frame.hero ? 0 : CUES[frame.step];
      timeline.current?.time(clock.current.p * DURATION, false);
      update();
    }
  }, [reduced, mobile, staticMode, update]);

  useEffect(() => {
    if (staticMode || !host.current) { setReady(false); return; }
    let cancelled = false;
    let created: Scene | null = null;
    void import('./spatialScene').then(({ createSpatialScene }) => {
      if (cancelled || !host.current) return;
      try {
        created = createSpatialScene({ host: host.current, slots, onReady: () => { if (!cancelled) { setReady(true); update(); } }, onError: () => { if (!cancelled) { setFailed(true); setReady(false); } } });
        scene.current = created;
        created.render(clock.current.p);
      } catch { setFailed(true); setReady(false); }
    }).catch(() => { if (!cancelled) { setFailed(true); setReady(false); } });
    const resize = () => { created?.resize(); update(); };
    window.addEventListener('resize', resize);
    return () => { cancelled = true; window.removeEventListener('resize', resize); created?.dispose(); scene.current = null; setReady(false); };
  }, [slots, staticMode, update]);

  useEffect(() => {
    if (mobile || staticMode || !story.current) return;
    const st = ScrollTrigger.create({
      trigger: story.current, start: 'top top', end: 'bottom bottom', invalidateOnRefresh: true,
      onUpdate: self => {
        if (owner.current === 'control') {
          // Native input transfers ownership below. Focus/scrollIntoView must not
          // advance the story while the user is activating an in-scene control.
          if (expectedScroll.current !== null && Math.abs(window.scrollY - expectedScroll.current) > 1) window.scrollTo({ top: expectedScroll.current, behavior: 'instant' });
          return;
        }
        timeline.current?.time(self.progress * DURATION, false);
        if (self.progress < .88) setConfirmed(false);
      },
    });
    trigger.current = st;
    const interrupt = (event: Event) => {
      if (event instanceof KeyboardEvent) {
        if (!['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) return;
        if (event.target instanceof Element && (event.target.closest('dialog') || (event.key === ' ' && event.target.closest('button')) || (['Home', 'End'].includes(event.key) && event.target.closest('.dock-steps')))) return;
      }
      seekTween.current?.kill(); timeline.current?.pause(); owner.current = 'scroll'; isPlaying.current = false; setPlaying(false); expectedScroll.current = null;
    };
    window.addEventListener('wheel', interrupt, { passive: true });
    window.addEventListener('touchstart', interrupt, { passive: true });
    window.addEventListener('keydown', interrupt);
    const scrollbar = (event: PointerEvent) => { if (event.clientX >= document.documentElement.clientWidth - 20) interrupt(event); };
    const focusOutside = (event: FocusEvent) => { if (event.target instanceof Node && !stage.current?.contains(event.target)) interrupt(event); };
    window.addEventListener('pointerdown', scrollbar, true);
    window.addEventListener('focusin', focusOutside);
    ScrollTrigger.refresh();
    return () => { st.kill(); trigger.current = null; window.removeEventListener('wheel', interrupt); window.removeEventListener('touchstart', interrupt); window.removeEventListener('keydown', interrupt); window.removeEventListener('pointerdown', scrollbar, true); window.removeEventListener('focusin', focusOutside); };
  }, [mobile, staticMode]);

  useEffect(() => {
    const pause = () => { if (document.hidden) { seekTween.current?.kill(); timeline.current?.pause(); isPlaying.current = false; setPlaying(false); } };
    document.addEventListener('visibilitychange', pause);
    return () => document.removeEventListener('visibilitychange', pause);
  }, []);

  useEffect(() => {
    const visible = !frame.hero && !frame.arrival;
    for (const [name, element] of Object.entries(slots)) {
      const shown = name === 'source' ? frame.source : name === 'destination' ? false : visible;
      element.inert = !shown;
      element.setAttribute('aria-hidden', String(!shown));
      element.style.pointerEvents = shown && name === 'destination' ? 'auto' : 'none';
    }
  }, [frame, slots]);

  const seek = (p: number, focus = false) => {
    seekTween.current?.kill(); timeline.current?.pause();
    owner.current = 'control'; expectedScroll.current = window.scrollY;
    isPlaying.current = false; setPlaying(false); setConfirmed(false);
    const bounds = stage.current?.getBoundingClientRect();
    if ((mobile || staticMode) && bounds && (bounds.bottom < 100 || bounds.top > innerHeight - 100)) stage.current?.scrollIntoView({ behavior: 'instant', block: 'start' });
    if (staticMode) timeline.current?.time(p * DURATION, false);
    else seekTween.current = timeline.current?.tweenTo(p * DURATION, { duration: Math.max(.7, Math.min(2.2, Math.abs(p - clock.current.p) * 4)), ease: 'power2.inOut', onComplete: () => { seekTween.current = null; } }) ?? null;
    if (focus) document.getElementById(`scene-step-${stepAt(p)}`)?.focus({ preventScroll: true });
  };
  const play = (restart = false) => {
    if (restart && (mobile || staticMode)) stage.current?.scrollIntoView({ behavior: 'instant', block: 'start' });
    if (staticMode) { seek(restart || clock.current.p >= .975 ? CUES[0] : CUES[frame.hero ? 0 : Math.min(3, frame.step + 1)]); return; }
    if (isPlaying.current && !restart) { timeline.current?.pause(); isPlaying.current = false; setPlaying(false); return; }
    seekTween.current?.kill(); owner.current = 'control'; expectedScroll.current = window.scrollY;
    setConfirmed(false);
    const bounds = stage.current?.getBoundingClientRect();
    if (mobile && bounds && (bounds.bottom < 100 || bounds.top > innerHeight - 100)) stage.current?.scrollIntoView({ behavior: 'instant', block: 'start' });
    if (restart || clock.current.p >= .975) timeline.current?.time(0, false);
    playbackMeter.current = { last: 0, samples: [] };
    timeline.current?.timeScale(mobile ? 1.2 : 1).play(); isPlaying.current = true; setPlaying(true);
  };
  const openDialog = () => { seekTween.current?.kill(); timeline.current?.pause(); isPlaying.current = false; setPlaying(false); lastFocus.current = document.activeElement as HTMLElement; dialog.current?.showModal(); };
  const chapterSelected = frame.hero ? -1 : frame.step;

  return <div className={`nexa-v2 ${reduced ? 'reduced' : ''}`}>
    <a className="skip-link" href="#closing" onClick={() => { seekTween.current?.kill(); timeline.current?.pause(); owner.current = 'scroll'; isPlaying.current = false; setPlaying(false); }}>Skip the visual journey</a>
    <section className={`cinematic-story ${mobile || staticMode ? 'unpinned' : ''}`} ref={story} aria-label="From an AI answer to a direct booking">
      <div className={`cinematic-stage chapter-${frame.step} ${frame.hero ? 'at-hero' : ''} ${frame.arrival ? 'at-property' : ''} ${staticMode ? 'static-mode' : ''} ${ready ? 'scene-ready' : ''} ${confirmed ? 'is-confirmed' : ''}`} ref={stage}>
        <div className="scene-host" ref={host} aria-label="Spatial explanation of the booking data" aria-hidden={!ready || frame.arrival} inert={!ready || frame.arrival} />
        <button className="destination-action" ref={destinationAction} aria-label="Book direct" aria-description="Continue on the property's own website" aria-hidden={!ready || !frame.bookable} inert={!ready || !frame.bookable} disabled={!ready || !frame.bookable} style={{ visibility: ready && frame.bookable ? 'visible' : 'hidden' }} onClick={() => seek(.98, true)} />
        <div className={`static-scene ${ready ? 'is-hidden' : ''}`} aria-hidden={ready || frame.arrival} inert={ready || frame.arrival}>
          {frame.hero ? <Photo className="static-hero-photo" eager /> : <div className={`static-answer static-step-${frame.step}`}>
            {frame.step === 1 && <div className="static-source"><Logo /><p>Live booking data from your PMS</p></div>}
            <div className="static-answer-header"><span>EXAMPLE IN AN AI ASSISTANT</span><h3>{STAY.name}</h3></div>
            <Photo eager />
            <div className="static-fields"><div><span>Availability</span><strong>{frame.available ? STAY.dates : 'Not available in this answer'}</strong><small>{STAY.nights} · {STAY.guests}</small></div><div><span>Final price</span><strong>{frame.priced ? STAY.total : 'Unknown'}</strong><small>For the entire stay</small></div></div>
            <button disabled={!frame.bookable} onClick={() => seek(.98, true)}>{frame.bookable ? "Book direct on the property's website" : 'Direct booking link unavailable'}<Arrow diagonal /></button>
          </div>}
        </div>
        <div className="opening-shade" />
        <header className="cinematic-header" aria-hidden={frame.arrival} inert={frame.arrival}><a href="/" aria-label="Nexa home"><Logo /></a><span className="header-line">THE NEXT CHAPTER OF DIRECT BOOKING</span><div><a className="version-link" href="/v1">V1 ↗</a><button className="outline-button" onClick={openDialog}>Get Priced <Arrow diagonal /></button></div></header>
        <div className="hero-editorial" aria-hidden={!frame.hero} inert={!frame.hero}>
          <span className="eyebrow">THE AI CONNECTOR FOR HOTELS & VACATION RENTALS</span>
          <h1><span>Your next guest is</span><span>asking an AI.</span><em>Be the answer.</em></h1>
          <div className="hero-bottom-copy"><p>Connect your live availability and final prices to AI assistants. Let guests book on your own website.</p><div className="hero-actions"><button className="primary-button" onClick={openDialog}>Get Priced <Arrow diagonal /></button><button className="watch-button" onClick={() => { play(true); document.getElementById('scene-play')?.focus({ preventScroll: true }); }}><span><PlayIcon /></span>Watch a booking happen</button></div></div>
          <div className="hero-photo-caption"><span>MIAMI BEACH / AN ILLUSTRATIVE STAY</span><span>One photograph.<br />{' '}<em>A whole new way in.</em></span></div>
        </div>
        <div className="chapter-editorial chapter-answer" aria-hidden={frame.hero || frame.step !== 0} inert={frame.hero || frame.step !== 0}><span className="eyebrow">01 / THE REVEAL</span><h2>A place they know.<br />{' '}<em>A missing next step.</em></h2><blockquote>“{STAY.question}”</blockquote><span className="status-label unpriced">UNPRICED</span><p>The property is known. Requested availability and a final price are still missing.</p></div>
        <div className="chapter-editorial chapter-open" aria-hidden={frame.step !== 1} inert={frame.step !== 1}><span className="eyebrow">02 / BEHIND THE ANSWER</span><h2>Open up<br />{' '}<em>the possibility.</em></h2><p>NEXA brings your live booking data into the AI assistant your guest already uses.</p><p className="editorial-aside">From your PMS.<br /> No installation or activation for the guest.</p></div>
        <div className="chapter-editorial chapter-priced" aria-hidden={frame.step !== 2} inert={frame.step !== 2}><span className="eyebrow">03 / THE ALIGNMENT</span><h2>Now, an answer.<br />{' '}<em>With a next step.</em></h2><span className="status-label priced">PRICED</span><p>Live availability. A final price.<br />A direct route to your property.</p><button className="text-button" onClick={() => seek(.98, true)} disabled={!frame.bookable}>Follow the booking <Arrow diagonal /></button></div>
        <section className="property-arrival" aria-label="Illustrative property booking website" aria-hidden={!frame.arrival} inert={!frame.arrival}>
          <Photo className="arrival-photo" eager />
          <div className="arrival-wash" />
          <div className="property-topbar"><div className="property-identity"><span>eo.</span><div>{STAY.name}<small>MIAMI BEACH</small></div></div><div className="property-domain"><span aria-hidden="true">↗</span> example-oceanfront.test / {confirmed ? 'confirmation' : 'book'}</div></div>
          <div className="property-location"><span>OCEANFRONT. ALL YOURS TO DISCOVER.</span><h2>Stay a little<br />{' '}<em>closer to the ocean.</em></h2></div>
          <div className="property-reservation"><span className="eyebrow">{confirmed ? 'CONFIRMED ON THE PROPERTY WEBSITE' : 'YOUR DIRECT BOOKING'}</span><h2>{confirmed ? <>See you<br />{' '}<em>by the ocean.</em></> : <>A place to<br />{' '}<em>look forward to.</em></>}</h2>
            {confirmed && <p className="confirmation-message" role="status"><span aria-hidden="true">✓</span> Illustrative confirmation. No reservation or payment has been made.</p>}
            <dl><div><dt>Check-in</dt><dd>{STAY.arrival}</dd></div><div><dt>Check-out</dt><dd>{STAY.departure}</dd></div><div><dt>Guests</dt><dd>{STAY.guests}</dd></div><div><dt>Your stay</dt><dd>{STAY.nights}</dd></div></dl><div className="reservation-total"><span>Final total<small>For the entire stay</small></span><strong>{STAY.total}</strong></div>
            {!confirmed ? <><p className="booking-location-note">Your dates and guests are prefilled. Booking and payment complete on this property website.</p><button className="property-button" onClick={() => { setConfirmed(true); timeline.current?.pause(); setPlaying(false); isPlaying.current = false; }}>Preview confirmation <Arrow /></button></> : <><div className="pms-receipt"><span>DIRECT WEBSITE BOOKING</span><p>Received in the property's PMS <span aria-hidden="true">✓</span></p></div><button className="property-button" onClick={() => seek(.2, true)}>Explore the journey again <span aria-hidden="true">↺</span></button></>}
          </div>
        </section>
        <div className="scene-disclosure" aria-hidden={frame.hero || frame.arrival}>Illustrative journey · Fictional property</div>
        <div className="scene-controls">
          <div className={`state-comparison ${frame.hero || frame.arrival ? 'visually-inactive' : ''}`} role="group" aria-label="Compare booking data states" aria-hidden={frame.hero || frame.arrival} inert={frame.hero || frame.arrival}><button aria-pressed={!frame.priced} onClick={() => seek(.2)}>UNPRICED</button><span>/</span><button aria-pressed={frame.priced} onClick={() => seek(.65)}>PRICED</button></div>
          <div className="journey-dock"><button className="dock-play" id="scene-play" aria-label={staticMode ? 'Next scene' : playing ? 'Pause the journey' : clock.current.p > .97 ? 'Replay the journey' : 'Play the journey'} onClick={() => play()}><PlayIcon paused={playing} /><span>{staticMode ? 'Next' : playing ? 'Pause' : clock.current.p > .97 ? 'Replay' : 'Play'}</span></button><div className="dock-steps" role="group" aria-label="Journey chapters" onKeyDown={event => {
            if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
            event.preventDefault(); const current = Number((event.target as HTMLElement).closest('button')?.dataset.index ?? 0); const next = event.key === 'Home' ? 0 : event.key === 'End' ? 3 : (current + (event.key === 'ArrowRight' ? 1 : 3)) % 4; seek(CUES[next]); document.getElementById(`scene-step-${next}`)?.focus({ preventScroll: true });
          }}>{CHAPTERS.map((name, i) => <button key={name} data-index={i} id={`scene-step-${i}`} aria-pressed={chapterSelected === i} onClick={() => seek(CUES[i])}><span>0{i + 1}</span>{name}</button>)}</div><button className="dock-replay" aria-label="Restart the entire journey" onClick={() => play(true)}>↺</button><div className="dock-progress" aria-hidden="true" /></div>
          <span className="scroll-direction">{staticMode ? 'SELECT A CHAPTER TO EXPLORE' : mobile ? 'SELECT A CHAPTER OR PLAY THE JOURNEY' : 'SCROLL TO EXPLORE'} <span aria-hidden="true">↓</span></span>
        </div>
      </div>
    </section>
    <section className="cinematic-closing" id="closing"><span className="eyebrow">THE DESTINATION WAS ALWAYS YOURS.</span><h2>The guest starts in AI.<br />{' '}<em>The relationship starts with you.</em></h2><div><p>The AI connector for hotels and vacation rentals.</p><button className="primary-button" onClick={openDialog}>Get Priced <Arrow diagonal /></button></div></section>
    <footer className="cinematic-footer"><Logo /><span>© 2026 NEXA</span><div><a href="/v1">Compare with V1 <Arrow diagonal /></a><button aria-pressed={reduced} onClick={() => setReduced(!reduced)}>Motion: {reduced ? 'reduced' : 'full'}</button></div></footer>
    <dialog ref={dialog} className="get-priced-dialog" aria-labelledby="get-priced-title" onClose={() => lastFocus.current?.focus()} onClick={e => { if (e.target === e.currentTarget) dialog.current?.close(); }} onKeyDown={event => {
      if (event.key !== 'Tab') return; const buttons = dialog.current?.querySelectorAll<HTMLButtonElement>('button'); if (!buttons?.length) return;
      if (event.shiftKey && document.activeElement === buttons[0]) { event.preventDefault(); buttons[buttons.length - 1].focus(); }
      else if (!event.shiftKey && document.activeElement === buttons[buttons.length - 1]) { event.preventDefault(); buttons[0].focus(); }
    }}><button className="dialog-close" aria-label="Close next-step preview" onClick={() => dialog.current?.close()}>×</button><span className="eyebrow">GET PRICED / A LOOK AHEAD</span><h2 id="get-priced-title">Your property.<br />{' '}<em>In the conversation.</em></h2><p>The next step is to explore your property's PMS connection and direct booking website with NEXA.</p><ol><li><span>Your property</span><small>Hotels and vacation rentals</small></li><li><span>Your PMS</span><small>The source of live booking data</small></li><li><span>Your booking website</span><small>Where your guest completes their booking</small></li></ol><p className="dialog-note">Prototype preview. Nothing is collected or submitted.</p><button className="primary-button" onClick={() => { lastFocus.current = null; dialog.current?.close(); play(true); document.getElementById('scene-play')?.focus({ preventScroll: true }); }}>Explore the guest journey <Arrow /></button></dialog>
    {createPortal(<div className="slot-header-inner"><span>EXAMPLE IN AN AI ASSISTANT</span><h3>{STAY.name}</h3><small>{STAY.location} · Oceanfront</small></div>, slots.answerHeader)}
    {createPortal(<div className={`slot-field-inner ${frame.available ? 'is-resolved' : ''}`}><span>AVAILABILITY</span><strong>{frame.available ? STAY.dates : 'Not available'}</strong><small>{STAY.nights} · {STAY.guests}</small></div>, slots.availability)}
    {createPortal(<div className={`slot-field-inner ${frame.priced ? 'is-resolved' : ''}`}><span>FINAL PRICE</span><strong className={frame.priced ? 'slot-price' : ''}>{frame.priced ? STAY.total : 'Unknown'}</strong><small>For the entire stay</small></div>, slots.price)}
    {createPortal(<div className="slot-destination-inner"><div className={`destination-label ${frame.bookable ? 'is-bookable' : ''}`}><span>{frame.bookable ? 'Book direct' : 'Direct booking link unavailable'}</span><Arrow diagonal /></div><small>{frame.bookable ? "Continue on the property's own website" : 'A mention without a next step'}</small></div>, slots.destination)}
    {createPortal(<div className="slot-source-inner"><Logo /><span>Live data from your PMS</span></div>, slots.source)}
  </div>;
}
