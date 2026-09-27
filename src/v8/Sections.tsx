import { Arrow } from '../v6/Scenes';
import { STAY } from '../v6/stay';
import { LISTINGS } from '../v6/listings';
import { HowItWorks } from './Scene';
import { SectionLabel } from './Label';
import { useTraveler } from './Traveler';

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

// The guest's question, as the conversation above asked it. It sits above the two answers in [01] and, with motion, flies to the How-it-works stage.
const ASKED = `${STAY.question} ${STAY.replyChunks.join('')}`;

const COASTAL = LISTINGS.coastal;

// Small glyphs, so the steps read without their words.
const GLYPH = {
  ask: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4A2.5 2.5 0 0 1 4 13.5v-7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M8 9h8M8 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  answer: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  recommend: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m12 3 2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 16.9l-5.4 2.9 1.1-6.1L3.2 9.4l6.1-.8L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  book: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="m9 11 2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  plug: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0V8ZM12 17v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  shield: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3 5 6v5c0 4.5 3 8.4 7 10 4-1.6 7-5.5 7-10V6l-7-3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};

// open: the Get Priced dialog. watch: brings the reader back to the conversation.
export function Sections({ open, watch, motion }: { open: () => void; watch: () => void; motion: boolean }) {
  const fly = useTraveler(motion);
  return <>
    <p className="s8-ask is-flying" ref={fly} aria-hidden="true" data-ask="home">“{ASKED}”</p>
    <section className="s8-connect wrap" aria-label="One connection">
      <div className="connect-panel" aria-hidden="true">
        <div className="connect-col is-pms"><span className="connect-title">Your PMS</span>{PMS.map(name => <span className="connect-chip" key={name}>{name}</span>)}</div>
        <svg className="connect-wire" viewBox="0 0 100 100" preserveAspectRatio="none">
          {[0, 1, 2].map(i => <path key={i} id={`cw-l${i}`} d={`M0,${24 + i * 26} C55,${24 + i * 26} 45,50 100,50`}/>)}
          {[0, 1, 2].map(i => <circle key={i} r="1.6"><animateMotion dur="2.4s" begin={`${i * .8}s`} repeatCount="indefinite"><mpath href={`#cw-l${i}`}/></animateMotion></circle>)}
        </svg>
        <div className="connect-node"><b>NEXA</b><span>one connection</span></div>
        <svg className="connect-wire is-right" viewBox="0 0 100 100" preserveAspectRatio="none">
          {[0, 1].map(i => <path key={i} id={`cw-r${i}`} d={`M0,50 C55,50 45,${36 + i * 28} 100,${36 + i * 28}`}/>)}
          {[0, 1].map(i => <circle key={i} r="1.6"><animateMotion dur="2.4s" begin={`${.5 + i * 1.2}s`} repeatCount="indefinite"><mpath href={`#cw-r${i}`}/></animateMotion></circle>)}
        </svg>
        <div className="connect-col is-ai"><span className="connect-title">AI agents</span>{AI_AGENTS.map(name => <span className="connect-chip" key={name}>{name}</span>)}</div>
      </div>
      <div className="connect-claims">
        <div><span className="s8-glyph">{GLYPH.plug}</span><h3>Connects through the PMS you already run.</h3><p>Exactly like connecting Airbnb or Booking.com. No developer. No code. Live in hours.</p></div>
        <div><span className="s8-glyph">{GLYPH.shield}</span><h3>A direct booking, on paper as well.</h3><p>The guest books on your website, under your terms and your payment. NEXA AI is never a party to the reservation. Guest data belongs to you.</p><a className="s8-link" href="/nexa-ai-connector">How it works legally <Arrow/></a></div>
      </div>
    </section>

    <section className="s8-proof wrap" aria-label="Proof">
      <p>Global hospitality leaders voted. Over 65% chose NEXA AI.</p>
      <ul>
        <li className="is-gold"><b><svg className="gold-medal" viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="gold-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f6dd8f"/><stop offset=".45" stopColor="#c9962a"/><stop offset=".7" stopColor="#f0d27a"/><stop offset="1" stopColor="#a6761c"/></linearGradient></defs><path d="M7.5 1.5h3.2l1.3 5.2-3 1.1-1.5-6.3Zm9 0h-3.2L12 6.7l3 1.1 1.5-6.3Z" fill="url(#gold-g)"/><circle cx="12" cy="14.5" r="7.2" fill="url(#gold-g)"/><circle cx="12" cy="14.5" r="5.6" fill="none" stroke="#fff5d6" strokeOpacity=".7" strokeWidth=".8"/><path d="m12 10.2 1.3 2.7 3 .4-2.2 2.1.5 3-2.6-1.4-2.6 1.4.5-3-2.2-2.1 3-.4 1.3-2.7Z" fill="#fff8e1"/></svg>Winner</b><span>HVC Startup Competition by SHIC, Zurich 2026</span></li>
        <li><b>65%+</b><span>of the vote from global hospitality leaders</span></li>
        <li><b>37</b><span>countries, USA &amp; EMEA</span></li>
        <li><b>6</b><span>PMS integrations, live in days</span></li>
      </ul>
    </section>

    <section className="s8-section wrap" id="priced" aria-labelledby="priced-title">
      <SectionLabel n="01" left="The two words" right="Priced or unpriced"/>
      <div className="s8-head">
        <h2 id="priced-title" data-pass>Being mentioned by the AI is nice. <em>Being bookable through the AI</em> is where the money is.</h2>
        <div><p className="s8-lead">One guest, one question. Two words decide which answer they get:</p></div>
      </div>
      <div className="s8-ask-slot" data-ask="home"><p className="s8-ask">“{ASKED}”</p></div>
      <div className="verdicts">
        <article className="verdict is-priced">
          <header className="verdict-head"><span className="verdict-mark"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 5 5 9-10" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg></span><div><span>The first word</span><h3>Priced.</h3></div></header>
          <ul className="verdict-list"><li>Live availability</li><li>Final price</li><li>Book direct on your website</li></ul>
          <div className="verdict-answer" aria-label="The AI's answer when you are priced">
            <span className="answer-who"><i/>ChatGPT</span>
            <p>Mediterranean Sea Views by Sea N' Rent is available for your dates, $328 final total. You can book it direct on the property's website:</p>
            <div className="answer-card"><img src="/seanrent/tel-aviv/med/1.jpg" alt="" loading="lazy" width="1080" height="721"/><div><b>Mediterranean Sea Views · 1BR</b><span className="answer-meta">{STAY.shortDates} · Available</span><span className="answer-price">$328 <small>final total</small></span><span className="answer-link">Book direct ↗</span></div></div>
          </div>
          <p className="verdict-foot">The AI can answer for you. The booking is yours.</p>
        </article>
        <article className="verdict is-unpriced">
          <header className="verdict-head"><span className="verdict-mark"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 7l10 10M17 7 7 17" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"/></svg></span><div><span>The second word</span><h3>Unpriced.</h3></div></header>
          <ul className="verdict-list"><li>Availability unknown</li><li>Price unknown</li><li>Sent to an OTA</li></ul>
          <div className="verdict-answer" aria-label="The AI's answer when you are unpriced">
            <span className="answer-who"><i/>ChatGPT</span>
            <p>I found Mediterranean Sea Views in Tel Aviv, but I can't confirm availability or the final price for your dates. You can check on:</p>
            <ul className="answer-otas"><li>Booking.com <span>↗</span></li><li>Airbnb <span>↗</span></li><li>Expedia <span>↗</span></li></ul>
          </div>
          <p className="verdict-foot">The AI sends the guest to the OTAs. The commission is theirs.</p>
        </article>
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
            <span className="kind-detour"><s>The OTA listing of your own property</s><em>commission</em></span>
          </div>
          <p>Today that guest often ends up on an OTA listing of your own property, and you pay commission on your own name. NEXA Direct takes them straight to your website instead.</p>
          <ul className="kind-facts"><li>Your name, your booking</li><li>The lower rate</li></ul>
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
          <ul className="kind-facts"><li>A guest you would not have had</li><li>The higher rate</li></ul>
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
          <ul className="money-rows" data-line aria-label="Where the money goes, three ways to book">
            <li className="is-ota" style={{ '--w': .18 } as React.CSSProperties}><span className="money-name">Booked through an OTA</span><span className="money-note">to the OTA</span><span className="money-bar"><i/><em>Stays with you</em></span></li>
            <li className="is-direct" style={{ '--w': .04 } as React.CSSProperties}><span className="money-name">NEXA Direct, the guest asked for you</span><span className="money-note">to NEXA</span><span className="money-bar"><i/><em>Stays with you</em></span></li>
            <li className="is-agent" style={{ '--w': .08 } as React.CSSProperties}><span className="money-name">NEXA Agent, the AI found you the guest</span><span className="money-note">to NEXA</span><span className="money-bar"><i/><em>Stays with you</em></span></li>
          </ul>
          <a className="s8-link" href="/pricing">The numbers are on the Pricing page <Arrow/></a>
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
