import { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { STAY, type Amenity, type ListingPhoto } from './stay';
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
    return <p className="eyebrow section-label"><span>{left}</span><span>/ {right.join(' / ')}</span></p>;
  }
  return <p className="eyebrow">{children}</p>;
}
function ComposerTools() {
  return <span className="composer-tools" aria-hidden="true"><span className="plus">+</span><span className="composer-right"><svg viewBox="0 0 24 24" fill="none"><rect x="9" y="3" width="6" height="12" rx="3" stroke="currentColor" strokeWidth="1.5"/><path d="M6 10v2a6 6 0 0 0 12 0v-2M12 18v3" stroke="currentColor" strokeWidth="1.5"/></svg><span className="send-arrow">↑</span></span></span>;
}

const chatRenderer = (root: HTMLElement) => {
  const q = (s: string) => root.querySelector<HTMLElement>(s);
  const frame = q('.chat-window'), halo = q('.chat-halo'), query = q('.query-morph'), welcome = q('.chat-welcome'), tools = q('.query-tools'), dock = q('.chat-dock'), search = q('.chat-search'), response = q('.chat-response');
  const chunks = [...root.querySelectorAll<HTMLElement>('.query-chunk')];
  const lines = [...root.querySelectorAll<HTMLElement>('.answer-beat')];
  const photos = [...root.querySelectorAll<HTMLElement>('.answer-options .option-photo')], clarification=q('.chat-clarification'), reply=q('.chat-details');
  const replyChunks=[...root.querySelectorAll<HTMLElement>('.reply-chunk')];
  const viewport = q('.conversation-viewport'), track = q('.conversation-track'), followUp = q('.chat-followup'), poolIntro = q('.pool-intro'), poolCard = q('.pool-card'), poolPhoto = q('.pool-card .option-photo');
  const poolBeats = [...root.querySelectorAll<HTMLElement>('.pool-beat')];
  const narrow = matchMedia('(max-width: 699px)');
  const stage = q('.scene-stage'), shutters = [...root.querySelectorAll<HTMLElement>('.portal-shutter')];
  const depth = [...root.querySelectorAll<HTMLElement>('.depth-frame')];
  return (progress: number) => {
    // The first half keeps the original pacing from the question to the two options.
    const p = Math.min(1, progress / .5);
    // When the transcript outgrows the window (phones), earlier messages scroll up.
    let lift = 0;
    if (progress > .5 && viewport && response) {
      const room = viewport.clientHeight - 12;
      const overflow = (el: HTMLElement | null) => el ? Math.max(0, response.offsetTop + el.offsetTop + el.offsetHeight - room) : 0;
      const first = overflow(followUp), last = overflow(poolCard);
      lift = first * phase(progress, .54, .57) + (last - first) * phase(progress, .60, .63);
    }
    styles(track, { transform: `translateY(${-lift}px)` });
    const request = phase(progress, .54, .57), offer = phase(progress, .60, .62);
    visible(followUp, request); styles(followUp, { transform: `translateY(${12*(1-request)}px)` });
    visible(poolIntro, offer); styles(poolIntro, { transform: `translateY(${12*(1-offer)}px)` });
    poolBeats.forEach((el,i)=>{const t=phase(progress,.61+i*.007,.625+i*.007);visible(el,t);styles(el,{transform:`translateY(${12*(1-t)}px)`});});
    styles(poolPhoto, { 'clip-path': `inset(${(1-phase(progress,.618,.655))*100}% 0 0 0 round 9px)` });
    const checkout = phase(progress,.826,.877);
    visible(q(".chat-checkout"),checkout);
    styles(q(".chat-checkout"),{transform:`translateX(${50*(1-checkout)}px) scale(${.96+.04*checkout})`});
    visible(q(".demo-cursor"),between(progress,.76,.775,.822,.833),false);
    styles(q(".demo-cursor"),{transform:`translate(${75*(1-phase(progress,.775,.812))}px,${-65*(1-phase(progress,.775,.812))}px) scale(${1-.18*between(progress,.812,.815,.819,.822)})`});
    styles(q(".pool-card .source-link"),{boxShadow:`0 0 0 ${8*between(progress,.812,.815,.822,.83)}px #863db329`});
    styles(q(".checkout-takeaway"),{'--takeaway':phase(progress,.892,.921)});
    const open = phase(p, .025, .17), send = phase(p, .29, .36), focus = 0;
    styles(stage, { '--portal-open': open });
    visible(frame, phase(p, .045, .13));
    visible(halo, phase(p, .045, .13), false);
    shutters.forEach((el,i) => styles(el, { transform: `translateX(${(i ? 1 : -1)*open*110}%) rotateY(${(i ? 1 : -1)*open*35}deg)`, opacity: 1-phase(p,.11,.19) }));
    depth.forEach((el,i) => styles(el,{ transform: `perspective(1600px) translateZ(${(i+1)*-45}px) rotateX(${(1-open)*36}deg) rotateZ(${(i-1)*3*(1-open)}deg) scale(${.78+open*.22+i*.035})`, opacity: (1-open)*.5 }));
    const portal = `perspective(1600px) translateY(${(1-open)*-90-7*focus}px) rotateX(${(1-open)*48}deg) rotateY(${(1-open)*-12}deg) rotateZ(${(1-open)*-5}deg) scale(${.70+.30*open+.012*focus})`;
    styles(frame, { transform: portal });
    styles(halo, { transform: portal });
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
    visible(response,phase(p,.79,.815));
    lines.forEach((el,i)=>{const t=phase(p,.79+i*.012,.823+i*.012);visible(el,t);styles(el,{transform:`translateY(${12*(1-t)}px)`});});
    photos.forEach((el,i)=>styles(el,{'clip-path':`inset(${(1-phase(p,.81+i*.05,.86+i*.05))*100}% 0 0 0 round 9px)`}));
    styles(q('.story-progress-fill'),{transform:`scaleX(${progress})`});
  };
};

function Chevron({ back = false }: { back?: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={back ? 'm14.5 6-6 6 6 6' : 'm9.5 6 6 6-6 6'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

function Expand() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14 4h6v6M10 20H4v-6M20 4l-6.5 6.5M4 20l6.5-6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

function Close() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
}

// Full-size photos of the booked apartment, opened from its checkout. A modal
// dialog in the top layer, so the scroll scene underneath is unaffected.
function PhotoGallery({ photos, start, title, onClose }: { photos: readonly ListingPhoto[]; start: number; title: string; onClose: (index: number) => void }) {
  const dialog = useRef<HTMLDialogElement>(null), track = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(start);
  const shown = useRef(start), heading = useRef<number | null>(null);
  const last = photos.length - 1;
  // Neighbouring photos slide; longer jumps (thumbnails, Home/End) cut directly.
  const go = (target: number, smooth = true) => {
    const next = Math.max(0, Math.min(last, target)), el = track.current;
    if (!el) return;
    const slide = smooth && Math.abs(next - shown.current) === 1;
    shown.current = next; setCurrent(next);
    heading.current = slide ? next : null;
    el.scrollTo({ left: next * el.clientWidth, behavior: slide ? 'smooth' : 'instant' });
  };
  useLayoutEffect(() => {
    const el = dialog.current;
    if (!el) return;
    el.showModal();
    go(start, false);
    // The page must not scroll behind the gallery: wheel and trackpad gestures
    // step through the photos instead, one step per gesture.
    let total = 0, lastEvent = 0, lastStep = 0;
    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      const now = performance.now();
      if (now - lastEvent > 180) total = 0;
      lastEvent = now;
      total += Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (Math.abs(total) < 40 || now - lastStep < 450) return;
      go(shown.current + Math.sign(total));
      total = 0; lastStep = now;
    };
    el.addEventListener('wheel', wheel, { passive: false });
    return () => el.removeEventListener('wheel', wheel);
    // Runs once: the opening position only; later navigation goes through go().
  }, []);
  const keys = (event: React.KeyboardEvent) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (step) go(shown.current + step);
    else if (event.key === 'Home') go(0);
    else if (event.key === 'End') go(last);
    else if (!['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown'].includes(event.key)) return;
    event.preventDefault();
  };
  const settle = () => {
    const el = track.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    // While a button-driven slide is under way, keep the counter on its destination.
    if (heading.current !== null) { if (index === heading.current && Math.abs(el.scrollLeft - index * el.clientWidth) < 2) heading.current = null; return; }
    if (index !== shown.current) { shown.current = index; setCurrent(index); }
  };
  return createPortal(<dialog ref={dialog} className="photo-gallery" aria-label={`Photos of ${title}`} onKeyDown={keys} onClose={() => onClose(shown.current)} onClick={event => { const target = event.target as HTMLElement; if (target === dialog.current || target.classList.contains('gallery-slide')) dialog.current?.close(); }}>
    <div className="gallery-top"><p className="gallery-title">{title}</p><span className="gallery-count" aria-live="polite">{current + 1} / {photos.length}</span><button type="button" className="gallery-close" aria-label="Close photos" onClick={() => dialog.current?.close()}><Close/></button></div>
    <div className="gallery-track" ref={track} onScroll={settle} onPointerDown={() => { heading.current = null; }}>
      {photos.map((item, i) => <figure className="gallery-slide" key={item.src} aria-hidden={i !== current}><img src={item.src} alt={item.alt} width={item.width} height={item.height} loading={Math.abs(i - start) <= 1 ? 'eager' : 'lazy'}/></figure>)}
    </div>
    <button type="button" className="gallery-nav gallery-previous" aria-label="Previous photo" disabled={current === 0} onClick={() => go(current - 1)}><Chevron back/></button>
    <button type="button" className="gallery-nav gallery-next" aria-label="Next photo" disabled={current === last} onClick={() => go(current + 1)}><Chevron/></button>
    <div className="gallery-thumbs">{photos.map((item, i) => <button type="button" key={item.src} aria-label={`Show photo ${i + 1} of ${photos.length}`} aria-current={i === current} onClick={() => go(i)}><img src={item.src} alt="" style={{ objectPosition: item.focus }} loading="lazy"/></button>)}</div>
  </dialog>, document.body);
}

const AMENITY_PATHS: Record<Amenity, string> = {
  pool: 'M8 3v11M16 3v11M8 7h8M8 11h8M3 18.5c1.5 0 1.5-1 3-1s1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1',
  beach: 'M12 4a8 8 0 0 1 8 7H4a8 8 0 0 1 8-7ZM12 11v7M3 20.5c1.5 0 1.5-1 3-1s1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1',
  parking: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18ZM10 17V7.5h3a3 3 0 0 1 0 6h-3',
  gym: 'M6.5 7v10M17.5 7v10M3.5 9.5v5M20.5 9.5v5M6.5 12h11',
  kitchen: 'M3 11h18M5 11v6a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-6M9 7.5h6M12 5v2.5',
  elevator: 'M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM9 10l3-3 3 3M9 14l3 3 3-3',
  balcony: 'M3 11h18M5 11v8.5M9.5 11v8.5M14.5 11v8.5M19 11v8.5M3 19.5h18M8 11V4.5h8V11',
  wifi: 'M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.8 15.8a4.8 4.8 0 0 1 6.4 0M12 19.2v.1',
  ac: 'M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9.5 4.5 12 7l2.5-2.5M9.5 19.5 12 17l2.5 2.5',
  children: 'M8 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM16.5 6a1.6 1.6 0 1 1 0 3.2 1.6 1.6 0 0 1 0-3.2ZM5.5 21v-5.5L4.5 10h7l-1 5.5V21M14.5 21v-4l-1-4.5h6l-1 4.5v4',
  coffee: 'M4 9h12v5.5A4.5 4.5 0 0 1 11.5 19h-3A4.5 4.5 0 0 1 4 14.5V9ZM16 10.5h1.5a2.5 2.5 0 0 1 0 5H16M8 3.5v3M12 3.5v3',
  cookware: 'M9 7a6 6 0 1 1 0 12A6 6 0 0 1 9 7ZM15 13h6.5',
  crib: 'M4 5v15M20 5v15M4 9.5h16M4 17h16M8 9.5V17M12 9.5V17M16 9.5V17',
  dishes: 'M7 3v18M4 3v5a3 3 0 0 0 6 0V3M17.5 21V3c-2 1-3.5 3-3.5 6.5V13h3.5',
  dishwasher: 'M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM4 8h16M8 12.5h8M8 16.5h8M7.5 5.5h.1M10.5 5.5h.1',
  dryer: 'M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM4 7.5h16M12 10a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM7.5 5.3h.1',
};

function AmenityIcon({ name }: { name: Amenity }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={AMENITY_PATHS[name]} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

// The complete listing text, opened from the short summary in the checkout.
function ListingDetails({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null), body = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = dialog.current;
    if (!el) return;
    el.showModal();
    // Only the text scrolls; the page behind the sheet stays where it is.
    const wheel = (event: WheelEvent) => { if (!(event.target as HTMLElement).closest('.details-body')) event.preventDefault(); };
    el.addEventListener('wheel', wheel, { passive: false });
    return () => el.removeEventListener('wheel', wheel);
  }, []);
  const keys = (event: React.KeyboardEvent) => {
    const page = (body.current?.clientHeight ?? 400) * .85;
    const delta = { ArrowDown: 60, ArrowUp: -60, PageDown: page, PageUp: -page, End: 1e5, Home: -1e5 }[event.key];
    if (delta === undefined) return;
    event.preventDefault();
    body.current?.scrollBy({ top: delta, behavior: Math.abs(delta) > 1e4 ? 'instant' : 'smooth' });
  };
  const listing = STAY.pool;
  return createPortal(<dialog ref={dialog} className="listing-details" aria-labelledby="listing-details-title" onKeyDown={keys} onClose={onClose} onClick={event => { if (event.target === dialog.current) dialog.current?.close(); }}>
    <div className="details-sheet">
      <header className="details-header"><div><small>About this apartment</small><h2 id="listing-details-title">{listing.property}</h2></div><button type="button" className="gallery-close details-close" aria-label="Close description" onClick={() => dialog.current?.close()}><Close/></button></header>
      <div className="details-body" ref={body}>
        <p className="details-summary">{listing.summary}</p>
        {listing.sections.map(section => <section key={section.title}><h3>{section.title}</h3>{section.paragraphs.map(text => <p key={text.slice(0, 24)}>{text}</p>)}</section>)}
        <section><h3>House rules</h3><ul>{listing.rules.map(rule => <li key={rule}>{rule}</li>)}</ul></section>
      </div>
    </div>
  </dialog>, document.body);
}

// The property's checkout responds to the visitor's clicks, never to scroll progress.
function CheckoutSummary() {
  const [index, setIndex] = useState(0);
  const [panel, setPanel] = useState<'description' | 'amenities' | null>(null);
  const [gallery, setGallery] = useState(false), [details, setDetails] = useState(false);
  const readMore = useRef<HTMLButtonElement>(null);
  const toggle = (name: 'description' | 'amenities') => setPanel(panel === name ? null : name);
  const listing = STAY.pool;
  const next = useRef<HTMLButtonElement>(null), previous = useRef<HTMLButtonElement>(null), opener = useRef<HTMLButtonElement>(null);
  const photos = STAY.pool.photos, last = photos.length - 1;
  const show = (target: number) => {
    setIndex(target);
    // Keep keyboard focus on a usable control when an edge button leaves or is disabled.
    if (target === 0) requestAnimationFrame(() => next.current?.focus());
    if (target === last) requestAnimationFrame(() => previous.current?.focus());
  };
  return <div className="checkout-summary">
    <div className="checkout-carousel">
      <button type="button" ref={opener} className="carousel-open" aria-label={`Open photo ${index + 1} of ${photos.length} full size`} onClick={() => setGallery(true)}>
        <img src={photos[index].src} alt={photos[index].alt} width={photos[index].width} height={photos[index].height} style={{ objectPosition: photos[index].focus }} loading="lazy"/>
        <span className="carousel-count" aria-hidden="true"><Expand/>{index + 1} / {photos.length}</span>
      </button>
      {index > 0 && <button type="button" ref={previous} className="carousel-button carousel-previous" aria-label="Previous photo" onClick={() => show(index - 1)}><Chevron back/></button>}
      <button type="button" ref={next} className="carousel-button carousel-next" aria-label="Next photo" disabled={index === last} onClick={() => show(index + 1)}><Chevron/></button>
    </div>
    {gallery && <PhotoGallery photos={photos} start={index} title={STAY.pool.property} onClose={shownLast => { setIndex(shownLast); setGallery(false); requestAnimationFrame(() => opener.current?.focus()); }}/>}
    <div className="checkout-toggles">
      <button type="button" className="description-toggle" aria-expanded={panel === 'description'} aria-controls="checkout-description" onClick={() => toggle('description')}>{panel === 'description' ? 'Hide description' : 'Show description'}<Chevron/></button>
      <button type="button" className="description-toggle amenities-toggle" aria-expanded={panel === 'amenities'} aria-controls="checkout-amenities" onClick={() => toggle('amenities')}>{panel === 'amenities' ? 'Hide amenities' : 'Show amenities'}<Chevron/></button>
    </div>
    <div className="checkout-description" id="checkout-description" data-open={panel === 'description'}><div><p>{listing.summary}</p><button type="button" ref={readMore} className="read-more" onClick={() => setDetails(true)}>Read the full description <Arrow/></button></div></div>
    <div className="checkout-description checkout-amenities" id="checkout-amenities" data-open={panel === 'amenities'}><div><ul aria-label="Amenities">{listing.amenities.map(([icon, label]) => <li key={icon} className={listing.highlights.includes(icon) ? 'is-highlight' : ''}><AmenityIcon name={icon}/>{label}</li>)}</ul></div></div>
    {details && <ListingDetails onClose={() => { setDetails(false); requestAnimationFrame(() => readMore.current?.focus()); }}/>}
    <h3>{listing.property}</h3><p>{STAY.dates} · {STAY.guests} · {STAY.nights}</p><div className="checkout-total"><span>Final total</span><strong>{listing.total}</strong></div>
  </div>;
}

function OptionCard({ property, total, photo, eager = false, className = '', beat = 'answer-beat', children }: { property: string; total: string; photo: ListingPhoto; eager?: boolean; className?: string; beat?: string; children?: React.ReactNode }) {
  return <article className={`option-card ${beat} ${className}`} data-animated>
    <div className="option-photo" data-animated><img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} style={{ objectPosition: photo.focus }} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'}/></div>
    <div className="option-body">
      <h3 className={beat} data-animated>{property}</h3>
      <p className={`option-meta ${beat}`} data-animated>{STAY.shortDates} · {STAY.guests} · {STAY.nights}</p>
      <div className={`option-total ${beat}`} data-animated><strong>{total} <span>final total</span></strong><span className="connected-badge">Connected to NEXA AI</span></div>
    </div>
    {children}
  </article>;
}

export function Conversation({ motion }: { motion: boolean }) {
  const ref = useRef<HTMLElement>(null);
  useScene(ref, motion, chatRenderer);
  // The halo sits behind the window (which clips its own content) and copies its box.
  useLayoutEffect(() => {
    const root = ref.current, frame = root?.querySelector<HTMLElement>('.chat-window');
    if (!root || !frame) return;
    const place = () => styles(root, { '--halo-left': `${frame.offsetLeft}px`, '--halo-top': `${frame.offsetTop}px`, '--halo-width': `${frame.offsetWidth}px`, '--halo-height': `${frame.offsetHeight}px` });
    place();
    const observer = new ResizeObserver(place);
    observer.observe(frame);
    if (frame.parentElement) observer.observe(frame.parentElement);
    void document.fonts.ready.then(place);
    return () => observer.disconnect();
  }, [motion]);
  return <section id="guest-story" className="conversation scene-section" ref={ref} aria-labelledby="guest-title">
    <div className="scene-stage wrap" data-animated>
      <div className="depth-frame" data-animated aria-hidden="true"/><div className="depth-frame" data-animated aria-hidden="true"/><div className="depth-frame" data-animated aria-hidden="true"/><div className="portal-clip" aria-hidden="true"><div className="portal-shutter shutter-left" data-animated><span>ASK.</span></div><div className="portal-shutter shutter-right" data-animated><span>ANSWER.</span></div></div><h2 className="sr-only" id="guest-title">A question becomes a bookable answer</h2><div className="scene-orbit" aria-hidden="true"/>
      <div className="chat-halo" data-animated aria-hidden="true"/>
      <div className="chat-window" data-animated>
        <div className="chat-rail" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.5"/><path d="M9 4v16" stroke="currentColor" strokeWidth="1.5"/></svg><svg viewBox="0 0 24 24" fill="none"><path d="M15 4H5v15h15V9M10 14 20 4l2 2-10 10-3 1 1-3Z" stroke="currentColor" strokeWidth="1.5"/></svg><svg viewBox="0 0 24 24" fill="none"><circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="1.5"/><path d="m15 15 5 5" stroke="currentColor" strokeWidth="1.5"/></svg></div>
        <div className="chat-app-header"><span>ChatGPT <span className="chevron">⌄</span></span><span className="chat-header-actions" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M12 15V3m-4 4 4-4 4 4M5 12v8h14v-8" stroke="currentColor" strokeWidth="1.5"/></svg><svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg></span></div>
        <p className="chat-welcome" data-animated>Where should we begin?</p>
        <div className="conversation-viewport"><div className="conversation-track" data-animated><div className="query-morph" data-animated><p>{STAY.queryChunks.map((text, i) => <span className="query-chunk" data-animated key={i}>{text}</span>)}</p><div className="query-tools" data-animated><ComposerTools /></div></div>
        <p className="chat-clarification" data-animated>{STAY.clarification}</p><div className="chat-details" data-animated>{STAY.replyChunks.map((text,i)=><span className="reply-chunk" data-animated key={i}>{text}</span>)}</div><div className="chat-search" data-animated><span aria-hidden="true">◎</span><div>Searching the web<small>Apartments near the sea in Tel Aviv</small></div></div>
        <div className="chat-response" data-animated>
          <p className="answer-beat" data-animated>{STAY.optionsIntro}</p>
          <div className="answer-options">
            <OptionCard property={STAY.property} total={STAY.total} photo={STAY.photo} eager/>
            <OptionCard property={STAY.second.property} total={STAY.second.total} photo={STAY.second.photo}/>
          </div>
          <div className="chat-followup" data-animated>{STAY.followUp}</div>
          <p className="pool-intro" data-animated>{STAY.poolIntro}</p>
          <OptionCard property={STAY.pool.property} total={STAY.pool.total} photo={STAY.pool.photo} beat="pool-beat" className="pool-card">
            <a className="pool-beat source-link" data-animated href="#how-it-works">Book direct <Arrow diagonal /><svg className="demo-cursor" data-animated aria-hidden="true" viewBox="0 0 28 36"><path d="M3 2v27l7-7 6 12 5-3-6-11h10Z" fill="#202123" stroke="white" strokeWidth="2"/></svg></a>
          </OptionCard>
        </div>
        </div></div><div className="chat-dock" data-animated aria-hidden="true"><span>Ask ChatGPT</span><ComposerTools /></div>
        <div className="chat-checkout" data-animated><div className="checkout-browser">The property's own website <span>Illustrative checkout</span></div><div className="checkout-brand"><img src="/seanrent/logo.svg" alt="Sea N’ Rent" width="140" height="30"/><span>Complete your stay</span></div><div className="checkout-grid"><CheckoutSummary/><div className="checkout-payment"><small>ONE LAST STEP</small><h3>Make it your stay.</h3><p>Your apartment and stay details are ready.<br/>Add your card to complete the booking.</p><div className="sample-card" aria-label="Illustrative payment fields, not editable"><span>Cardholder name</span><div>Name on card</div><span>Card number</span><div>1234 &nbsp; 1234 &nbsp; 1234 &nbsp; 1234</div><div className="sample-card-row"><div>MM / YY</div><div>CVC</div></div></div><button disabled className="sample-pay">Pay {STAY.pool.total} <Arrow/></button><p className="checkout-takeaway" data-animated>Your booking. Your website.</p><small className="checkout-note">Demo only. No card details collected or payment made.</small></div></div></div>
      </div>
      <div className="story-progress" aria-hidden="true"><i className="story-progress-fill" data-animated/></div><p className="scene-caption">Illustrative ChatGPT conversation. Dates, availability and checkout are examples.</p>
    </div>
  </section>;
}

const compareRenderer = (root: HTMLElement) => {
  const q=(selector:string)=>root.querySelector<HTMLElement>(selector);
  const rows=[...root.querySelectorAll<HTMLElement>('.comparison-row')];
  const story=[...root.querySelectorAll<HTMLElement>('.compare-story>p')];
  return (p:number)=>{
    const detour=between(p,.23,.28,.39,.43), connect=between(p,.44,.48,.53,.56);
    visible(q('.comparison-data'),1-between(p,.20,.23,.54,.57));
    visible(q('.ota-detour'),detour);styles(q('.ota-detour'),{transform:`translateY(${24*(1-detour)}px)`});
    visible(q('.nexa-intervention'),connect);styles(q('.nexa-intervention'),{transform:`scale(${.92+.08*connect})`});
    styles(q('.ota-route-line'),{transform:`scaleX(${phase(p,.28,.34)})`});
    rows.forEach((row,i)=>{
      const t=phase(p,.57+i*.105,.64+i*.105);
      styles(row,{'--row-ready':t,transform:`translateX(${-8*Math.sin(t*Math.PI)}px)`});
      const missing=row.querySelector<HTMLElement>('.row-missing'),ready=row.querySelector<HTMLElement>('.row-ready');
      visible(missing,1-phase(t,0,.45));visible(ready,phase(t,.50,1));
      styles(ready,{transform:`translateY(${8*(1-t)}px)`});
    });
    visible(q('.unpriced-word'),1-phase(p,.865,.89));
    visible(q('.priced-word'),phase(p,.90,.93));
    const amounts=[1-phase(p,.20,.23),between(p,.25,.28,.40,.43),between(p,.45,.48,.88,.91),phase(p,.93,.96)];
    story.forEach((el,i)=>{visible(el,amounts[i]);styles(el,{transform:`translateY(${8*(1-amounts[i])}px)`});});
    styles(q('.comparison-card'),{'--resolution':phase(p,.88,.96)});
  };
};

export function Comparison({ motion }: { motion: boolean }) {
  const ref=useRef<HTMLElement>(null);useScene(ref,motion,compareRenderer);
  return <><section className="comparison scene-section" id="priced" ref={ref} aria-labelledby="priced-title"><div className="scene-stage wrap">
    <Label>[01] THE TWO WORDS / PRICED OR UNPRICED</Label>
    <div className="comparison-copy"><h2 id="priced-title">Being mentioned by the AI is nice. <br/><em>Being bookable through the AI is where the money is.</em></h2><p className="comparison-lead">Two words decide who gets the booking:</p><div className="price-word-wrap"><span className="unpriced-word" data-animated>UNPRICED</span><span className="priced-word" data-animated>PRICED<span>↗</span></span></div><div className="compare-story"><p data-animated>The AI knows you exist.<br/><strong>But it cannot reliably answer for you.</strong></p><p data-animated>Without verified details, it shouldn't guess.<br/><strong>A bookable answer can send the guest to an OTA.</strong></p><p data-animated>With NEXA, the AI sees the details it needs.<br/><strong>Now your property can be recommended, priced and booked direct.</strong></p><p className="compare-closing" data-animated>You're not losing to better hotels.<br/><strong>You're losing to the OTAs.</strong></p></div></div>
    <div className="comparison-card" data-animated><div className="comparison-data" data-animated><div className="comparison-property"><span className="property-symbol" aria-hidden="true">N</span><div><small>SAME GUEST. SAME QUESTION.</small><h3>Your property. Two possible answers.</h3></div></div><div className="comparison-table">{[
      ['Live availability','Not available to the AI',`${STAY.dates} · ${STAY.guests}`],
      ['Final price','No verified total',`${STAY.total} · ${STAY.nights}`],
      ['Direct booking','No trusted booking route',"The property's own website"],
    ].map(([label,missing,ready],i)=><div className="comparison-row" key={label} data-animated><span className="row-index">0{i+1}</span><div><h4>{label}</h4><div className="comparison-values"><p className="row-missing" data-animated><span>−</span>{missing}</p><p className="row-ready" data-animated><span>✓</span>{ready}</p></div></div></div>)}</div><p className="comparison-note">Being listed is not the same as being bookable. Illustrative booking data.</p></div>
      <div className="ota-detour" data-animated><small>THE BOOKING TAKES ANOTHER ROUTE</small><div className="ota-route" aria-hidden="true"><span>Your property</span><i className="ota-route-line" data-animated/><span>OTA ↗</span></div><h3>The guest still needs<br/>a bookable answer.</h3><p>An OTA can supply the missing price and availability—and become the place the guest books.</p><div className="ota-answer"><span>ONLINE TRAVEL AGENCY</span><strong>A stay. A price. A booking route.</strong><small>The demand was there. The direct route wasn't.</small></div></div>
      <div className="nexa-intervention" data-animated><small>NOW, THE SAME PROPERTY WITH</small><img src="/nexa-white.png" alt="Nexa" width="170" height="38"/><h3>Give the answer<br/>what it's missing.</h3><p>One connection. Three essential details.</p></div>
    </div>
  </div></section><div className="comparison-explanation"><details className="wrap"><summary>Our whole company starts with one small sentence: <span>“ChatGPT can make mistakes.”</span><b aria-hidden="true">+</b></summary><div><p>A property mention is not a verified rate or an available room. That familiar disclaimer captures the trust problem: an AI answer should not invent the details a guest needs to book.</p><p>NEXA makes live availability, final prices, and a trusted direct booking route available to the assistant. The assistant can recommend the property; the guest completes booking and payment on the property's own website.</p></div></details></div></>;
}

const journeyRenderer = (root: HTMLElement) => {
  const nodes = new Map<string, HTMLElement | null>();
  const q = (s: string) => { if (!nodes.has(s)) nodes.set(s, root.querySelector<HTMLElement>(s)); return nodes.get(s)!; };
  const narrow = matchMedia('(max-width: 699px)');
  return (rawProgress: number) => {
    const progress=Math.max(0,(rawProgress-.13)/.87);
    const opening=phase(rawProgress,.13,.20);
    visible(q('.guest-question-opening'),1-phase(rawProgress,.13,.18));
    styles(q('.guest-question-opening'),{transform:`translate(${-18*opening}%,${8*opening}%) scale(${1-.36*opening})`});
    visible(q('.exchange-heading'),opening);
    visible(q('.exchange-network'),opening);
    const p=Math.max(0,Math.min(1,(progress-.40)/.60)), reveal=phase(progress,.40,.46);
    visible(q('.ai-exchange'),1-phase(progress,.38,.44));
    styles(q('.ai-exchange'),{'--request':phase(progress,.08,.19),'--response':phase(progress,.24,.35)});
    visible(q('.exchange-question'),phase(progress,.02,.07));
    visible(q('.exchange-ready'),phase(progress,.20,.22));
    root.querySelectorAll<HTMLElement>('.exchange-ready>span').forEach((el,i)=>{
      const t=phase(progress,.22+i*.035,.255+i*.035);
      visible(el,t);styles(el,{transform:`translateY(${24*(1-t)}px) scale(${.94+.06*t})`});
    });
    styles(q('.exchange-core-rings'),{transform:`rotate(${phase(progress,.10,.30)*90}deg) scale(${.85+.15*phase(progress,.10,.24)})`});
    root.querySelectorAll<HTMLElement>('.journey-chapters>span').forEach((el,i)=>{
      const bounds=[0,.21,.44,.65];
      styles(el,{'--active':i===0?1-phase(progress,.185,.21):i===3?phase(progress,.65,.68):between(progress,bounds[i],bounds[i]+.025,bounds[i+1]-.025,bounds[i+1])});
    });
    visible(q('.journey-line-request'),1-phase(progress,.20,.23));
    visible(q('.journey-line-response'),between(progress,.25,.28,.39,.42));
    styles(q('.website-ai'),{boxShadow:`0 0 ${55*phase(progress,.16,.24)}px #863db359`});
    visible(q('.handoff-photo'),reveal);

    const travel = phase(p, .30, .58), confirmation = phase(p, .79, .84), received = phase(p, .89, .94);
    styles(q('.system-flow'),{transform:'none'});
    styles(q('.journey-answer'),{transform:'none'});
    styles(q('.journey-lines'),{'--takeaway':phase(p,.92,.96)});
    styles(q('.site-ui'),{transform:`perspective(1600px) rotateY(${(1-travel)*22}deg) scale(${.88+.12*travel})`});
    visible(q('.system-flow'), reveal*(1 - phase(p, .3, .43)));
    visible(q('.journey-answer'), reveal*(1 - phase(p, .38, .46)));
    visible(q('.site-ui'), phase(p, .43, .49));
    styles(q('.site-ui'), { 'clip-path': 'inset(0 round 12px)' });
    visible(q('.site-booking'), phase(p, .59, .65));
    const m = narrow.matches;
    const canvas=q('.journey-canvas')!, card=q('.journey-answer')!, slot=q('.journey-photo-slot')!;
    const initial={left:card.offsetLeft+slot.offsetLeft,top:card.offsetTop+slot.offsetTop,width:slot.offsetWidth,height:slot.offsetHeight};
    const final={left:canvas.clientWidth*(m?0:.03),top:m?canvas.clientHeight*.23:Math.max(116,canvas.clientHeight*.26),width:canvas.clientWidth*(m?1:.52),height:m?canvas.clientHeight*.20:Math.min(canvas.clientHeight*.51,canvas.clientHeight-Math.max(116,canvas.clientHeight*.26)-95)};
    const geometry=Object.fromEntries(Object.keys(initial).map(key=>{const k=key as keyof typeof initial;return [key,`${initial[k]+(final[k]-initial[k])*travel}px`];}));
    styles(q('.handoff-photo'), {...geometry,'border-radius':`${10*(1-travel)}px`,transform:'none'});
    styles(q('.flow-facts'), { '--data-progress': phase(p, .06, .27) });
    visible(q('.booking-before'), 1 - phase(p,.75,.78));
    visible(q('.booking-confirmed'), confirmation);
    visible(q('.pms-receipt'), received);
    styles(q('.pms-receipt'), { transform: `translateY(${20 * (1 - received)}px)` });
    ['.journey-line-1', '.journey-line-2', '.journey-line-3'].forEach((s, i) => visible(q(s), i === 0 ? between(progress,.45,.48,.58,.60) : i === 1 ? between(p,.36,.40,.81,.85) : phase(p,.87,.91)));
  };
};

export function BookingJourney({ motion }: { motion: boolean }) {
  const ref = useRef<HTMLElement>(null); useScene(ref, motion, journeyRenderer);
  return <section className="booking-journey scene-section" id="how-it-works" ref={ref} aria-labelledby="works-title"><div className="scene-stage wrap">
    <Label>[02] HOW IT WORKS / THE FIX</Label><header className="scene-heading centered"><h2 id="works-title">NEXA AI makes your property PRICED.<br/><em>Here is how.</em></h2><p>From "find me a place" to a booking on your site. One conversation.</p></header>
    <div className="journey-chapters" aria-label="The four steps">{["The guest asks","NEXA answers","You are recommended","Booked direct"].map((text,i)=><span key={text} data-animated><b>0{i+1}</b>{text}<i/></span>)}</div><div className="journey-canvas">
      <div className="ai-exchange" data-animated><div className="guest-question-opening" data-animated><small>01 / THE GUEST ASKS</small><div className="opening-chat"><span>ChatGPT <b>⌄</b></span><p>Find me an apartment<br/><em>near the sea in Tel Aviv.</em></p><i aria-hidden="true">↑</i></div><p>The AI they already use.<br/><strong>Nothing to install. Just ask.</strong></p></div><div className="exchange-heading" data-animated><small>THE QUESTION REACHES YOUR WEBSITE</small><h3>One question.<br/><em>An AI-to-AI answer.</em></h3></div><div className="exchange-network" data-animated><div className="guest-ai"><span className="ai-orb">AI</span><h4>The guest's AI</h4><small>The assistant they already use</small><div className="exchange-question" data-animated>“Find me an apartment<br/>near the sea in Tel Aviv.”</div></div><div className="exchange-channel" aria-hidden="true"><span>REQUEST</span><div className="request-wire"><i/></div><div className="response-wire"><i/></div><span>VERIFIED DETAILS</span></div><div className="website-ai" data-animated><div className="exchange-core-rings" data-animated aria-hidden="true"><i/><i/></div><small>YOUR WEBSITE</small><img src="/nexa-white.png" alt="Nexa" width="150" height="34"/><h4>AI Connector</h4><span>Backed by your PMS data</span></div></div><div className="exchange-ready" data-animated><span data-animated><small>01 / LIVE AVAILABILITY</small><strong>{STAY.shortDates}</strong><em>{STAY.guests} · Available</em></span><span data-animated><small>02 / FINAL PRICE</small><strong>{STAY.total}</strong><em>{STAY.nights} · Final total</em></span><span data-animated><small>03 / DIRECT BOOKING</small><strong>Your website ↗</strong><em>Your booking. Your guest.</em></span><p>NEXA answers instantly. AI-to-AI.</p></div></div>
      <div className="system-flow" data-animated><div className="pms-source"><span className="system-icon" aria-hidden="true">▤</span><span>Your website<small>Backed by the NEXA AI Connector</small></span></div><div className="flow-thread" aria-hidden="true"/><div className="nexa-source"><img src="/nexa-white.png" alt="Nexa" width="110" height="24"/><small>AI CONNECTOR</small></div><div className="flow-facts" data-animated><span>Availability</span><span>Final price</span><span>Direct booking</span></div><p>AI-to-AI communication.<br/>The answer, ready instantly.</p></div>
      <div className="journey-answer" data-animated><small>IN THE GUEST'S AI ASSISTANT</small><h3>{STAY.property}</h3><div className="journey-photo-slot" aria-hidden="true"/><div className="journey-answer-bottom"><span>{STAY.dates} · {STAY.guests}</span><strong>{STAY.total}<small>final total</small></strong><small className="guarantee-note">Your best-price guarantee</small><span className="visual-link">Book direct <Arrow diagonal/></span></div></div>
      <div className="handoff-photo" data-animated><Photo /></div>
      <div className="site-ui" data-animated><div className="site-browser"><span aria-hidden="true">⌑</span> The property's own website <span>Illustrative website view</span></div><div className="site-brand"><img src="/seanrent/logo.svg" width="150" height="30" alt="Sea N' Rent"/><span>Home &nbsp; Search &nbsp; About us</span></div><h3 className="site-property-title">{STAY.property}</h3><div className="site-booking" data-animated><div className="booking-status"><div className="booking-before" data-animated><small>YOUR DIRECT BOOKING</small><h4>A sea view.<br/> A stay to look forward to.</h4></div><div className="booking-confirmed" data-animated><small>ILLUSTRATIVE CONFIRMATION</small><h4>Your stay is confirmed.</h4></div></div><dl><div><dt>Check-in</dt><dd>{STAY.arrival}</dd></div><div><dt>Check-out</dt><dd>{STAY.departure}</dd></div><div><dt>Guests</dt><dd>{STAY.guests}</dd></div><div><dt>Stay</dt><dd>{STAY.nights}</dd></div></dl><div className="site-total"><span>Sample final total</span><strong>{STAY.total}</strong></div><p>Booking and payment complete<br/>on the property's own website.</p></div></div>
      <div className="pms-receipt" data-animated><span className="receipt-icon" aria-hidden="true">↙</span><div><small>YOUR PMS</small><strong>Direct website booking received</strong><span>{STAY.dates} · {STAY.guests} · {STAY.total}</span></div></div>
    </div>
    <div className="journey-lines" data-animated><p className="journey-line-request" data-animated>The guest asks. Their AI turns to your website.</p><p className="journey-line-response" data-animated>NEXA answers instantly. AI-to-AI.</p><p className="journey-line-1" data-animated>The AI recommends your property, by name.</p><p className="journey-line-2" data-animated>The guest books on your site.</p><p className="journey-line-3" data-animated>The reservation reaches your PMS.</p></div>
    <p className="scene-caption">Illustrative journey. No reservation or payment is made. </p>
  </div></section>;
}
