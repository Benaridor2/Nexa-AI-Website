import { useEffect, useRef } from 'react';
import { LISTINGS } from '../v6/listings';
import { STAY } from '../v6/stay';

// The booking travels. When the conversation ends, the guest has a booking:
// the Coastal Panorama stay. As the conversation scrolls away, the stay card
// lifts out of the chat window, rides with the screen over the sections, over
// text and tiles, and when the property's own checkout comes up in the dark
// section it docks into it: the booking has landed on your website. Scrolling
// back lifts it again. Nothing to read: the picture tells it.
//
// The card is measured against the dock, so the two are the same size, and
// docking swaps the fixed card for the one inside the checkout at the same
// spot. Under reduced motion the checkout simply shows the stay.
const COASTAL = LISTINGS.coastal;

export function StayCard({ docked = false }: { docked?: boolean }) {
  return <div className={`stay${docked ? ' is-docked' : ''}`}>
    <img src={COASTAL.photos[0].src} alt="" width="1200" height="800" loading="lazy" style={{ objectPosition: COASTAL.photos[0].focus }}/>
    <div className="stay-body">
      <span className="stay-kicker">{docked ? 'Your stay' : 'Booked through ChatGPT'}</span>
      <b>{COASTAL.title}</b>
      <span className="stay-meta">{STAY.dates} · {STAY.nights} · {STAY.guests}</span>
      <span className="stay-price">{COASTAL.total} <small>final total</small></span>
    </div>
    <span className="stay-check" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="m5 12 5 5 9-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
  </div>;
}

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export function Rider() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    const chat = document.getElementById('guest-story');
    const dock = document.querySelector<HTMLElement>('.s8-dock');
    if (!el || !chat || !dock) return;
    let frame = 0, docked: boolean | null = null;
    const measure = () => {
      frame = 0;
      const vh = innerHeight, vw = innerWidth, phone = vw < 700;
      const c = chat.getBoundingClientRect();
      const win = (chat.querySelector('.chat-window') || chat).getBoundingClientRect();
      const d = dock.getBoundingClientRect();
      // The card is the dock's width while docking; a little narrower on the ride, on phones.
      const rideW = phone ? Math.min(d.width, 260) : d.width;
      // Lift: none while the conversation's end is still below the screen; complete after it has risen 40% of the screen.
      const lift = clamp((vh - c.bottom) / (vh * .4));
      const rideY = Math.round(vh * (phone ? .66 : .56));
      // Docking: as the checkout's slot approaches the ride line, the card moves over it; at the line it docks.
      const near = clamp((rideY + 240 - d.top) / 240);
      const isDocked = lift > 0 && d.top <= rideY;
      if (isDocked !== docked) { docked = isDocked; dock.classList.toggle('is-docked', isDocked); el.classList.toggle('is-docked', isDocked); }
      const w = mix(rideW, d.width, near);
      el.style.width = `${w}px`;
      const h = el.offsetHeight;
      const rideX = vw - w - Math.max(20, vw * .06);
      const fromX = Math.min(win.right - w - 28, rideX), fromY = win.bottom - h - 28;
      const e = ease(lift);
      const x = mix(mix(fromX, rideX, e), d.left, near), y = mix(fromY, rideY, e);
      const rot = -5 * e * (1 - near);
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg)`;
      el.style.opacity = String(clamp(lift * 4));
      el.style.visibility = lift > 0 && !isDocked ? 'visible' : 'hidden';
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const timer = window.setTimeout(schedule, 800);
    return () => { if (frame) cancelAnimationFrame(frame); window.clearTimeout(timer); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); };
  }, []);
  return <div className="rider" ref={ref} aria-hidden="true"><StayCard/></div>;
}
