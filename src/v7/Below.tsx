import { useEffect } from 'react';
import { Arrow } from '../v6/Scenes';
import { STAY } from '../v6/stay';

// Everything under the hero, shared by the V7 and V8 homepages. The structure
// follows what the best product sites share (see DESIGN_V7.md): a trust strip,
// feature sections that pair a heading with a real product visual, proof, a
// closing call to action. The page scrolls plainly.

export const PMS = ['Guesty', 'Hostaway', 'BoomNow', 'Hospitable', 'Rentals United', 'HotelSync'];

const FAQ = [
  ['Where does the guest complete the booking?', "On your property's own website, using your existing booking and payment flow. The reservation then reaches your PMS as a direct website booking."],
  ['Does the guest need to install or activate anything?', 'No. Guests ask the AI assistant they already use. There is no guest installation, account connection, or NEXA activation step.'],
  ['What does my property need to connect?', 'Operator onboarding connects your PMS booking data and your direct booking destination. We review your PMS and website setup with you; guest simplicity does not mean the property has no setup.'],
  ['Can I keep my existing website and channels?', 'Yes. Your own website remains the booking destination. NEXA adds a route from AI discovery to your direct channel, alongside your existing distribution.'],
  ['Are Direct and Agent separate packages?', 'They describe two types of demand through one connection. Direct is a request naming your property or brand. Agent is a destination-led request for a suitable stay.'],
  ['What happens to the guest relationship?', "Booking and payment take place with the property. Your website and PMS continue to handle the reservation. Specific data handling is reviewed during onboarding."],
  ['Does NEXA guarantee a recommendation?', 'No. AI assistants decide which answers and recommendations to show. NEXA makes actionable property data available; it does not promise placement or selection in every answer.'],
  ['How is NEXA priced?', 'A commission on the bookings the AI brings you, and nothing else: no packages, no fixed monthly fees, cancel anytime. Its size depends on whether the guest asked for you by name. The full numbers are on the Pricing page.'],
];

// Sections appear once as they reach the viewport, and stay.
export function useReveal(root: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const items = [...el.querySelectorAll<HTMLElement>('[data-reveal]')];
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { items.forEach(i => i.classList.add('is-in')); return; }
    const io = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); } }), { rootMargin: '0px 0px -10% 0px', threshold: .1 });
    items.forEach(i => io.observe(i));
    return () => io.disconnect();
  }, [root]);
}

// A ChatGPT answer as the AI gives it: unpriced, and priced through NEXA.
function Answer({ priced }: { priced: boolean }) {
  return <div className={`v7-answer ${priced ? 'is-priced' : 'is-unpriced'}`} aria-label={priced ? 'A priced answer' : 'An unpriced answer'}>
    <p className="answer-q">“{STAY.question} {STAY.replyChunks.join('')}”</p>
    <div className="answer-a">
      <span className="answer-who"><i/>ChatGPT</span>
      {priced
        ? <><p>Mediterranean Sea Views is available for your dates. Here is the final price and a link to book direct on the property's website:</p>
          <div className="answer-card"><img src="/seanrent/tel-aviv/med/1.jpg" alt="" loading="lazy" width="1080" height="721"/><div><b>Mediterranean Sea Views · 1BR</b><span className="answer-meta">{STAY.shortDates} · Available</span><span className="answer-price">$328 <small>final total</small></span><span className="answer-link">Book direct ↗</span></div></div></>
        : <><p>I found Mediterranean Sea Views in Tel Aviv, but I can't confirm its availability or final price for your dates.</p>
          <div className="answer-card is-dim"><img src="/seanrent/tel-aviv/med/1.jpg" alt="" loading="lazy" width="1080" height="721"/><div><b>Mediterranean Sea Views · 1BR</b><span className="answer-meta">{STAY.shortDates} · Unknown</span><span className="answer-price">— <small>price unknown</small></span><span className="answer-link is-ota">Check a booking site ↗</span></div></div></>}
    </div>
  </div>;
}

const STEPS: [string, string][] = [
  ['The guest asks.', 'Their AI turns to your website, backed by the NEXA AI Connector.'],
  ['NEXA AI answers.', 'Instantly, in AI-to-AI communication: live availability, the final price, the direct route.'],
  ['The AI recommends you.', 'By name, with your final price and your best-price guarantee.'],
  ['The guest books with you.', 'On your own website. The reservation reaches your PMS like any direct booking.'],
];

// open: the Get Priced dialog. watch: brings the reader to the conversation.
export function Below({ open, watch }: { open: () => void; watch: () => void }) {
  return <>
      <section className="v7-trust wrap" aria-label="At a glance">
        <ul>
          <li><b>Winner</b><span>HVC Startup Competition by SHIC, Zurich 2026</span></li>
          <li><b>65%+</b><span>of the vote from global hospitality leaders</span></li>
          <li><b>37</b><span>countries, USA &amp; EMEA</span></li>
          <li><b>6</b><span>PMS integrations, live in days</span></li>
        </ul>
      </section>

      <section className="feature wrap" id="priced" aria-labelledby="priced-title" data-reveal>
        <header className="feature-head">
          <p className="v7-kicker">Priced or unpriced</p>
          <h2 id="priced-title">Being mentioned by the AI is nice. Being bookable through the AI is where the money is.</h2>
          <p className="feature-lead">Two words decide who gets the booking. An AI is not allowed to guess: without live availability and a final price it sends the guest to whoever is priced, usually an OTA. With NEXA, it can recommend you and complete the booking.</p>
        </header>
        <div className="v7-pair">
          <figure><figcaption><b className="tag is-unpriced">Unpriced</b>The AI knows you exist, but cannot answer for you.</figcaption><Answer priced={false}/></figure>
          <figure><figcaption><b className="tag is-priced">Priced</b>The AI sees your availability, your final price and a trusted way to book direct.</figcaption><Answer priced/></figure>
        </div>
        <p className="feature-foot">You're not losing to better hotels. <strong>You're losing to the OTAs.</strong></p>
      </section>

      <section className="feature wrap v7-how" id="how-it-works" aria-labelledby="works-title" data-reveal>
        <header className="feature-head is-split">
          <div><p className="v7-kicker">How it works</p><h2 id="works-title">NEXA AI makes your property PRICED.</h2></div>
          <p className="feature-lead">From "find me a place" to a booking on your site. One conversation. The guest installs nothing; the AI simply answers.</p>
        </header>
        <ol className="steps-list">
          {STEPS.map(([title, text], i) => <li key={title}><span className="step-n">0{i + 1}</span><h3>{title}</h3><p>{text}</p></li>)}
        </ol>
        <div className="feature-links"><button type="button" className="v7-button is-outline" onClick={watch}>Watch a booking happen</button><a className="v7-link" href="/how-it-works">The full journey, step by step <Arrow/></a></div>
      </section>

      <section className="feature wrap v7-demand" id="connector" aria-labelledby="demand-title" data-reveal>
        <header className="feature-head is-split">
          <div><p className="v7-kicker">NEXA Direct · NEXA Agent</p><h2 id="demand-title">One connection. Two kinds of guests.</h2></div>
          <p className="feature-lead">Both book direct. You do not choose between them; one connection answers both.</p>
        </header>
        <div className="demand-grid">
          <article><p className="v7-kicker">Direct</p><h3>They ask for you, by name.</h3><q>Find me a Sea N' Rent apartment.</q><p>They already know your property. Direct brings that booking home.</p></article>
          <article><p className="v7-kicker">Agent</p><h3>They ask for a stay. You become the answer.</h3><q>A sea-view apartment in Tel Aviv.</q><p>They are looking in your destination. Agent puts your property in the answer, priced and bookable.</p></article>
        </div>
        <a className="v7-link" href="/nexa-ai-connector">See how one connection does both <Arrow/></a>
      </section>

      <section className="feature wrap v7-yours" id="your-website" aria-labelledby="yours-title" data-reveal>
        <header className="feature-head is-split">
          <div><p className="v7-kicker">Your website, your checkout</p><h2 id="yours-title">The booking lands on your website.</h2></div>
          <p className="feature-lead">Exactly like connecting Airbnb or Booking.com, through the PMS you already run. No developer. No code. Live in days. The guest pays you, under your terms. Guest data belongs to you.</p>
        </header>
        <div className="yours-grid">
          <div className="yours-site" aria-hidden="true">
            <div className="v7site-bar"><i/><i/><i/><span>seanrent.com · checkout</span><em>Illustrative</em></div>
            <div className="v7site-body">
              <img src="/seanrent/tel-aviv/med/2.jpg" alt="" loading="lazy" width="1080" height="720"/>
              <div><p className="v7-kicker">Your stay</p><b>Mediterranean Sea Views</b><span className="v7site-dates">{STAY.dates} · 4 nights · 2 adults</span><p className="v7site-total"><span>Final price</span><b>$328</b></p><span className="v7site-pay">Pay $328 →</span><small>Booking and payment on the property's website</small></div>
            </div>
          </div>
          <ul className="yours-list">
            <li><b>Your website</b>The destination for the booking, not the OTA's.</li>
            <li><b>Your checkout</b>The guest pays through your existing flow. NEXA never holds the guest's money.</li>
            <li><b>Your PMS</b>The reservation arrives as a direct website booking, like any other.</li>
          </ul>
        </div>
      </section>

      <section className="v7-proof" aria-labelledby="proof-title" data-reveal>
        <div className="wrap">
          <h2 id="proof-title" className="sr-only">Why NEXA</h2>
          <blockquote className="proof-quote"><p>Our whole company is based on one small sentence at the bottom of every AI chat: <q>ChatGPT can make mistakes.</q> Everyone reads it as a warning. We read it as a confession.</p><footer><a className="v7-link is-light" href="/about">Read the story <Arrow/></a></footer></blockquote>
          <dl className="proof-stats">
            <div><dt>PMS integrations</dt><dd>6</dd></div>
            <div><dt>Countries</dt><dd>37</dd></div>
            <div><dt>Portfolios, from a single owner to</dt><dd>3,000 units</dd></div>
            <div><dt>Guest installs</dt><dd>Nothing</dd></div>
          </dl>
        </div>
      </section>

      <section className="feature wrap pricing-teaser" id="economics" aria-labelledby="pricing-title" data-reveal>
        <header className="feature-head is-split">
          <div><p className="v7-kicker">Pricing</p><h2 id="pricing-title">One commission on the bookings the AI brings you. No monthly fees.</h2></div>
          <div><p className="feature-lead">Bring AI-originated demand to the booking experience you already own. The commission depends on whether the guest asked for you by name; the numbers are on the Pricing page.</p><div className="feature-links"><a className="v7-button" href="/pricing">See pricing <Arrow/></a><a className="v7-link" href="/pricing#find-your-rate">Calculate what you keep <Arrow/></a></div></div>
        </header>
      </section>

      <section className="feature wrap v7-who" id="for-you" aria-labelledby="audience-title" data-reveal>
        <h2 id="audience-title" className="sr-only">Who NEXA is for</h2>
        <a className="audience-card" href="/solutions"><img src="/v7/hotel.webp" alt="A hotel roof terrace" loading="lazy" width="1400" height="933"/><div><p className="v7-kicker">Hotels</p><h3>I run a hotel.</h3><p>Defend your loyalty program, fill the gaps, shrink the OTA bill.</p><span className="v7-link">NEXA for hotels <Arrow/></span></div></a>
        <a className="audience-card" href="/solutions"><img src="/v7/rental.webp" alt="An apartment living room in Jaffa" loading="lazy" width="1400" height="933"/><div><p className="v7-kicker">Vacation rentals</p><h3>I run vacation rentals.</h3><p>Defend your brand, from one unit to a 3,000-unit portfolio.</p><span className="v7-link">NEXA for vacation rentals <Arrow/></span></div></a>
      </section>

      <section className="feature wrap faq7" id="faq" aria-labelledby="faq-title" data-reveal>
        <div className="feature-head is-split">
          <div><p className="v7-kicker">FAQ</p><h2 id="faq-title">Straight answers.</h2></div>
          <div className="faq-items">
            {FAQ.map(([q, a], i) => <details key={q} open={i === 0}><summary><span className="faq-n">{String(i + 1).padStart(2, '0')}</span>{q}<i aria-hidden="true"/></summary><p>{a}</p></details>)}
          </div>
        </div>
      </section>

      <section id="get-priced" className="closing7" aria-labelledby="closing-title" data-reveal>
        <div className="wrap">
          <h2 id="closing-title">Get PRICED before your competitor does.</h2>
          <div className="hero-actions"><button type="button" className="v7-button is-light" onClick={() => open()}>Get Priced <Arrow diagonal/></button><a className="v7-button is-outline is-dark" href="/contact">Talk to a person</a></div>
          <p className="closing-line">For hotels and vacation rental operators. Live in days through the PMS you already run.</p>
        </div>
      </section>
  </>;
}
