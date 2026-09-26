# V8 homepage: the conversation as it was, the plan's sections underneath

V8 is the homepage that ships from `/`. It keeps the part of the site that was
liked, the V6 hero and the ChatGPT conversation that follows the scroll, and
puts under it the sections of the website plan (Content V3), in the language
of the plan's reference site, Conduit (conduit.app). The film version of the
conversation stays reachable at `/v7`, the previous homepage at `/v6`.

## The conversation (unchanged from the liked version)

1. **No player bar.** The chapter bar with Play, the progress track and the
   chapter labels is gone. The conversation moves with the scroll and with
   nothing else. Under the window, while the conversation is pinned, one pill:
   "Skip the conversation", with "or flick down" beside it on a mouse.
2. **Skipping.** The pill, or a flick of the wheel, runs the conversation to
   its end in 1.35 s and lands the page on the sections. A flick is a lot of
   travel in little time: at least 760 px of wheel within half a second, with
   no gap over 160 ms. A steady turn of a notched wheel, however long, reads on
   and never skips. The wheel event that completes the flick and the momentum
   after it are swallowed for 400 ms, so the page does not carry past the
   sections; a scroll back up cancels the glide at once. On phones the hint is
   hidden and the pill does the skipping; the keyboard skip button remains.
3. **"Watch a booking happen"** glides to the opening of the conversation and
   leaves the reader to scroll. There is no autoplay any more.
4. **Nothing reaches it.** The sections are scoped to `.s8`; a computed-style
   diff of the hero and the conversation against `/v6` finds no difference
   beyond 1 px of rounding where the pill row replaces the bar.

## The sections: the plan, in the reference's language

The plan's structure principle, "the home page tells the whole story, section
by section, in order; every section with more depth links to its expansion
page", and its section labels, "a small numbered eyebrow above every title,
like the reference", are followed literally. Under the conversation:

- **How it connects** (the connection; the legal side; "How it works legally"
  to the Connector page) and the **proof strip** (65%+ of the vote, the HVC
  win in Zurich 2026, 37 countries, 6 PMS integrations).
- **[01] The two words / Priced or unpriced.** The plan's title, "Two words
  decide who gets the booking", the PRICED and UNPRICED cards, each with the
  AI's actual answer, the closing line, the "ChatGPT can make mistakes"
  sentence and "Read the story" to About.
- **[02] How it works / The fix.** The dark section: the plan's title and
  subtitle, the four steps as numbered cards, the "installs nothing" line,
  "Watch now" to the How It Works page, "Watch a booking happen, step by step"
  back to the conversation.
- **[03] The product / NEXA AI Connector.** "One connection. Two kinds of
  guests. Both book direct." NEXA Direct (branded) and NEXA Agent
  (non-branded) with the plan's text, "Show me" to the Connector page.
- **[04] Pricing / The money.** The plan's title and stay; the numbers stay on
  the Pricing page, as instructed, with "Pricing" and "Run your own numbers".
- **[05] Who it is for / Hotels and vacation rentals.** The two cards, both to
  the Connector page.
- **[06] FAQ / Straight answers.** The plan's eight questions and answers; the
  cost answer points to the Pricing page instead of quoting numbers.
- **Get priced.** The closing panel: the plan's title, "Two short steps.
  Cancel anytime.", Get Priced, and the Contact line.
- The customers section is omitted, as the plan says to do until real quotes
  are approved.

From Conduit: a 1200 px column with 140 px between sections; the label row
"[01] LEFT" / "/ RIGHT" in 12 px uppercase mono over a hairline; a large light
display heading (Crimson Pro 400, 52 px, tight leading) beside its lead and
one small button; grey rounded cards (10 px, #f6f5f8) holding the product
visuals; one dark section with numbered cards; small 36 px buttons with the
arrow before the label; a full-width closing panel. Colour stays NEXA's: ink,
white, purple as the single accent.

## How it works: the pinned scene (the one thing that moves with the reader)

Lior's rule: a good site is understood even in Chinese by someone who does
not read Chinese. So "How it works" is told as a pinned scene, the way
Attio, Stripe and Apple tell a product story (references captured in the
session scratchpad, `refs/`): a stage stays on screen while the four steps
pass, and the same object runs through it. Step 1: the guest asks, in a
chat frame. Step 2: NEXA answers: the connection on top lights up
(Guest's AI, NEXA, Your PMS, with a pulse travelling along it), the reply
appears with the stay card, "Connected to NEXA AI". Step 3: the AI
recommends: the reply changes, the card gets a ring and a "Recommended"
tag. Step 4: the chat frame gives way to the property's own checkout with
the same stay, "Your stay", Pay $740, and "Reservation received in your
PMS". Then the stage releases and the page goes on.

On a desktop the whole panel (heading, the step list with the current step
lit, the stage) is position: sticky inside a tall section; progress is the
section's own scroll. On phones the stage sticks at the top and the steps
pass under it. Under reduced motion nothing pins and the ending shows. An
earlier version had a card floating over the text; it obscured the page
and was dropped for this.

## Tiles, the dark section, the money

As on the reference, every product visual sits on a tile: a soft wash with a
fine dot grid, the mock on it with a shadow, "Illustrative" in the corner.
Section 1 shows the AI's priced and unpriced answers; section 3 shows the AI
answering a branded and a non-branded question; section 4 shows the same stay
three ways with the commissions masked ("••%"), since the numbers belong to
the Pricing page. The footer is dark under the closing panel, as the
reference ends.

## The reading pass (the scroll effect over the text)

Every section heading, the closing line of section 1 and the closing panel's
title arrive in a quiet lavender grey. As a heading travels from 90% of the
viewport up to 45%, a soft highlight runs over its words in reading order and
every word it passes turns to ink; the key phrase (marked with `<em>`) turns
purple. The label above each section draws its purple baseline the same way.
The pass follows the scroll in both directions.

It is one scroll listener measuring a dozen elements (src/v8/pass.ts) and
CSS: each word is a span with its index, the heading carries `--p` and `--n`,
and `color-mix()` does the rest (src/v8/style.css, "The reading pass"). Text
is never hidden: the unread grey still reads. Under reduced motion, and
where `color-mix` is unsupported, the words are ink and the key phrase purple
from the start.

## Verified

- `v8test`: window closed on load, no bar, no overflow; pill hidden until
  pinned; a slow wheel and a steady wheel read on; a flick skips and does not
  carry past; the pill skips; Watch a booking happen glides to the opening and
  waits; every section present; the reading pass unread below the fold and
  read in the zone, key phrase purple, label line drawn; the stay card hidden
  before the conversation ends, riding fixed over the sections, docking into
  the checkout, lifting again on the way back; FAQ; Get Priced dialog;
  reduced motion; the old routes load without the V8 page. At 1440×900,
  1280×712, 390×844 and 358×694.
- Chat interactivity (`chat3`, `interact`), header, links, pages and the
  calculator unchanged. On phones the checkout card scrolls inside itself when
  its description is expanded, exactly as on V6 live.

## The Pricing page (src/v8/Pricing.tsx)

Built section by section from the pricing content spec, and designed from
the pricing pages of Stripe, Resend, Vercel, Linear, Attio, Mercury and
Lemon Squeezy (captured in `refs/`): one card style (white, bordered,
12 px), numbers set large and apart from their notes, diagrams that read
without words, a tight rhythm, no reading pass (a pricing page is scanned).
In order: what operators pay today (the five channels as a cost table with
the percentage set large, AI agents "not connected"); why the AI sends
guests to the OTAs (two flow diagrams, Guest to AI to OTA and Guest to AI
to NEXA to Your website, then the three steps each); the comparison in
cents (two dollar bars, then the two cards); how the price works (8.0% and
4.0% as large numerals, size and time, the example as a bill: start 8.0,
minus 0.5, minus 1.2, your rate 6.3, 2.3 when the guest asked); Find your
rate (two sliders with 16 ticks and end labels, the two rates as cards,
the steps line, the per-$1,000 line); sign up (the rate carried over; a
preview form, nothing is created yet); every rate in one 16 by 16 table
with the selection marked; the questions hotels ask; the fine print and
sources. Percent everywhere except the cents; regular hyphens, straight
quotes, no exclamation marks. `pricing8` checks the defaults, both edges, a
mid case, the table corners, the copy rules, the preview form, overflow and
console errors at 1440 and 390.
