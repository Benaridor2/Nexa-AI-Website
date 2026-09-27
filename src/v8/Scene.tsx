import { useEffect, useRef } from 'react';
import { Arrow } from '../v6/Scenes';
import { LISTINGS } from '../v6/listings';
import { STAY } from '../v6/stay';
import { SectionLabel } from './Label';
import { useTraveler } from './Traveler';

// How it works, told with one stage that travels and lands. The four steps
// scroll past on the left; the stage on the right stays on screen while they
// do, and shows each step as it happens: the guest types, NEXA and the AI talk
// to each other, the AI recommends the property in the chat, the guest books
// on the property's website. When the steps are done the stage stops beside
// the last block, "Booked", and the page goes on. On phones the stage sticks
// on top and the steps pass under it.
const COASTAL = LISTINGS.coastal;

export const STEPS: { n: string; title: string; text: string }[] = [
  { n: '01', title: 'The guest asks.', text: 'The AI turns to your website, which is backed by the NEXA AI Connector.' },
  { n: '02', title: 'NEXA AI answers.', text: 'Instantly, in AI-to-AI communication: live availability, the final price, the direct route.' },
  { n: '03', title: 'The AI recommends you.', text: 'By name, with your final price and your best-price guarantee.' },
  { n: '04', title: 'The guest books with you.', text: 'Straight into your PMS, like any direct booking.' },
];

const GLYPH = {
  ask: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4A2.5 2.5 0 0 1 4 13.5v-7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M8 9h8M8 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  answer: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  recommend: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m12 3 2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 16.9l-5.4 2.9 1.1-6.1L3.2 9.4l6.1-.8L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  book: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="m9 11 2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};
// The AI and NEXA, talking: what the guest never sees.
const WIRE: [string, string][] = [
  ['ChatGPT → NEXA', 'Availability, May 1-5, 2 adults?'],
  ['NEXA → ChatGPT', 'Available: Coastal Panorama Apartment.'],
  ['ChatGPT → NEXA', 'Final price?'],
  ['NEXA → ChatGPT', '$740 total. Best-price guarantee.'],
  ['ChatGPT → NEXA', 'Where does the guest book?'],
  ['NEXA → ChatGPT', 'seanrent.com/checkout, direct.'],
];

export function StayCard({ docked = false }: { docked?: boolean }) {
  return <div className={`stay${docked ? ' is-docked' : ''}`}>
    <img src={COASTAL.photos[0].src} alt="" width="1200" height="800" loading="lazy" style={{ objectPosition: COASTAL.photos[0].focus }}/>
    <div className="stay-body">
      <span className="stay-kicker">{docked ? 'Your stay' : 'Available for your dates'}</span>
      <b>{COASTAL.title}</b>
      <span className="stay-meta">{STAY.dates} · {STAY.nights} · {STAY.guests}</span>
      <span className="stay-price">{COASTAL.total} <small>final total</small></span>
    </div>
    <span className="stay-check" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="m5 12 5 5 9-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
  </div>;
}

export function HowItWorks({ watch, motion }: { watch: () => void; motion: boolean }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!motion) { el.dataset.step = '5'; return; }
    let frame = 0;
    const blocks = [...el.querySelectorAll<HTMLElement>('.hiw-step, .hiw-landing')];
    const measure = () => {
      frame = 0;
      const phone = innerWidth < 700;
      const stage = el.querySelector<HTMLElement>('.hiw-stage');
      // The current step is the last block that has come up to the line: mid-screen on a desktop, under the stuck stage on a phone.
      const line = phone && stage ? 64 + stage.offsetHeight + 72 : innerHeight * .55;
      let step = 1;
      blocks.forEach((b, i) => { if (b.getBoundingClientRect().top <= line) step = i + 1; });
      if (el.dataset.step !== String(step)) el.dataset.step = String(step);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => { if (frame) cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); };
  }, [motion]);

  const seed = useTraveler(motion);
  return <section className="s8-section s8-dark hiw" id="how-it-works" aria-labelledby="works-title" ref={ref} data-step="1">
    <div className="wrap hiw-head">
      <SectionLabel n="02" left="How it works" right="The fix"/>
      <h2 id="works-title" data-pass>NEXA AI makes your property <em>PRICED</em>. Here is how.</h2>
      <span className="hiw-seed" ref={seed} aria-hidden="true"><img src="/nexa-purple.png" alt="" width="1520" height="333"/></span>
    </div>
    <div className="wrap hiw-body">
      <div className="hiw-stage" aria-hidden="true">
        <div className="hiw-flow"><span className="hiw-node is-ai">Guest's AI</span><i className="hiw-line"><b/></i><span className="hiw-node is-nexa"><i className="hiw-mark"><img src="/nexa-white.png" alt="" width="760" height="166"/></i>NEXA</span><i className="hiw-line is-second"><b/></i><span className="hiw-node is-pms">Your PMS</span></div>
        {/* Steps 1 to 3: the conversation. */}
        <div className="hiw-chat">
          <div className="hiw-bar"><i/><span>ChatGPT</span></div>
          <div className="hiw-chat-body">
            <div className="hiw-typing"><i/><i/><i/></div>
            <p className="hiw-q">{STAY.question} {STAY.replyChunks.join('')}</p>
            <div className="hiw-reply">
              <span className="hiw-who"><i/>ChatGPT</span>
              <p className="hiw-thinking">Checking live availability with the property…</p>
              <p className="hiw-text is-answer">{COASTAL.title} is available for your dates, with the final price and a direct link to book on the property's website:</p>
              <p className="hiw-text is-recommend">I recommend <b>Coastal Panorama Apartment by Sea N' Rent</b>: available for your dates, a final price with a best-price guarantee, and you book direct on their website.</p>
              <div className="hiw-answer"><StayCard/><span className="hiw-badge">Connected to NEXA AI</span><span className="hiw-tag">Recommended</span></div>
              <p className="hiw-q is-second">Book it.</p>
              <p className="hiw-text is-link"><span className="hiw-who"><i/>ChatGPT</span>Here is the direct link to book on their website: <a>seanrent.com/checkout ↗</a></p>
            </div>
          </div>
          <div className="hiw-composer"><span>Message ChatGPT</span><i/></div>
          {/* Step 2: the AI and NEXA, talking. */}
          <div className="hiw-wire">
            <p className="hiw-wire-title">AI-to-AI, in real time</p>
            {WIRE.map(([who, what], i) => <p key={i} className={`hiw-wire-line${who.startsWith('NEXA') ? ' is-nexa' : ''}`} style={{ '--i': i } as React.CSSProperties}><span>{who}</span>{what}</p>)}
          </div>
        </div>
        {/* Steps 4 and 5: the property's own checkout, and the booking. */}
        <div className="hiw-site">
          <div className="hiw-bar is-site"><i/><i/><i/><span>seanrent.com · checkout</span><em>Illustrative</em></div>
          <div className="hiw-site-body">
            <StayCard docked/>
            <p className="hiw-total"><span>Final price</span><b>{COASTAL.total}</b></p>
            <span className="hiw-pay"><span className="is-idle">Pay {COASTAL.total} →</span><span className="is-paid">Paid · booking confirmed</span></span>
            <div className="hiw-pms-ticket"><span className="hiw-pms-head"><i/>Your PMS · new reservation</span><b>{COASTAL.title.replace(" by Sea N' Rent", '')}</b><span>{STAY.dates} · {STAY.guests} · {COASTAL.total} · Source: your website</span></div>
            <span className="hiw-cursor" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M5 3l14 8-6 2-3 6-5-16Z" fill="#fff" stroke="#0d0d17" strokeWidth="1.5" strokeLinejoin="round"/></svg></span>
          </div>
        </div>
      </div>
      <div className="hiw-steps">
        {STEPS.map((step, i) => <div className="hiw-step" data-index={i + 1} key={step.n}><span className="hiw-n">{step.n}</span><h3>{step.title}</h3><p>{step.text}</p></div>)}
        <div className="hiw-landing" data-index="5">
          <span className="hiw-n">Booked</span>
          <h3>On your website. In your PMS.</h3>
          <p>The guest installs nothing. No application needed. No plugin installed in the chat by the guest. The guest just asks, the AI simply answers.</p>
          <div className="hiw-links"><a className="s8-button is-light" href="/how-it-works"><Arrow diagonal/>How it works</a><button type="button" className="s8-link" onClick={watch}>Watch a booking happen, step by step <Arrow/></button></div>
        </div>
      </div>
    </div>
  </section>;
}
