import { Arrow } from '../v6/Scenes';
import { STAY } from '../v6/stay';
import { LISTINGS } from '../v6/listings';
import { StayCard } from './Rider';

// Everything under the conversation, in the order and wording of the website
// plan (Content V3), in the language of the reference site: a numbered label
// with a baseline above every section, a large light heading beside its lead
// and one button, grey rounded cards, one dark section, small arrow buttons.
// Prices live on the Pricing page only.

export const PMS = ['Guesty', 'Hostaway', 'BoomNow', 'Hospitable', 'Rentals United', 'HotelSync'];

const STEPS: [string, string][] = [
  ['The guest asks.', 'The AI turns to your website, which is backed by the NEXA AI Connector.'],
  ['NEXA AI answers.', 'Instantly, in AI-to-AI communication.'],
  ['The AI recommends you.', 'By name, with your final price and your best-price guarantee.'],
  ['The guest books with you.', 'Straight into your PMS, like any direct booking.'],
];

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

// [01] THE TWO WORDS / PRICED OR UNPRICED, with the baseline that draws itself as the label arrives.
function SectionLabel({ n, left, right }: { n?: string; left: string; right?: string }) {
  return <p className="s8-label" data-line><span>{n ? `[${n}] ` : ''}{left}</span>{right && <span>/ {right}</span>}</p>;
}

// A ChatGPT answer as the AI gives it, on a tile: priced through NEXA, or unpriced.
const ASKED = `${STAY.question} ${STAY.replyChunks.join('')}`;
function Answer({ priced, question = ASKED, intro }: { priced: boolean; question?: string; intro?: string }) {
  return <div className="s8-tile"><div className={`s8-answer ${priced ? 'is-priced' : 'is-unpriced'}`} aria-label={priced ? 'A priced answer' : 'An unpriced answer'}>
    <p className="answer-q">“{question}”</p>
    <div className="answer-a">
      <span className="answer-who"><i/>ChatGPT</span>
      {priced
        ? <><p>{intro ?? "Mediterranean Sea Views is available for your dates. Here is the final price and a link to book direct on the property's website:"}</p>
          <div className="answer-card"><img src="/seanrent/tel-aviv/med/1.jpg" alt="" loading="lazy" width="1080" height="721"/><div><b>Mediterranean Sea Views · 1BR</b><span className="answer-meta">{STAY.shortDates} · Available</span><span className="answer-price">$328 <small>final total</small></span><span className="answer-link">Book direct ↗</span></div></div></>
        : <><p>{intro ?? "I found Mediterranean Sea Views in Tel Aviv, but I can't confirm its availability or final price for your dates."}</p>
          <div className="answer-card is-dim"><img src="/seanrent/tel-aviv/med/1.jpg" alt="" loading="lazy" width="1080" height="721"/><div><b>Mediterranean Sea Views · 1BR</b><span className="answer-meta">{STAY.shortDates} · Unknown</span><span className="answer-price">— <small>price unknown</small></span><span className="answer-link is-ota">Check a booking site ↗</span></div></div></>}
    </div>
  </div><span className="s8-tile-note">Illustrative</span></div>;
}

// The property's own checkout, where the booking lands. The slot holds the
// stay card once the travelling card has docked (or always, without motion).
const COASTAL = LISTINGS.coastal;
function Site() {
  return <div className="s8-site" aria-hidden="true">
    <div className="s8-site-bar"><i/><i/><i/><span>seanrent.com · checkout</span><em>Illustrative</em></div>
    <div className="s8-site-body">
      <div className="s8-dock"><StayCard docked/></div>
      <div><p className="s8-site-total"><span>Final price</span><b>{COASTAL.total}</b></p><span className="s8-site-pay">Pay {COASTAL.total} →</span><small>Booking and payment on the property's website. The reservation reaches your PMS as a direct booking.</small></div>
    </div>
  </div>;
}

// Small glyphs, so the steps read without their words.
const GLYPH = {
  ask: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4A2.5 2.5 0 0 1 4 13.5v-7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M8 9h8M8 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  answer: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  recommend: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m12 3 2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 16.9l-5.4 2.9 1.1-6.1L3.2 9.4l6.1-.8L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  book: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="m9 11 2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  plug: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0V8ZM12 17v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  shield: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3 5 6v5c0 4.5 3 8.4 7 10 4-1.6 7-5.5 7-10V6l-7-3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};
const STEP_GLYPHS = [GLYPH.ask, GLYPH.answer, GLYPH.recommend, GLYPH.book];

// open: the Get Priced dialog. watch: brings the reader back to the conversation.
export function Sections({ open, watch }: { open: () => void; watch: () => void }) {
  return <>
    <section className="s8-connects wrap" aria-label="How it connects">
      <div><span className="s8-glyph">{GLYPH.plug}</span><span className="s8-n">The connection</span><p>Exactly like connecting Airbnb or Booking.com, through the PMS you already run. No developer. No code. Live in hours.</p></div>
      <div><span className="s8-glyph">{GLYPH.shield}</span><span className="s8-n">The legal side</span><p>A direct booking, on paper as well. The guest books on your website, under your terms and your payment. Your website, not the OTA's. NEXA AI is never a party to the reservation. Guest data belongs to you.</p><a className="s8-link" href="/nexa-ai-connector">How it works legally <Arrow/></a></div>
    </section>

    <section className="s8-proof wrap" aria-label="Proof">
      <p>Global hospitality leaders voted. Over 65% chose NEXA AI.</p>
      <ul>
        <li><b>Winner</b><span>HVC Startup Competition by SHIC, Zurich 2026</span></li>
        <li><b>65%+</b><span>of the vote from global hospitality leaders</span></li>
        <li><b>37</b><span>countries, USA &amp; EMEA</span></li>
        <li><b>6</b><span>PMS integrations, live in days</span></li>
      </ul>
    </section>

    <section className="s8-section wrap" id="priced" aria-labelledby="priced-title">
      <SectionLabel n="01" left="The two words" right="Priced or unpriced"/>
      <div className="s8-head">
        <h2 id="priced-title" data-pass>Being mentioned by the AI is nice. <em>Being bookable through the AI</em> is where the money is.</h2>
        <div><p className="s8-lead">Two words decide who gets the booking:</p></div>
      </div>
      <div className="s8-cards s8-two">
        <article className="s8-card"><span className="s8-n">The first word</span><h3>Priced.</h3><p>The AI sees your live availability, your final price, and a trusted way to book direct. It can recommend you, and complete the booking.</p><Answer priced/></article>
        <article className="s8-card"><span className="s8-n">The second word</span><h3>Unpriced.</h3><p>The AI knows you exist, but cannot answer for you. It is not allowed to guess, so the booking goes to whoever is priced. Usually an OTA.</p><Answer priced={false}/></article>
      </div>
      <p className="s8-statement" data-pass>You're not losing to better hotels. <em>You're losing to the OTAs.</em></p>
      <div className="s8-expand">
        <p>Our whole company is based on one small sentence at the bottom of every AI chat: <q>ChatGPT can make mistakes.</q> That sentence is why the AI cannot answer for you.</p>
        <a className="s8-button is-outline" href="/about"><Arrow diagonal/>Read the story</a>
      </div>
    </section>

    <section className="s8-section s8-dark" id="how-it-works" aria-labelledby="works-title">
      <div className="wrap">
        <SectionLabel n="02" left="How it works" right="The fix"/>
        <div className="s8-head">
          <h2 id="works-title" data-pass>NEXA AI makes your property <em>PRICED</em>. Here is how.</h2>
          <div><p className="s8-lead">From “find me a place” to a booking on your site. One conversation.</p><a className="s8-button is-light" href="/how-it-works"><Arrow diagonal/>Watch now</a></div>
        </div>
        <div className="s8-works">
          <ol className="s8-steps" role="list">
            {STEPS.map(([title, text], i) => <li key={title} role="listitem"><span className="s8-n">[0{i + 1}]</span><span className="s8-glyph">{STEP_GLYPHS[i]}</span><h3>{title}</h3><p>{text}</p></li>)}
          </ol>
          <div className="s8-tile s8-works-tile"><Site/></div>
        </div>
        <div className="s8-foot">
          <p className="s8-note">The guest installs nothing. No application needed. No plugin installed in the chat by the guest. The guest just asks, the AI simply answers.</p>
          <button type="button" className="s8-link" onClick={watch}>Watch a booking happen, step by step <Arrow/></button>
        </div>
      </div>
    </section>

    <section className="s8-section wrap" id="connector" aria-labelledby="product-title">
      <SectionLabel n="03" left="The product" right="NEXA AI Connector"/>
      <div className="s8-head">
        <h2 id="product-title" data-pass>One connection. Two kinds of guests. <em>Both book direct.</em></h2>
        <div><p className="s8-lead">NEXA Direct and NEXA Agent are the two booking types inside one connection, priced by how the guest arrived.</p><a className="s8-button" href="/nexa-ai-connector"><Arrow diagonal/>Show me</a></div>
      </div>
      <div className="s8-cards s8-two">
        <article className="s8-card"><span className="s8-n">NEXA Direct · branded</span><h3>They asked for you by name.</h3><p>Today that guest often lands on an OTA listing of your own property, and you pay commission on your own name. Direct brings that booking home.</p><Answer priced question="Find me a room at Sea N' Rent. May 1-5, two adults." intro="Sea N' Rent has Mediterranean Sea Views available for your dates. Here is the final price, and a link to book direct on the property's own website:"/></article>
        <article className="s8-card"><span className="s8-n">NEXA Agent · non-branded</span><h3>They asked for a stay in your city.</h3><p>Today that answer belongs to the OTAs. NEXA Agent shares a best-price guarantee, represents the official host, locks availability, and gives the AI a final price it can trust. The guest books with you.</p><Answer priced question="Find me an apartment near the sea in Tel Aviv. May 1-5, two adults." intro="Here is an option that is available for your dates, with a final price and a direct way to book on the property's website:"/></article>
      </div>
      <a className="s8-link s8-after" href="/nexa-ai-connector">See how one connection does both <Arrow/></a>
    </section>

    <section className="s8-section wrap" id="economics" aria-labelledby="pricing-title">
      <SectionLabel n="04" left="Pricing" right="The money"/>
      <div className="s8-head">
        <h2 id="pricing-title" data-pass>Same guest. Same room. <em>Very different commission.</em></h2>
        <div><p className="s8-lead">The same 4-night stay, booked through an OTA, through NEXA Direct, through NEXA Agent. Watch where the money goes.</p><div className="s8-actions"><a className="s8-button" href="/pricing"><Arrow diagonal/>Pricing</a><a className="s8-link" href="/pricing#calculator">Run your own numbers <Arrow/></a></div></div>
      </div>
      <div className="s8-tile s8-money">
        <div className="s8-receipt" aria-label="The same stay, three ways to book it">
          <div className="s8-receipt-stay"><span className="s8-n">The same stay</span><b>{COASTAL.title} · {STAY.nights} · {STAY.guests}</b><span className="s8-receipt-total"><span>Final total</span><b>{COASTAL.total}</b></span></div>
          <ul>
            <li><span>Booked through an OTA</span><em>commission <b>••%</b></em></li>
            <li><span>NEXA Direct, the guest asked for you by name</span><em>commission <b>••%</b></em></li>
            <li><span>NEXA Agent, NEXA put you in the answer</span><em>commission <b>••%</b></em></li>
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
