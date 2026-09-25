import { useState } from 'react';
import { Arrow } from './Scenes';
import { ClosingCta, PageLabel, PageShell, PricedButton } from './Shell';

// Inner pages from the website plan (Nexa Website V3 content). Wording is the
// plan's. Prices appear on the Pricing page only; other pages link to it.

const PMS = ['Guesty', 'Hostaway', 'BoomNow', 'HotelSync', 'Hospitable', 'Rentals United'];

// ---------------------------------------------------------------- Pricing

// The plan's example: a 4-night stay, $1,000 total.
const CHANNELS = [
  { id: 'ota', name: 'OTA booking', rate: '18%', min: 18, max: 18, lose: '$180', keep: '$820', gain: '' },
  { id: 'direct', name: 'NEXA Direct', kind: 'branded', rate: '1-3%', min: 1, max: 3, lose: '$10-$30', keep: '$970-990', gain: '18.2% to 20.7% more net profit' },
  { id: 'agent', name: 'NEXA Agent', kind: 'non-branded', rate: '5-9%', min: 5, max: 9, lose: '$50-90', keep: '$910-950', gain: '11% to 15.8% more net profit' },
];

function StayLedger() {
  return <figure className="stay-ledger" data-rise>
    <figcaption><span>Example</span>A 4-night stay, $1,000 total.</figcaption>
    <ul className="ledger-key" aria-hidden="true"><li><i className="key-keep"/>You keep</li><li><i className="key-cost"/>Commission</li><li><i className="key-range"/>Commission range</li></ul>
    <ol>
      {CHANNELS.map(row => <li key={row.id} className={`ledger-row is-${row.id}`}>
        <div className="ledger-name"><strong>{row.name}</strong>{row.kind && <small>{row.kind}</small>}<span className="ledger-rate">{row.rate}</span></div>
        <div className="ledger-bar" role="img" aria-label={`${row.name}: commission ${row.rate}, you lose ${row.lose} and keep ${row.keep}`}>
          <i className="bar-keep" style={{ flexBasis: `${100 - row.max}%` }}/>
          {row.max > row.min && <i className="bar-range" style={{ flexBasis: `${row.max - row.min}%` }}/>}
          <i className="bar-cost" style={{ flexBasis: `${row.min}%` }}/>
        </div>
        <p className="ledger-money"><span>You keep <b>{row.keep}</b></span><span>You lose <b>{row.lose}</b></span></p>
        {row.gain && <p className="ledger-gain">{row.gain}</p>}
      </li>)}
    </ol>
  </figure>;
}

// The reader's own numbers: what the same bookings would cost through an OTA,
// and through NEXA. Every input is theirs; nothing here is a forecast.
const money = (value: number) => '$' + (Math.round(value / 100) * 100).toLocaleString('en-US');
const INPUTS = [
  { id: 'listings', label: 'Listings', min: 1, max: 300, step: 1, show: (v: number) => String(v) },
  { id: 'rate', label: 'Average nightly rate', min: 60, max: 1000, step: 10, show: (v: number) => `$${v}` },
  { id: 'occupancy', label: 'Occupancy', min: 20, max: 95, step: 1, show: (v: number) => `${v}%` },
  { id: 'share', label: 'Bookings that come through an AI conversation', min: 5, max: 100, step: 5, show: (v: number) => `${v}%` },
  { id: 'ota', label: 'OTA commission today', min: 15, max: 25, step: 1, show: (v: number) => `${v}%` },
] as const;
type CalcInput = typeof INPUTS[number]['id'];

function Calculator() {
  const [values, setValues] = useState<Record<CalcInput, number>>({ listings: 12, rate: 180, occupancy: 65, share: 20, ota: 18 });
  const revenue = values.listings * values.rate * 365 * values.occupancy / 100 * values.share / 100;
  const cost = (rate: number) => revenue * rate / 100;
  const ota = cost(values.ota);
  const rows = [
    { id: 'ota', name: 'Through an OTA', rate: `${values.ota}%`, low: ota, high: ota },
    { id: 'direct', name: 'NEXA Direct', note: 'they ask for you by name', rate: '1-3%', low: cost(1), high: cost(3) },
    { id: 'agent', name: 'NEXA Agent', note: 'NEXA AI puts you in the answer', rate: '5-9%', low: cost(5), high: cost(9) },
  ];
  const keepLow = ota - cost(9), keepHigh = ota - cost(1);
  return <div className="calculator">
    <form className="calc-inputs" onSubmit={event => event.preventDefault()}>
      {INPUTS.map(input => <div key={input.id} className="calc-input">
        <span><label htmlFor={`calc-${input.id}`}>{input.label}</label><output htmlFor={`calc-${input.id}`}>{input.show(values[input.id])}</output></span>
        <input id={`calc-${input.id}`} type="range" min={input.min} max={input.max} step={input.step} value={values[input.id]} aria-valuetext={input.show(values[input.id])} onChange={event => setValues({ ...values, [input.id]: Number(event.target.value) })} style={{ '--at': `${(values[input.id] - input.min) / (input.max - input.min) * 100}%` } as React.CSSProperties}/>
      </div>)}
      <p className="calc-basis">These bookings are worth <b>{money(revenue)}</b> a year: listings × nightly rate × 365 nights × occupancy × the AI share.</p>
    </form>
    <div className="calc-result">
      <div aria-live="polite" aria-atomic="true">
        <p className="calc-kicker">You keep, every year</p>
        <p className="calc-number"><strong>{money(keepLow)}</strong><span>to</span><strong>{money(keepHigh)}</strong></p>
        <p className="calc-sub">more than if the same bookings came through an OTA.</p>
      </div>
      <ol className="calc-bars" aria-label="Commission on these bookings, per year">
        {rows.map(row => <li key={row.id} className={`is-${row.id}`}>
          <span className="calc-name"><b>{row.name}</b>{row.note && <small>{row.note}</small>}</span>
          <span className="calc-bar" aria-hidden="true"><i style={{ width: `${row.high / ota * 100}%` }}/><i style={{ width: `${row.low / ota * 100}%` }}/></span>
          <span className="calc-cost"><em>{row.rate}</em>{row.low === row.high ? money(row.low) : `${money(row.low)}–${money(row.high)}`}</span>
        </li>)}
      </ol>
      <p className="calc-note">Commission on these bookings, per year. Illustrative: your numbers, not a forecast. NEXA charges commission on AI-generated revenue only.</p>
    </div>
  </div>;
}

export function PricingPage() {
  return <PageShell page="pricing" title="Pricing">
    <section className="page-hero wrap">
      <PageLabel left="PRICING" right="THE MONEY"/>
      <h1>Same guest. Same room.<br/><em>Very different commission.</em></h1>
      <p className="page-intro">No packages. No tiers. You pay a commission on the bookings the AI brings you, and its size depends on one question: did the guest ask for you by name, or did we put you in the answer?</p>
    </section>
    <section className="page-section wrap pricing-example" aria-label="Example stay">
      <StayLedger/>
    </section>
    <section className="page-section wrap pricing-calculator" id="calculator" aria-labelledby="calculator-title">
      <PageLabel left="[01] YOUR NUMBERS" right="WHAT YOU KEEP"/>
      <h2 id="calculator-title" className="page-h2">Your bookings.<br/><em>Your commission.</em></h2>
      <Calculator/>
    </section>
    <section className="page-section wrap pricing-terms" aria-labelledby="definitions-title">
      <PageLabel left="[02] TWO KINDS OF BOOKING" right="PRICED BY HOW THE GUEST ARRIVED"/>
      <h2 id="definitions-title" className="page-h2" data-rise>One connection.<br/><em>Two commissions.</em></h2>
      <div className="definition-grid">
        <article data-rise><span className="definition-rate">1-3%</span><h3>NEXA Direct, branded</h3><p>The traveler asked for your brand by name.</p></article>
        <article data-rise><span className="definition-rate">5-9%</span><h3>NEXA Agent, non-branded</h3><p>The traveler asked for a stay in your market, and NEXA AI put your property in the answer.</p></article>
      </div>
      <ul className="model-facts" data-rise><li>Commission on AI-generated revenue only</li><li>No fixed monthly fees</li><li>Cancel anytime</li></ul>
      <p className="comparison-note" data-rise><strong>OTA commissions typically run 15-25%.</strong> Same guest, same room, direct into your own flow, with the guest relationship intact.</p>
    </section>
    <section className="page-section wrap pricing-websites" aria-labelledby="websites-title">
      <PageLabel left="[03] YOUR WEBSITE" right="BOOKING ENGINE AND MULTI WEBSITE"/>
      <div className="split-intro" data-rise><h2 id="websites-title" className="page-h2">Need a website<br/><em>the AI can read?</em></h2><p>For operators with no direct booking website, or one that is not bringing direct bookings. <a className="inline-link" href="/solutions">See the solutions <Arrow/></a></p></div>
      <div className="price-cards">
        <article className="price-card" data-rise>
          <small>NEXA BOOKING ENGINE</small>
          <p className="price"><strong>$10</strong><span>per listing, per month</span></p>
          <ul><li><b>Standard</b> 1 to 499 unique listings, $10 per listing per month.</li><li><b>Enterprise</b> 500+ unique listings, let's talk.</li><li>Each bookable unit counts once. A parent listing and its child listings count as one.</li><li>No setup fee. No onboarding fee.</li></ul>
          <PricedButton>Get my website</PricedButton>
        </article>
        <article className="price-card" data-rise>
          <small>MULTI WEBSITE</small>
          <p className="price"><strong>$5</strong><span>per listing, per month</span></p>
          <ul><li>A listing that already exists on your main website costs $5 per listing per month on an additional website, half the standard price.</li><li>Every site has its own domain, design, content and part of your inventory, from one panel on one PMS connection.</li></ul>
          <a className="button button-outline-dark" href="/contact">Talk about your portfolio <Arrow diagonal/></a>
        </article>
      </div>
    </section>
    <section className="page-statement" aria-label="In short"><div className="wrap" data-rise><p>Every one of these bookings used to cost you <s>15&#8209;25%</s>.<br/><em>Now it costs 1&#8209;9%.</em></p></div></section>
    <ClosingCta line={<>Want to talk first? <a href="/contact">Leave your details on the Contact page</a>.</>}/>
  </PageShell>;
}

// ---------------------------------------------------------------- Solutions

const BUILT_FOR_AI = [
  ['Readable', 'Every property is published as structured data in the fields the models actually require, not as a page of pictures.'],
  ['Live', 'Availability and the final price come from your PMS in real time, so the AI can quote you instead of guessing.'],
  ['Trusted', 'The price on your site is the price the AI is given. Parity is what makes a recommendation safe to give.'],
  ['Ranked', 'Weekly SEO and GEO work, so your site keeps earning its place in search and in AI answers. Not set up once and left alone.'],
  ['Reported', 'A monthly report on rankings, traffic and direct bookings.'],
];

// What the AI reads on a NEXA website: a page for the guest, structured data for the agent.
function ReadableSite() {
  return <div className="readable-site" aria-hidden="true" data-rise>
    <div className="site-frame"><div className="site-bar"><i/><i/><i/><span>your-property.com</span></div><div className="site-body"><span className="site-photo"/><b/><b className="short"/><span className="site-book">Book direct</span></div></div>
    <div className="site-data">
      <small>WHAT THE AI READS</small>
      <code><span>"availability"</span>: <em>"live from your PMS"</em>,</code>
      <code><span>"finalPrice"</span>: <em>"taxes included"</em>,</code>
      <code><span>"priceParity"</span>: <em>true</em>,</code>
      <code><span>"bookDirect"</span>: <em>"your checkout"</em></code>
    </div>
  </div>;
}

function Portfolio() {
  return <div className="portfolio" aria-hidden="true" data-rise>
    {[['villas', 'Villas collection'], ['city', 'City apartments'], ['beach', 'Beach houses']].map(([key, name]) => <div key={key} className={`portfolio-site is-${key}`}><span className="site-bar"><i/><i/><i/></span><strong>{name}</strong><small>{key}.yourbrand.com</small></div>)}
    <div className="portfolio-panel"><span>ONE PANEL</span><strong>One PMS connection</strong></div>
  </div>;
}

export function SolutionsPage() {
  return <PageShell page="solutions" title="Solutions">
    <section className="page-hero wrap">
      <PageLabel left="SOLUTIONS" right="WHERE THE ANSWER LANDS"/>
      <h1>The AI answer<br/><em>has to land somewhere.</em></h1>
      <p className="page-intro">NEXA AI Connector puts your property inside the answer. These are the two ways to make sure the guest lands on a site that can close it: a direct booking website built to be read by AI, and a separate website for every brand you run.</p>
      <nav className="solution-jump" aria-label="On this page"><a href="#booking-engine"><span>01</span>NEXA Booking Engine</a><a href="#multi-website"><span>02</span>Multi Website</a><a href="#keep-your-website"><span>03</span>Keep your website</a></nav>
    </section>
    <section className="page-section wrap solution" id="booking-engine" aria-labelledby="engine-title">
      <PageLabel left="[01] THE WEBSITE" right="BUILT TO BE READ BY AI"/>
      <div className="solution-grid">
        <div data-rise>
          <p className="who-for"><span>Who it is for</span>You have no direct booking website at all, or you have one and it is not bringing you direct bookings.</p>
          <h2 id="engine-title" className="page-h2">A direct booking website the AI can <em>read, trust and quote.</em></h2>
          <p className="lead">A site can look right to a guest and still be unreadable to an AI. No structured data, no live price, no proof that the price is real. So the AI does the safe thing and sends the guest to the OTA.</p>
          <p>Your own website and booking engine, connected to the PMS you already run, built from the start for the way AI agents read a property.</p>
        </div>
        <ReadableSite/>
      </div>
      <div className="built-for-ai">
        <h3 data-rise>Built for AI <span>The part that decides whether you get recommended</span></h3>
        <ol>{BUILT_FOR_AI.map(([title, text], i) => <li key={title} data-rise><span>0{i + 1}</span><strong>{title}</strong><p>{text}</p></li>)}</ol>
        <p className="solution-note" data-rise>AI tools and AI agents are included in the work. No outside SEO agency needed.</p>
      </div>
      <div className="solution-actions" data-rise><PricedButton>Get my website</PricedButton><a className="text-link" href="/pricing">See pricing <Arrow/></a><span>No setup fee. No onboarding fee.</span></div>
    </section>
    <section className="page-section wrap solution" id="multi-website" aria-labelledby="multi-title">
      <PageLabel left="[02] MULTI WEBSITE" right="ONE PORTFOLIO, MANY BRANDS"/>
      <div className="solution-grid is-reversed">
        <Portfolio/>
        <div data-rise>
          <p className="who-for"><span>Who it is for</span>You run more than one brand, region or collection, or you manage properties for owners who want a site of their own.</p>
          <h2 id="multi-title" className="page-h2">One account. <em>A separate website for every brand you run.</em></h2>
          <p className="lead">Every site has its own domain, its own design, its own content and its own part of your inventory. All of it from one panel, on one PMS connection.</p>
          <div className="why-it-matters"><strong>Why it matters in an AI answer</strong><p>An AI answer is about one specific place. Villas and city apartments sitting on the same site compete with each other for the same answer. Separated, each brand is its own business, with its own identity and its own pages.</p></div>
          <div className="solution-actions"><a className="button button-dark" href="/contact">Talk about your portfolio <Arrow diagonal/></a><a className="text-link" href="/pricing">See pricing <Arrow/></a></div>
        </div>
      </div>
    </section>
    <section className="page-section wrap solution keep-site" id="keep-your-website" aria-labelledby="keep-title">
      <PageLabel left="[03] THE AI CHANNEL" right="NEXA AI CONNECTOR"/>
      <div className="keep-card" data-rise>
        <h2 id="keep-title" className="page-h2">Already have a website you are happy with? <em>Keep it.</em></h2>
        <p>The connector works with the site you already run. It serves your live availability and final prices to the AI agents, and the guest books in your own checkout.</p>
        <a className="button button-light" href="/nexa-ai-connector">See how the NEXA AI Connector works <Arrow diagonal/></a>
      </div>
    </section>
    <ClosingCta line={<>Not sure which one you need? <a href="/contact">Leave your details on the Contact page</a> and we will tell you straight.</>}/>
  </PageShell>;
}

// ---------------------------------------------------------------- About

export function AboutPage() {
  return <PageShell page="about" title="About">
    <section className="page-hero wrap about-hero">
      <PageLabel left="ABOUT" right="THE STORY"/>
      <h1>It started with<br/><em>one small sentence.</em></h1>
    </section>
    <section className="about-opening" aria-label="The sentence">
      <div className="wrap">
        <p data-rise>At the bottom of every AI chat there is one small sentence:</p>
        <p className="the-sentence" data-rise><span>“ChatGPT can make mistakes.”</span></p>
        <p data-rise>Everyone reads it as a warning.</p>
        <p className="confession" data-rise><em>We read it as a confession.</em></p>
      </div>
    </section>
    <section className="page-section wrap about-copy">
      <div className="about-columns" data-rise>
        <p>These models are terrified of being wrong. To an AI agent, a hotel website is a shop with no signs, no price tags, and no one at the counter. It cannot check your availability. It cannot confirm your final price. And it is not allowed to guess. So it does the safest thing it knows: it sends your guest to an OTA.</p>
        <p className="started"><em>That sentence started this company.</em></p>
      </div>
    </section>
    <section className="page-section wrap" aria-labelledby="who-title">
      <PageLabel left="[01] WHO WE ARE" right="THE TECHNICAL LAYER"/>
      <div className="who-grid">
        <div data-rise><h2 id="who-title" className="page-h2">The technical layer between <em>your PMS and the AI.</em></h2><p className="not-list"><span>Not a marketing company.</span><span>Not an OTA.</span><span>Not a plugin.</span></p></div>
        <dl className="about-stats" data-rise><div><dt>Countries</dt><dd>37</dd></div><div><dt>PMS integrations</dt><dd>6</dd></div><div><dt>Portfolios, from a single owner to</dt><dd>3,000<small>units</small></dd></div></dl>
      </div>
    </section>
    <section className="founder" aria-label="Founder">
      <div className="wrap" data-rise>
        <blockquote><p>“For two decades, hospitality fought the OTAs. Loyalty programs. Referrals. Book-direct campaigns that shrink your profit. <em>We do not fight the OTAs. The AI does it for us.”</em></p><footer><span className="founder-mark" aria-hidden="true">L</span><span><strong>Lior</strong>Founder &amp; CEO, NEXA AI</span></footer></blockquote>
      </div>
    </section>
    <section className="page-section wrap" aria-labelledby="work-title">
      <PageLabel left="[02] HOW WE WORK" right="EVERY RELEASE, RE-VERIFIED"/>
      <div className="work-grid" data-rise>
        <h2 id="work-title" className="page-h2">The models change <em>every single week.</em></h2>
        <div><p>Every release, our team sits in a war room and re-verifies every connection. Infrastructure that keeps up with every move the AI world makes.</p><p className="strong-line">We do not write content or run ads. We make your data readable to machines.</p></div>
      </div>
    </section>
    <section className="page-section wrap" aria-labelledby="believe-title">
      <PageLabel left="[03] WHAT WE BELIEVE" right="THE THIRD SHIFT"/>
      <h2 id="believe-title" className="page-h2" data-rise>Travel changed twice.<br/><em>The third shift is happening now.</em></h2>
      <ol className="shifts">
        <li data-rise><span>01</span><strong>Websites</strong><p>ended phone reservations.</p></li>
        <li data-rise><span>02</span><strong>OTAs</strong><p>ended browsing websites.</p></li>
        <li className="is-now" data-rise><span>03 · Now</span><strong>AI conversations</strong><p>Bookings that start inside an AI conversation. Within three years, we believe most bookings will start there.</p></li>
      </ol>
      <p className="believe-close" data-rise>The next battle in hospitality is not who ranks first on Google. It is where the AI sends the guest when they are ready to book. <strong>Every conversation ends at somebody's checkout. We make sure it is yours.</strong></p>
    </section>
    <section className="vision" aria-labelledby="vision-title">
      <div className="wrap" data-rise><PageLabel left="[04] OUR VISION"/><h2 id="vision-title"><span>Every property worldwide.</span><span>Every AI agent.</span><em>One connectivity layer.</em></h2><p>We are building the distribution and booking infrastructure for AI-native travel.</p></div>
    </section>
    <section className="page-section wrap proof-line" aria-label="Recognition">
      <div data-rise><strong>Winner</strong><p>HVC Startup Competition by SHIC (Swiss Hospitality Investment Club), Zurich 2026, with over 65% of the vote from global hospitality leaders.</p></div>
      <div data-rise><strong>37</strong><p>Live in 37 countries, USA &amp; EMEA.</p></div>
    </section>
    <ClosingCta/>
  </PageShell>;
}

// ---------------------------------------------------------------- Contact

// The form is not connected yet: sending shows a note instead of pretending.
function ContactForm() {
  const [sent, setSent] = useState(false);
  return <form className="contact-form" data-rise onSubmit={event => { event.preventDefault(); setSent(true); }}>
    <div className="form-grid">
      <label><span>Full name</span><input name="name" autoComplete="name" required/></label>
      <label><span>Email</span><input name="email" type="email" autoComplete="email" required/></label>
      <label><span>Phone</span><input name="phone" type="tel" autoComplete="tel" placeholder="+ country code"/></label>
      <label><span>Company name</span><input name="company" autoComplete="organization"/></label>
      <label><span>Number of listings</span><input name="listings" type="number" min="1" inputMode="numeric"/></label>
      <label><span>PMS</span><select name="pms" defaultValue=""><option value="" disabled>Choose your PMS</option>{PMS.map(name => <option key={name}>{name}</option>)}<option>Other</option></select></label>
    </div>
    <div className="form-send"><button type="submit" className="button button-dark">Send <Arrow/></button><p>No commitment. Just a straight answer.</p></div>
    <p className="form-status" role="status">{sent ? 'Preview only: this form is not connected yet, so nothing was sent.' : ''}</p>
  </form>;
}

export function ContactPage() {
  return <PageShell page="contact" title="Contact">
    <section className="page-hero wrap contact-hero">
      <PageLabel left="CONTACT US" right="A REAL PERSON"/>
      <div className="contact-grid">
        <div><h1>Your next guest is asking.<br/><em>Let's talk.</em></h1><p className="page-intro">Leave your details and a real person from NEXA AI gets back to you. Questions, pricing, your setup - anything on your mind.</p></div>
        <ContactForm/>
      </div>
    </section>
    <ClosingCta line="Ready to skip the talk? Get Priced now."/>
  </PageShell>;
}

export default function Pages() {
  const path = location.pathname.replace(/\/$/, '');
  return path === '/pricing' ? <PricingPage/> : path === '/solutions' ? <SolutionsPage/> : path === '/about' ? <AboutPage/> : <ContactPage/>;
}
