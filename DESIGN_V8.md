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

- **How it connects**: one connection panel on the page's grey tile,
  readable without its words: the PMS systems in one white card on the left
  (Guesty, Hostaway, BoomNow, Hospitable, Rentals United, HotelSync, each
  with a small system glyph), the AI agents in a white card on the right
  (ChatGPT, Gemini, Claude, Perplexity), and NEXA between them as a flat
  white tile with a violet outline and the purple wordmark, "One connection"
  under it. Two dotted hairlines join them, each with one slow violet dot.
  Under it the two claims, "Connects through the PMS you already run" and
  "A direct booking, on paper as well", with "How it works legally" to the
  Connector page; then the **proof strip** (the HVC win in Zurich 2026 with a
  small gold medal, 65%+ of the vote, 37 countries, 6 PMS integrations).
- **[01] The two words / Priced or unpriced.** The plan's title, "The same
  apartment, the same dates, the same guest asking", then one comparison
  frame on the grey tile, split by a hairline, its rows shared across the
  divider so the eye compares content, not paint (Apple's compare page,
  Mercury's vs-table, Plausible's greyed loser): "01 / Unpriced" with a grey
  dot on the left and "02 / Priced" with a violet dot on the right, the
  NEXA tile beside "Priced."; the same balcony photo in colour
  with a "Priced through NEXA" tag, and in grey at 55% with "Not connected";
  ChatGPT's one-line answer; then the table: Availability "Available, May
  1-5" against a dash, Final price "$328 final total" against a dash, Where
  the guest books "seanrent.com, direct" against "Sent to Booking.com ·
  Airbnb · Expedia" in grey (named, never linked); the site's ink button
  "Book direct on seanrent.com" against an empty dashed slot; and the
  verdict lines, ink and grey. No green, no red: the colour photo, two dots,
  three small violet checks and one button carry the verdict. Then the
  closing line, the "ChatGPT can make mistakes" sentence and "Read the
  story" to About.
- **[02] How it works / The fix.** The dark section: the plan's title, then
  the travelling stage described below, and the landing block "Booked. On
  your website. In your PMS." with the "installs nothing" line, "Watch now"
  to the How It Works page, "Watch a booking happen, step by step" back to
  the conversation.
- **[03] The product / NEXA AI Connector.** "One connection. Two kinds of
  guests. Both book direct." No chat screens here: NEXA Direct, "The guest
  asked for you by name", and NEXA Agent, "The AI found you a guest" (the
  Pricing page's wording), each explained as a flow: what the guest asked
  for (the words that found the property highlighted), the AI with NEXA
  behind it, your website. Direct shows the OTA listing of your own property
  struck out underneath; Agent shows the AI picking from what is priced (you,
  priced; others, unpriced). One sentence on what happens today and what
  NEXA changes, two facts as pills (your name, your booking / a guest you
  would not have had; the lower / the higher rate), and a bar: both book on
  your website, only the rate differs, the rates on the Pricing page.
  "Show me" to the Connector page.
- **[04] Pricing / The money.** The plan's title and the same stay, then
  "where the money goes" as three bars: the whole bar is the guest's
  payment, "Stays with you" in green, and the coloured end is the commission,
  red for the OTA, purple for NEXA Direct and NEXA Agent. The bars carry no
  numbers and grow with the scroll; the numbers stay on the Pricing page, as
  instructed, with "Pricing" and "Run your own numbers".
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

## The seed (the one small thing that moves, and the stage)

Two flights were tried and dropped: the guest's question as a text bubble
(not an object) and NEXA's sphere flying from the connection panel to the
stage across four sections (too long and in the way). What stayed, at
Ben's direction: the same flat NEXA tile from the connection panel has a
second home in [01], in the Priced column beside the word "Priced.", placed
by `Traveler.tsx` on the exact vertical line of the NEXA node on the
How-it-works stage below. As the reader scrolls on, the tile lifts off and
hangs at the exact height where that node will sit once the stage sticks,
while the rest of the frame, the statement, the "ChatGPT can make
mistakes" line and the [02] heading pass under it; the stage rises to meet
it and, over the last third of the way, the tile shrinks into the 16px
mark inside the NEXA node, which takes over. Straight down the same line,
scrubbed by the scroll, so it climbs back the same way. The column keeps a
dashed outline where it left. Under 1000px and under reduced motion the
tile is a still in the column (hidden on phones) and the mark is simply
there. [01] reads Unpriced first, Priced second, so the tile sits on the
right, above the stage's column.

Inside the stage, after a critique round: the AI-to-AI exchange panel slides
away as the answer card lands in step 2 (it used to cover the card); in step
3 the chat anchors to its newest lines so "Book it." and the direct link are
in view; on phones the stage is opaque (#16151f) and sticks at 12px, since
the phone header scrolls away, tall enough (62vh, up to 500px) for the paid
checkout and the PMS ticket, and the "Booked" block is rendered a second
time after the stage's range so it can be read in the clear. The seed aims
at the node's 16px mark where it is at that moment, so it rides down onto
the node as the stage arrives.

## How it works: the travelling stage

Lior's rule: a good site is understood even in Chinese by someone who does
not read Chinese. So "How it works" is told on a stage that travels with
the reader, the way Attio, Mercury and Clay tell a product story
(references captured in the session scratchpad, `refs/`): the four steps
scroll past on the left, the stage sticks on the right, and each step
happens on it. Step 1: the guest types the question into a chat frame.
Step 2: NEXA and the AI talk: the connection on top pulses (Guest's AI,
NEXA, Your PMS), a panel slides in with the exchange, line by line
("Availability, May 1-5, 2 adults?", "Available: Coastal Panorama
Apartment.", "Final price?", "$740 total. Best-price guarantee.", "Where
does the guest book?", "seanrent.com/checkout, direct."), and the reply
lands with the stay card. Step 3: the AI recommends: the reply changes, the
card gets a purple ring and a "Recommended" tag, the guest answers "Book
it." and the AI gives the direct link. Step 4: the chat gives way to the
property's own checkout, a cursor moves to the button and presses it, the
button turns green ("Paid · booking confirmed") and the reservation ticket
appears in the PMS. Then the steps end at "Booked", the stage docks beside
it and stops following; the page goes on.

On a desktop the stage is position: sticky inside the two-column body, so
it holds its place while the steps pass and stops where the body ends,
beside the landing block. The current step is read from the step blocks'
position against a line at 55% of the viewport. On phones the stage sticks
under the header and the steps pass under it; once answered, the question
folds to one line so the reply and the card fit. Under reduced motion
nothing sticks and the ending shows. Earlier versions (a card floating over
the text; a stage that showed the steps but not the exchange) were dropped.

## Tiles, the dark section, the money

As on the reference, every product visual sits on a tile: a soft wash with a
fine dot grid, the mock on it with a shadow, "Illustrative" in the corner.
The colour budget follows Conduit: ink, three greys and one accent, the
violet. Bad states are dimmed (grey text, a greyed photo, a dash), never
painted red; the only green left is the paid button inside the stage.
Surfaces are flat: grey tiles (#f6f5f8, 10px) with no gradient, white mocks
with a 1px border and no drop shadow; the dot grid survives only on the
money tile. One column for the whole page (1280px, the hero's and footer's),
three serif sizes (52 / 34 / 26), the lead starting on the heading's cap
height. Section 1 is the comparison frame above; section 3 explains the two
kinds of guests as flows; section 4 shows the same stay three ways as money
bars without numbers (grey track, ink for the OTA's cut, violet for NEXA's),
since the numbers belong to the Pricing page. The footer carries no version
links. The footer is dark under the closing panel, as the
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
  read in the zone, key phrase purple, label line drawn; the stage: step 1
  the question alone, step 2 the exchange panel and the answer card with the
  stage in place, step 3 the recommendation, "Book it." and the link, still
  in place, step 4 the checkout paid green and the PMS ticket, step 5
  "Booked" lit, and past the end the stage docked inside its section; the
  connection panel with its two cards, the tile and the dots; the comparison
  frame with values against dashes, the OTAs named, the photo greyed, no
  green or red, its two columns sharing their rows; the money bars grown
  with the OTA's the widest; [03] as two flows with no chat screens; the
  medal; no version links in the footer; the seed resting beside the [02]
  heading in the stage's lane, sliding halfway still in its lane, shrinking
  onto the NEXA node within a few pixels and handing over to the node's
  mark, and a still on phones; the phone Pay button with a height at step 4;
  FAQ; Get Priced dialog; reduced motion; the old routes load without the V8
  page. At 1440×900, 1280×712, 390×844 and 358×694.
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
