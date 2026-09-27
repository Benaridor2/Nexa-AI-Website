import { Arrow } from '../v6/Scenes';
import { STAY } from '../v6/stay';
import { LISTINGS } from '../v6/listings';
import { HowItWorks } from './Scene';
import { SectionLabel } from './Label';

// Everything under the conversation, in the order and wording of the website
// plan (Content V3), in the language of the reference site: a numbered label
// with a baseline above every section, a large light heading beside its lead
// and one button, grey rounded cards, one dark section, small arrow buttons.
// Prices live on the Pricing page only.

export const PMS = ['Guesty', 'Hostaway', 'BoomNow', 'Hospitable', 'Rentals United', 'HotelSync'];
const AI_AGENTS = ['ChatGPT', 'Gemini', 'Claude', 'Perplexity'];

const FAQ: [string, string][] = [
  ['Why does the AI recommend my competitor and not me?', 'In most cases, because they are priced and you are not. Check it yourself with the next question.'],
  ['What does the AI say about your property right now?', 'Ask it. Open the AI you use, ask for your property by name with dates, and see if it gives you a final price and a direct way to book. If it does not, you are unpriced.'],
  ['Does the guest book inside the chat?', 'No. The AI answers with your availability and your final price, and sends the guest to your own payment page.'],
  ['Does the guest need to install anything?', 'No. No application, no plugin in the chat, no link to paste. They just ask the AI they already use.'],
  ['How do you connect to my system?', 'Through the PMS you already run, the same way you connected an OTA. No developer needed.'],
  ['What does it cost?', 'A commission on the bookings the AI brings you, and nothing else. It depends on whether the guest asked for you by name (NEXA Direct) or NEXA put you in the answer (NEXA Agent). The numbers are on the Pricing page. Cancel anytime.'],
  ['Do I have to leave my OTAs?', 'No. This sits next to your existing distribution and does not touch it.'],
  ['Who owns the guest data?', 'You do. Guest data belongs to the property, not to NEXA AI.'],
];

const COASTAL = LISTINGS.coastal;
const CHECK = <svg className="ck" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 5 5 9-10" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>;

// Small glyphs, so the steps read without their words.
const GLYPH = {
  ask: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4A2.5 2.5 0 0 1 4 13.5v-7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M8 9h8M8 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  answer: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  recommend: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m12 3 2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 16.9l-5.4 2.9 1.1-6.1L3.2 9.4l6.1-.8L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  book: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="m9 11 2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  plug: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0V8ZM12 17v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  system: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="4" width="18" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/><rect x="3" y="13" width="18" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/><circle cx="7" cy="7.5" r="1" fill="currentColor"/><circle cx="7" cy="16.5" r="1" fill="currentColor"/></svg>,
  spark: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m12 3 1.9 5.6L19.5 10.5l-5.6 1.9L12 18l-1.9-5.6L4.5 10.5l5.6-1.9L12 3Z" fill="currentColor"/><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" fill="currentColor"/></svg>,
  shield: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3 5 6v5c0 4.5 3 8.4 7 10 4-1.6 7-5.5 7-10V6l-7-3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};

// open: the Get Priced dialog. watch: brings the reader back to the conversation.
export function Sections({ open, watch, motion }: { open: () => void; watch: () => void; motion: boolean }) {
  return <>
    <section className="s8-connect wrap" aria-label="One connection">
      <div className="hub-panel" aria-hidden="true">
        <div className="hub-side is-pms"><span className="hub-chip">Your PMS</span><ul>{PMS.map(name => <li key={name}><i>{GLYPH.system}</i>{name}</li>)}</ul></div>
        <svg className="hub-wire" width="104" height="8" viewBox="0 0 104 8"><line className="hub-base" x1="0" y1="4" x2="104" y2="4"/><circle r="2"><animateMotion dur="4s" repeatCount="indefinite" path="M0,4 H104" calcMode="spline" keyTimes="0;1" keySplines=".4 0 .2 1"/><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.12;.88;1" dur="4s" repeatCount="indefinite"/></circle></svg>
        <div className="hub-mid"><span className="hub"><img src="/nexa-purple.png" alt="" width="1520" height="333"/></span><span className="hub-caption">One connection</span></div>
        <svg className="hub-wire is-out" width="104" height="8" viewBox="0 0 104 8"><line className="hub-base" x1="0" y1="4" x2="104" y2="4"/><circle r="2"><animateMotion dur="4s" begin="2s" repeatCount="indefinite" path="M0,4 H104" calcMode="spline" keyTimes="0;1" keySplines=".4 0 .2 1"/><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.12;.88;1" dur="4s" begin="2s" repeatCount="indefinite"/></circle></svg>
        <div className="hub-side is-ai"><span className="hub-chip">AI agents</span><ul>{AI_AGENTS.map(name => <li key={name}><i>{GLYPH.spark}</i>{name}</li>)}</ul></div>
      </div>
      <div className="connect-claims">
        <div><span className="s8-glyph">{GLYPH.plug}</span><h3>Connects through the PMS you already run.</h3><p>Exactly like connecting Airbnb or Booking.com. No developer. No code. Live in days.</p></div>
        <div><span className="s8-glyph">{GLYPH.shield}</span><h3>A direct booking, on paper as well.</h3><p>The guest books on your website, under your terms and your payment. NEXA AI is never a party to the reservation. Guest data belongs to you.</p><a className="s8-link" href="/nexa-ai-connector">How it works legally <Arrow/></a></div>
      </div>
    </section>

    <section className="s8-proof wrap" aria-label="Proof">
      <p>Global hospitality leaders voted. Over 65% chose NEXA AI.</p>
      <ul>
        <li className="is-gold"><b><svg className="gold-medal" viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="gold-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#e9cf7c"/><stop offset=".5" stopColor="#c19a35"/><stop offset="1" stopColor="#a67d24"/></linearGradient></defs><path d="M8 2h3l1.2 5-2.8 1L8 2Zm8 0h-3l-1.2 5 2.8 1L16 2Z" fill="url(#gold-g)"/><circle cx="12" cy="14.5" r="6.8" fill="url(#gold-g)"/><path d="m12 10.6 1.2 2.5 2.7.4-2 1.9.5 2.7-2.4-1.3-2.4 1.3.5-2.7-2-1.9 2.7-.4 1.2-2.5Z" fill="#fff8e1"/></svg>Winner</b><span>HVC Startup Competition by SHIC, Zurich 2026</span></li>
        <li><b>65%+</b><span>of the vote from global hospitality leaders</span></li>
        <li><b>37</b><span>countries, USA &amp; EMEA</span></li>
        <li><b>6</b><span>PMS integrations, live in days</span></li>
      </ul>
    </section>

    <section className="s8-section wrap" id="priced" aria-labelledby="priced-title">
      <SectionLabel n="01" left="The two words" right="Priced or unpriced"/>
      <div className="s8-head">
        <h2 id="priced-title" data-pass>Being mentioned by the AI is nice. <em>Being bookable through the AI</em> is where the money is.</h2>
        <div><p className="s8-lead">The same apartment, the same dates, the same guest asking. Two words decide which answer the AI can give:</p></div>
      </div>
      <div className="compare" aria-label="The same apartment, priced and unpriced">
        <div className="compare-col is-priced">
          <header className="compare-head"><span className="compare-eyebrow"><i/>01 / Priced</span><h3>Priced.</h3></header>
          <figure className="compare-photo"><img src="/seanrent/tel-aviv/med/1.jpg" alt="" loading="lazy" width="1080" height="721"/><figcaption><i/>Priced through NEXA</figcaption></figure>
          <p className="compare-say"><span className="answer-who"><i/>ChatGPT</span>“Available for your dates. Here is the final price and the direct link:”</p>
          <dl className="compare-rows">
            <div><dt>Availability</dt><dd>{CHECK}Available, {STAY.shortDates}</dd></div>
            <div><dt>Final price</dt><dd className="is-price">$328 <small>final total</small></dd></div>
            <div><dt>Where the guest books</dt><dd>{CHECK}seanrent.com, direct</dd></div>
          </dl>
          <div className="compare-act"><span className="s8-button"><Arrow diagonal/>Book direct on seanrent.com</span></div>
          <p className="compare-foot">The AI can answer for you. The booking is yours.</p>
        </div>
        <div className="compare-col is-unpriced">
          <header className="compare-head"><span className="compare-eyebrow"><i/>02 / Unpriced</span><h3>Unpriced.</h3></header>
          <figure className="compare-photo is-dim"><img src="/seanrent/tel-aviv/med/1.jpg" alt="" loading="lazy" width="1080" height="721"/><figcaption><i/>Not connected</figcaption></figure>
          <p className="compare-say"><span className="answer-who"><i/>ChatGPT</span>“I can't confirm availability or the final price for these dates.”</p>
          <dl className="compare-rows">
            <div><dt>Availability</dt><dd><span className="dash">—</span></dd></div>
            <div><dt>Final price</dt><dd className="is-price"><span className="dash">—</span></dd></div>
            <div><dt>Where the guest books</dt><dd className="is-otas"><small>Sent to</small>Booking.com · Airbnb · Expedia</dd></div>
          </dl>
          <div className="compare-act"><span className="compare-empty" aria-label="Nothing to book here">—</span></div>
          <p className="compare-foot">The AI cannot answer for you. The guest goes to an OTA.</p>
        </div>
      </div>
      <p className="s8-statement" data-pass>You're not losing to better hotels. <em>You're losing to the OTAs.</em></p>
      <div className="s8-expand">
        <p>Our whole company is based on one small sentence at the bottom of every AI chat: <q>ChatGPT can make mistakes.</q> That sentence is why the AI cannot answer for you.</p>
        <a className="s8-button is-outline" href="/about"><Arrow diagonal/>Read the story</a>
      </div>
    </section>

    <HowItWorks watch={watch} motion={motion}/>

    <section className="s8-section wrap" id="connector" aria-labelledby="product-title">
      <SectionLabel n="03" left="The product" right="NEXA AI Connector"/>
      <div className="s8-head">
        <h2 id="product-title" data-pass>One connection. Two kinds of guests. <em>Both book direct.</em></h2>
        <div><p className="s8-lead">The NEXA AI Connector plugs your PMS into the AI agents once. Every guest the AI then sends you is one of two kinds, and each kind has its own rate.</p><a className="s8-button" href="/nexa-ai-connector"><Arrow diagonal/>Show me</a></div>
      </div>
      <div className="kinds">
        <article className="kind is-direct">
          <span className="s8-n">NEXA Direct · branded</span>
          <h3>The guest asked for you by name.</h3>
          <div className="kind-flow" aria-hidden="true">
            <span className="kind-ask">“a room at <mark>Sea N' Rent</mark>”</span>
            <i className="kind-arrow"/>
            <span className="kind-node is-ai"><b>AI</b><small>+ NEXA</small></span>
            <i className="kind-arrow"/>
            <span className="kind-node is-site"><b>Your website</b><small>seanrent.com</small></span>
            <span className="kind-detour"><i/>Not the OTA listing of your own property</span>
          </div>
          <p>Today that guest often ends up on an OTA listing of your own property, and you pay commission on your own name. NEXA Direct takes them straight to your website instead.</p>
          <ul className="kind-facts"><li>{CHECK}Your name, your booking</li><li>{CHECK}The lower rate</li></ul>
        </article>
        <article className="kind is-agent">
          <span className="s8-n">NEXA Agent · non-branded</span>
          <h3>The AI found you a guest.</h3>
          <div className="kind-flow" aria-hidden="true">
            <span className="kind-ask">“an apartment <mark>near the sea in Tel Aviv</mark>”</span>
            <i className="kind-arrow"/>
            <span className="kind-node is-ai"><b>AI</b><small>+ NEXA</small></span>
            <i className="kind-arrow"/>
            <span className="kind-node is-site"><b>Your website</b><small>seanrent.com</small></span>
            <span className="kind-picks"><span>The AI picks from what is priced:</span><b className="is-in">You · priced</b><b className="is-out">Others · unpriced</b></span>
          </div>
          <p>Today that answer belongs to the OTAs. NEXA Agent gives the AI your best-price guarantee, your live availability and a final price it can trust, so it can put you in the answer.</p>
          <ul className="kind-facts"><li>{CHECK}A guest you would not have had</li><li>{CHECK}The higher rate</li></ul>
        </article>
      </div>
      <div className="kinds-both"><p>Both book on your website, straight into your PMS. Only the rate differs.</p><a className="s8-link" href="/pricing">The two rates are on the Pricing page <Arrow/></a></div>
    </section>

    <section className="s8-section wrap" id="economics" aria-labelledby="pricing-title">
      <SectionLabel n="04" left="Pricing" right="The money"/>
      <div className="s8-head">
        <h2 id="pricing-title" data-pass>Same guest. Same room. <em>Very different commission.</em></h2>
        <div><p className="s8-lead">The same 4-night stay, booked through an OTA, through NEXA Direct, through NEXA Agent. Watch where the money goes.</p><div className="s8-actions"><a className="s8-button" href="/pricing"><Arrow diagonal/>Pricing</a><a className="s8-link" href="/pricing#find-your-rate">Run your own numbers <Arrow/></a></div></div>
      </div>
      <div className="s8-tile s8-money">
        <div className="s8-receipt" aria-label="The same stay, three ways to book it">
          <div className="s8-receipt-stay"><span className="s8-n">The same stay</span><b>{COASTAL.title} · {STAY.nights} · {STAY.guests}</b><span className="s8-receipt-total"><span>Final total</span><b>{COASTAL.total}</b></span></div>
          <div className="money">
            <p className="money-legend"><i/>Stays with you<i className="is-fee"/>Commission</p>
            <ul className="money-rows" data-line aria-label="Where the money goes, three ways to book">
              <li className="is-ota" style={{ '--w': .18 } as React.CSSProperties}><span className="money-name">Booked through an OTA</span><span className="money-note">to the OTA</span><span className="money-bar"><i/></span></li>
              <li className="is-direct" style={{ '--w': .04 } as React.CSSProperties}><span className="money-name">NEXA Direct, the guest asked for you</span><span className="money-note">to NEXA</span><span className="money-bar"><i/></span></li>
              <li className="is-agent" style={{ '--w': .08 } as React.CSSProperties}><span className="money-name">NEXA Agent, the AI found you the guest</span><span className="money-note">to NEXA</span><span className="money-bar"><i/></span></li>
            </ul>
            <a className="s8-link" href="/pricing">The numbers are on the Pricing page <Arrow/></a>
          </div>
        </div>
      </div>
    </section>

    <section className="s8-section wrap" id="for-you" aria-labelledby="audience-title">
      <SectionLabel n="05" left="Who it is for" right="Hotels and vacation rentals"/>
      <h2 id="audience-title" className="sr-only">Who NEXA is for</h2>
      <div className="s8-cards s8-two s8-photos">
        <a className="s8-card is-photo" href="/nexa-ai-connector"><img src="/v7/hotel.webp" alt="A hotel roof terrace" loading="lazy" width="1400" height="933"/><div><span className="s8-n">Hotels</span><h3>I run a hotel.</h3><p>Defend your loyalty program, fill the gaps, shrink the OTA bill.</p><span className="s8-link">NEXA for hotels <Arrow/></span></div></a>
        <a className="s8-card is-photo" href="/nexa-ai-connector"><img src="/v7/rental.webp" alt="An apartment living room in Jaffa" loading="lazy" width="1400" height="933"/><div><span className="s8-n">Vacation rentals</span><h3>I run vacation rentals.</h3><p>Defend your brand, from one unit to a 10,000-unit portfolio, every unit priced and recommended.</p><span className="s8-link">NEXA for vacation rentals <Arrow/></span></div></a>
      </div>
    </section>

    <section className="s8-section wrap" id="faq" aria-labelledby="faq-title">
      <SectionLabel n="06" left="FAQ" right="Straight answers"/>
      <div className="s8-faq-grid">
        <h2 id="faq-title" data-pass>Straight <em>answers.</em></h2>
        <div className="s8-faq">
          {FAQ.map(([q, a], i) => <details key={q} open={i === 0}><summary><span className="s8-n">{String(i + 1).padStart(2, '0')}</span>{q}<i aria-hidden="true"/></summary><p>{a}</p></details>)}
        </div>
      </div>
    </section>

    <section className="s8-section wrap" id="get-priced" aria-labelledby="closing-title">
      <div className="s8-closing">
        <p className="s8-label is-center">/ Get priced</p>
        <h2 id="closing-title" data-pass>Get <em>PRICED</em> before your competitor does.</h2>
        <p className="s8-closing-lead">Two short steps. Cancel anytime.</p>
        <button type="button" className="s8-button is-light" onClick={() => open()}><Arrow diagonal/>Get Priced</button>
        <p className="s8-closing-line">Want to talk first? <a href="/contact">Leave your details on the Contact page.</a></p>
      </div>
    </section>
  </>;
}
