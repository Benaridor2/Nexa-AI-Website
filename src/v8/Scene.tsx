import { useEffect, useRef } from 'react';
import { Arrow } from '../v6/Scenes';
import { LISTINGS } from '../v6/listings';
import { STAY } from '../v6/stay';
import { SectionLabel } from './Label';

// How it works, as a pinned scene. The stage stays on screen while the four
// steps pass (the way Attio, Stripe and Apple tell a product story): the
// guest asks, NEXA answers, the AI recommends, the guest books on your
// website. One object runs through it, the booking: it appears as the AI's
// answer and ends as the stay in the property's own checkout. The stage
// releases when the story is told. Nothing to read: the picture tells it.
//
// Progress is the section's own scroll; the stage is position: sticky. Under
// reduced motion the stage is not pinned and shows the ending.
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
const STEP_GLYPHS = [GLYPH.ask, GLYPH.answer, GLYPH.recommend, GLYPH.book];

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

const clamp = (v: number) => Math.min(1, Math.max(0, v));

export function HowItWorks({ watch, motion }: { watch: () => void; motion: boolean }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!motion) { el.dataset.step = '4'; el.style.setProperty('--p', '1'); return; }
    let frame = 0;
    const measure = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const pin = el.querySelector<HTMLElement>('.hiw-pin');
      const pinH = pin ? pin.offsetHeight : innerHeight;
      // Desktop: the story runs while the section scrolls through its pinned
      // height. Phones: the stage sticks on top and the steps pass under it.
      const phone = innerWidth < 700;
      const steps = el.querySelector<HTMLElement>('.hiw-steps')?.getBoundingClientRect();
      const stage = el.querySelector<HTMLElement>('.hiw-stage')?.getBoundingClientRect();
      // On a phone a step is current once it has come up under the stuck stage.
      const line = 64 + (stage ? stage.height : 0) + 64;
      const p = phone && steps ? clamp((line - steps.top) / steps.height) : clamp(-r.top / Math.max(1, r.height - pinH));
      const step = p < .22 ? 1 : p < .48 ? 2 : p < .74 ? 3 : 4;
      el.style.setProperty('--p', p.toFixed(4));
      if (el.dataset.step !== String(step)) el.dataset.step = String(step);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => { if (frame) cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); };
  }, [motion]);

  return <section className="s8-section s8-dark s8-scene" id="how-it-works" aria-labelledby="works-title" ref={ref} data-step="1">
    <div className="hiw-pin">
      <div className="wrap hiw-grid">
        <div className="hiw-story">
          <div className="hiw-head">
            <SectionLabel n="02" left="How it works" right="The fix"/>
            <h2 id="works-title" data-pass>NEXA AI makes your property <em>PRICED</em>. Here is how.</h2>
          </div>
          <div className="hiw-stage" aria-hidden="true">
            {/* The connection: the guest's AI, NEXA, your PMS. Lit from step 2. */}
            <div className="hiw-stage-flow"><span className="hiw-flow-node is-ai">Guest's AI</span><i className="hiw-flow-line"><b/></i><span className="hiw-flow-node is-nexa">NEXA</span><i className="hiw-flow-line is-second"><b/></i><span className="hiw-flow-node is-pms">Your PMS</span></div>
            {/* Steps 1 to 3: the conversation. */}
            <div className="hiw-stage-chat">
              <div className="hiw-stage-bar"><i/><span>ChatGPT</span></div>
              <div className="hiw-stage-body">
                <p className="hiw-stage-q">{STAY.question} {STAY.replyChunks.join('')}</p>
                <div className="hiw-stage-reply">
                  <span className="hiw-stage-who"><i/>ChatGPT</span>
                  <p className="hiw-stage-text is-answer">{COASTAL.title.replace(" by Sea N' Rent", '')} by Sea N' Rent is available for your dates. The final price, and a link to book direct on the property's website:</p>
                  <p className="hiw-stage-text is-recommend">I recommend Coastal Panorama by Sea N' Rent: available for your dates, a final price with a best-price guarantee, and you book direct on their website.</p>
                  <div className="hiw-stage-answer"><StayCard/><span className="hiw-stage-badge">Connected to NEXA AI</span><span className="hiw-stage-tag">Recommended</span></div>
                </div>
              </div>
            </div>
            {/* Step 4: the property's own checkout. */}
            <div className="hiw-stage-site">
              <div className="hiw-stage-bar is-site"><i/><i/><i/><span>seanrent.com · checkout</span><em>Illustrative</em></div>
              <div className="hiw-stage-body">
                <StayCard docked/>
                <p className="hiw-site-total"><span>Final price</span><b>{COASTAL.total}</b></p>
                <span className="hiw-site-pay">Pay {COASTAL.total} →</span>
                <p className="hiw-site-pms"><i/>Reservation received in your PMS · direct booking</p>
              </div>
            </div>
          </div>
          <ol className="hiw-steps" role="list">
            {STEPS.map((step, i) => <li key={step.n} role="listitem" data-index={i + 1}><span className="s8-glyph">{STEP_GLYPHS[i]}</span><div><b>{step.title}</b><p>{step.text}</p></div></li>)}
          </ol>
        </div>
        <div className="hiw-links"><a className="s8-button is-light" href="/how-it-works"><Arrow diagonal/>Watch now</a><button type="button" className="s8-link" onClick={watch}>Watch a booking happen, step by step <Arrow/></button></div>
      </div>
    </div>
    <div className="hiw-track" aria-hidden="true"/>
    <div className="wrap hiw-foot"><p className="s8-note">The guest installs nothing. No application needed. No plugin installed in the chat by the guest. The guest just asks, the AI simply answers.</p></div>
  </section>;
}
