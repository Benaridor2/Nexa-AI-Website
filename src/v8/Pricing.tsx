import { useEffect, useRef, useState } from 'react';
import { Arrow } from '../v6/Scenes';
import { PageShell } from '../v6/Shell';
import { SectionLabel, PMS } from './Sections';
import { useReadingPass } from './pass';

// The Pricing page, section by section from the content spec: what operators
// pay today, why the AI sends guests to the OTAs, the comparison in cents, how
// the price works, the two sliders, sign up, every rate in one table, the
// questions hotels ask, the fine print. Numbers live here and nowhere else.
//
// The model: a percentage of room revenue on the stays the AI booked, paid
// after checkout. 8.0% when the AI found the guest, 4.0% when the guest asked
// for the property; minus a tenth of a point for every unit step and every
// commitment step, 15 of each.

export const UNIT_TIERS = ['Under 50', '50-74', '75-99', '100-149', '150-249', '250-499', '500-749', '750-999', '1,000-2,499', '2,500-4,999', '5,000-9,999', '10,000-24,999', '25,000-49,999', '50,000-99,999', '100,000-249,999', '250,000+'];
export const MONTH_TIERS = ['Month to month', ...Array.from({ length: 15 }, (_, i) => `${(i + 1) * 2} months`)];
export const foundRate = (steps: number) => 8 - steps / 10;
export const askedRate = (steps: number) => foundRate(steps) - 4;
const pct = (rate: number) => `${rate.toFixed(1)}%`;
const perThousand = (rate: number) => `$${Math.round(1000 * rate / 100)}`;

const CHANNELS: [string, string, boolean][] = [
  ['Booking.com', '15-25% commission, and more to be seen. Also on cleaning fees, and on cancellations you charged for.', true],
  ['Expedia', '15-30% commission, and more to be seen. Accelerator: pay more for placement.', true],
  ['Airbnb', '15.5% host-only fee, for software-connected hosts, 2026.', true],
  ['Google Hotel Ads', 'Per click, booked or not. Pay per stay retired in 2025.', true],
  ['AI agents (ChatGPT, Gemini, Claude, Perplexity)', '15-25% paid to an OTA. The AI trusts the OTAs, so it sends your guest to them.', false],
];

const TODAY: [string, string][] = [
  ['A guest asks an AI agent.', '"4 nights in Lisbon in May, near the river, under $250 a night."'],
  ['The AI goes with what it trusts.', "It knows the big names, like Booking.com and Expedia. It can't see your live rates, so it doesn't send the guest to your website."],
  ['The guest books you on an OTA.', 'You pay 15-25% commission, even when the guest asked for you by name. The guest is theirs.'],
];
const WITH_NEXA: [string, string][] = [
  ['The same guest asks.', 'The same question, to the same AI.'],
  ['The AI sees your live rates.', 'NEXA gives every AI agent your live rates and availability, straight from your PMS. Now it can trust your website.'],
  ['The guest books on your website.', 'No OTA in between. The guest, the email and the next booking are yours.'],
];

const QUESTIONS: [string, string][] = [
  ['What is the rate charged on?', 'The room revenue of the stay: what the guest paid for the room. At 6.3%, a $1,000 stay costs you $63. Never on taxes, cleaning or extras.'],
  ['What counts as a unit?', 'A hotel room or an apartment connected to NEXA, counted across your whole portfolio.'],
  ['What does "asked for you" mean?', 'The guest named your property or your brand before the AI suggested it, or an AI agent came in through your own website.'],
  ['What if I add units?', 'Your rate drops from the next month. If you remove units, it follows the new count.'],
  ['What happens when my commitment ends?', 'You renew on the same steps, or you move to month to month.'],
  ['Can I leave before my commitment ends?', 'Yes. The month-to-month rate applies to the months you used.'],
];

function Slider({ id, label, helper, value, tiers, onChange, shown }: { id: string; label: string; helper: string; value: number; tiers: string[]; onChange: (v: number) => void; shown: string }) {
  return <div className="rate-slider">
    <div className="rate-slider-head"><label htmlFor={id}>{label}</label><b>{shown}</b></div>
    <input id={id} type="range" min={0} max={tiers.length - 1} step={1} value={value} onChange={e => onChange(Number(e.target.value))} aria-valuetext={`${shown}, step ${value} of ${tiers.length - 1}`}/>
    <div className="rate-slider-foot"><span>Step {value} of {tiers.length - 1}</span><span>{helper}</span></div>
  </div>;
}

export default function PricingPage() {
  const [units, setUnits] = useState(5);
  const [months, setMonths] = useState(12);
  const [created, setCreated] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useReadingPass(root, !matchMedia('(prefers-reduced-motion: reduce)').matches);
  const steps = units + months;
  const found = foundRate(steps), asked = askedRate(steps);
  const unitsLabel = `${UNIT_TIERS[units]} units`, monthsLabel = MONTH_TIERS[months];
  const stepsLine = steps === 0 ? 'No steps yet. Move either one.' : steps === 30 ? '30 of 30 steps: the lowest rate there is' : `${steps} of 30 steps: ${(steps / 10).toFixed(1)} points off`;
  const goTo = (id: string) => (event: React.MouseEvent) => { event.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  useEffect(() => { setCreated(false); }, [units, months]);

  return <PageShell page="pricing" title="Pricing">
    <div className="s8 s8-page pricing8" ref={root}>

      <section className="s8-section wrap pricing-hero" aria-labelledby="pricing-title">
        <p className="s8-n">Pricing</p>
        <h1 id="pricing-title" data-pass>You pay <em>15 to 30%</em> to be found.</h1>
        <p className="s8-lead">Guests look for a place to stay on Booking.com, Expedia, Airbnb and Google. So you connected to all of them, and each one takes its cut.</p>
        <div className="channels" role="table" aria-label="What each channel costs">
          <div className="channels-row is-head" role="row"><span role="columnheader">Where guests look</span><span role="columnheader">What it costs you</span><span role="columnheader">Your listings</span></div>
          {CHANNELS.map(([name, cost, connected]) => <div className={`channels-row${connected ? '' : ' is-off'}`} role="row" key={name}><b role="cell">{name}</b><span role="cell">{cost}</span><i role="cell"><em>{connected ? 'Connected' : 'Not connected'}</em></i></div>)}
        </div>
      </section>

      <section className="s8-section wrap" id="why" aria-labelledby="why-title">
        <SectionLabel n="01" left="Today" right="Why the AI sends guests to the OTAs"/>
        <div className="s8-head">
          <h2 id="why-title" data-pass>Guests now ask AI. <em>The AI sends them to the OTAs.</em></h2>
          <div><p className="s8-lead">Not because the OTAs are better. Because the AI trusts them, and it can't see your live rates.</p></div>
        </div>
        <div className="journeys">
          <div className="journey"><p className="s8-n">Today</p><ol>{TODAY.map(([t, d], i) => <li key={t}><span className="journey-n">{i + 1}</span><div><b>{t}</b><p>{d}</p></div></li>)}</ol></div>
          <div className="journey is-nexa"><p className="s8-n">With NEXA</p><ol>{WITH_NEXA.map(([t, d], i) => <li key={t}><span className="journey-n">{i + 1}</span><div><b>{t}</b><p>{d}</p></div></li>)}</ol></div>
        </div>
      </section>

      <section className="s8-section wrap" id="cents" aria-labelledby="cents-title">
        <SectionLabel n="02" left="The comparison" right="In cents"/>
        <div className="s8-head">
          <h2 id="cents-title" data-pass>NEXA takes 1 to 8 cents per booking dollar. <em>An OTA takes 15 to 25.</em></h2>
        </div>
        <div className="s8-cards s8-two cents">
          <article className="s8-card is-ota"><span className="s8-n">Through an OTA</span><p className="cents-big">15-25¢ <small>of every booking dollar</small></p><p className="cents-keep">You keep 75-85¢.</p><ul><li>On the whole bill: cleaning fees, extras, and cancellations you charged for.</li><li>The guest, the email and the next booking are theirs.</li><li>1 in 2 Booking.com reservations cancel (D-Edge).</li></ul></article>
          <article className="s8-card is-nexa"><span className="s8-n">Through NEXA</span><p className="cents-big">1-8¢ <small>of every booking dollar</small></p><p className="cents-keep">You keep 92-99¢.</p><ul><li>Only on the room, only after checkout.</li><li>The guest, the email and the next booking are yours.</li><li>Direct guests come back 4 times as often (Bookboost).</li></ul></article>
        </div>
        <p className="s8-statement" data-pass>On a $1,000 stay: <em>$10 to $80 with NEXA.</em> $150 to $250 through an OTA.</p>
      </section>

      <section className="s8-section wrap" id="how-our-price-works" aria-labelledby="how-title">
        <SectionLabel n="03" left="How our price works" right="The model"/>
        <div className="s8-head">
          <h2 id="how-title" data-pass>How our <em>price</em> works.</h2>
          <div><p className="s8-lead">You pay a percentage of room revenue, only after the guest has stayed. Where you start depends on how the guest found you. Two numbers you choose bring it down.</p></div>
        </div>
        <p className="s8-n how-n">Where you start</p>
        <div className="s8-cards s8-two starts">
          <article className="s8-card"><span className="s8-n">The AI found you a guest</span><p className="start-rate">8.0% <small>of room revenue</small></p><p>A guest who didn't ask for you. The AI recommended you, and they booked.</p></article>
          <article className="s8-card"><span className="s8-n">The guest asked for you</span><p className="start-rate">4.0% <small>of room revenue</small></p><p>They named your property or your brand, or came in through your own website. Your name did part of the work, so you pay 4 points less.</p></article>
        </div>
        <p className="s8-n how-n">What brings it down</p>
        <div className="s8-cards s8-two starts">
          <article className="s8-card"><span className="s8-n">Your size</span><h3>Every room and every apartment is one unit.</h3><p>The more units you connect across your portfolio, the lower your rate. 15 steps, from 50 units to 250,000.</p></article>
          <article className="s8-card"><span className="s8-n">Your time</span><h3>Trust takes time.</h3><p>Commit, and we count it from day one. Every 2 months you commit is a step. 15 steps, up to 30 months.</p></article>
        </div>
        <div className="s8-tile worked">
          <div className="worked-card">
            <p className="s8-n">Every step takes a tenth of a point off your rate. The example: a 300-room hotel on a 24-month commitment.</p>
            <p className="worked-sum"><span><b>8.0%</b><small>start</small></span><i>-</i><span><b>0.5%</b><small>300 rooms: 5 steps</small></span><i>-</i><span><b>1.2%</b><small>24 months: 12 steps</small></span><i>=</i><span className="is-result"><b>6.3%</b><small>the AI found you a guest</small></span></p>
            <p className="worked-line">And <b>2.3%</b> when the guest asked for you. All 30 steps: <b>5.0%</b> and <b>1.0%</b>.</p>
          </div>
        </div>
        <ul className="promises">
          <li><b>Only after checkout</b><span>Nothing is billed until the guest has stayed. Invoiced the month after.</span></li>
          <li><b>Only on the room</b><span>Never on taxes, cleaning, extras, cancellations or no-shows.</span></li>
          <li><b>No booking, no fee</b><span>No setup fee, no monthly fee, no minimum.</span></li>
          <li><b>The guest is yours</b><span>Booked on your website, in your PMS. So is their next stay.</span></li>
        </ul>
      </section>

      <section className="s8-section wrap" id="find-your-rate" aria-labelledby="rate-title">
        <SectionLabel n="04" left="Find your rate" right="Two numbers"/>
        <div className="s8-head">
          <h2 id="rate-title" data-pass>Find <em>your</em> rate.</h2>
          <div><p className="s8-lead">Move both. Every step takes a tenth of a point off both rates.</p></div>
        </div>
        <div className="s8-tile finder">
          <div className="finder-card">
            <div className="finder-inputs">
              <Slider id="units" label="Units you connect" helper="Rooms and apartments, across your portfolio." value={units} tiers={UNIT_TIERS} onChange={setUnits} shown={unitsLabel}/>
              <Slider id="months" label="Months you commit" helper="Counted from your first day." value={months} tiers={MONTH_TIERS} onChange={setMonths} shown={monthsLabel}/>
            </div>
            <div className="finder-result" aria-live="polite">
              <p className="s8-n">Your rate, of room revenue</p>
              <div className="finder-rates"><div><b data-rate="found">{pct(found)}</b><span>when the AI found you a guest</span></div><div><b data-rate="asked">{pct(asked)}</b><span>when the guest asked for you</span></div></div>
              <p className="finder-steps" data-steps>{stepsLine}</p>
              <p className="finder-thousand">On every $1,000 of room revenue: <b data-thousand>{perThousand(found)} or {perThousand(asked)}</b>. Through an OTA: $150 to $250.</p>
              <div className="s8-actions"><a className="s8-button" href="#sign-up" onClick={goTo('sign-up')}><Arrow diagonal/>Sign up at this rate</a><a className="s8-link" href="#every-rate" onClick={goTo('every-rate')}>See every combination <Arrow/></a></div>
            </div>
          </div>
        </div>
      </section>

      <section className="s8-section wrap" id="sign-up" aria-labelledby="signup-title">
        <SectionLabel n="05" left="Sign up" right="Your rate"/>
        <div className="s8-head">
          <h2 id="signup-title" data-pass>Let the AI <em>book you directly.</em></h2>
          <div><p className="s8-lead">Your rate is set. Create your account, and connect your listings.</p></div>
        </div>
        <div className="signup">
          <div className="signup-side">
            <div className="signup-rate">
              <p className="s8-n">Your rate</p>
              <div className="finder-rates"><div><b data-signup="found">{pct(found)}</b><span>the AI found you a guest</span></div><div><b data-signup="asked">{pct(asked)}</b><span>the guest asked for you</span></div></div>
              <p className="signup-selection">{unitsLabel} · {monthsLabel} <a href="#find-your-rate" onClick={goTo('find-your-rate')}>Change</a></p>
            </div>
            <ol className="signup-steps">
              <li><b>Create your account.</b><span>Your rate is on it from day one.</span></li>
              <li><b>Connect your PMS.</b><span>That's where your live rates and availability come from.</span></li>
              <li><b>AI agents can book you directly.</b><span>The guest books on your website, and lands in your PMS.</span></li>
            </ol>
            <p className="signup-note">No setup fee, no monthly fee, no minimum.</p>
          </div>
          <form className="signup-form" onSubmit={event => { event.preventDefault(); setCreated(true); }}>
            <label><span>Full name</span><input name="name" autoComplete="name" required/></label>
            <label><span>Work email</span><input name="email" type="email" autoComplete="email" required/></label>
            <label><span>Company</span><input name="company" autoComplete="organization" required/></label>
            <label><span>PMS</span><select name="pms" defaultValue="" required><option value="" disabled>Choose your PMS</option>{PMS.map(name => <option key={name}>{name}</option>)}<option>Other</option></select></label>
            <input type="hidden" name="units" value={UNIT_TIERS[units]}/><input type="hidden" name="months" value={MONTH_TIERS[months]}/>
            <button type="submit" className="s8-button"><Arrow diagonal/>Create my account</button>
            <p className="form-status" role="status">{created ? 'Preview only: account creation is not connected yet, so nothing was created.' : ''}</p>
            <p className="signup-portfolio">Running a group or a chain? <a href="/contact">Talk to us about a portfolio.</a></p>
            <p className="signup-terms">By creating an account, you agree to the Terms and the Privacy Policy.</p>
          </form>
        </div>
      </section>

      <section className="s8-section wrap" id="every-rate" aria-labelledby="table-title">
        <SectionLabel n="06" left="Every rate" right="One table"/>
        <div className="s8-head">
          <h2 id="table-title" data-pass>Every rate, <em>in one table.</em></h2>
          <div><p className="s8-lead">One row down or one column right: a tenth of a point less. In percent of room revenue.</p></div>
        </div>
        <div className="rate-table-wrap">
          <table className="rate-table">
            <caption className="sr-only">Rates by units connected and months committed. Each cell shows the rate when the AI found you a guest, then the rate when the guest asked for you.</caption>
            <thead><tr><th scope="col"><span>Units</span><span>Months</span></th>{MONTH_TIERS.map((m, j) => <th scope="col" key={m} className={j === months ? 'is-current' : ''}>{j === 0 ? 'Month to month' : m.replace(' months', '')}</th>)}</tr></thead>
            <tbody>{UNIT_TIERS.map((u, i) => <tr key={u}><th scope="row" className={i === units ? 'is-current' : ''}>{u}</th>{MONTH_TIERS.map((m, j) => <td key={m} className={i === units && j === months ? 'is-selected' : i === units || j === months ? 'is-current' : ''}><b>{foundRate(i + j).toFixed(1)}</b><span>{askedRate(i + j).toFixed(1)}</span></td>)}</tr>)}</tbody>
          </table>
        </div>
        <p className="rate-table-note">Under 50 units on month to month: 8.0 and 4.0. 250,000+ units on 30 months: 5.0 and 1.0. Your selection is marked.</p>
      </section>

      <section className="s8-section wrap" id="questions" aria-labelledby="questions-title">
        <SectionLabel n="07" left="Questions" right="Hotels ask"/>
        <div className="s8-faq-grid">
          <div><h2 id="questions-title" data-pass>Questions <em>hotels ask.</em></h2><div className="s8-actions questions-actions"><a className="s8-button" href="#sign-up" onClick={goTo('sign-up')}><Arrow diagonal/>Sign up at your rate</a><a className="s8-link" href="/contact">Talk to us about a portfolio <Arrow/></a></div></div>
          <div className="s8-faq">
            {QUESTIONS.map(([q, a], i) => <details key={q} open={i === 0}><summary><span className="s8-n">{String(i + 1).padStart(2, '0')}</span>{q}<i aria-hidden="true"/></summary><p>{a}</p></details>)}
          </div>
        </div>
      </section>

      <section className="s8-section wrap fine-print" aria-label="Fine print">
        <p className="s8-n">Fine print</p>
        <p>A unit is a hotel room or an apartment connected to NEXA, counted across your portfolio at the start of each month. Commitment months are counted from your first day. Your rate is 8.0% of room revenue, minus 0.1 for each unit step and each month step, on stays the AI booked for guests who did not ask for you; 4 points lower when the guest asked for you by name or reached NEXA through your own website, metered per AI conversation and capped at that rate. Paid the month after checkout, only on stays that happened.</p>
        <p className="s8-n">Sources</p>
        <p>Booking.com: typical commission range in 2026; Preferred Partner and Visibility Booster add commission for visibility; commission also applies to cleaning, pet and extra-guest fees and to cancellations charged to the guest (Booking.com Partner Help). Expedia: 15-30%; Accelerator adds compensation for placement (Expedia Group). Airbnb: software-connected hosts moved to a 15.5% host-only fee (2026). Google Hotel Ads: commission per stay retired February 20, 2025. Cancellations: D-Edge, Booking Holdings 50%, direct 18%. Returning guests: Bookboost, 2.2M guest records.</p>
      </section>

    </div>
  </PageShell>;
}
