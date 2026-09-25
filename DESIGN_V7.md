# V7 homepage: built from what the best sites actually do

The previous homepage is preserved at `/v6`. This one replaces `/`.

## The research behind it

Four studies, all from pages read on 2026-09-25 (reports and raw HTML in the session scratchpad; sources listed at the end):

1. **20 admired product homepages** rendered and measured (Stripe, Linear, Vercel, Mercury, Notion, Figma, Framer, Raycast, Resend, Clerk, Cursor, Loom, Attio, Arc, Cal.com, Superhuman, Granola, Anthropic, ElevenLabs, Runway).
2. **50 award winners** (Awwwards Site of the Year / Month / Day 2024–2026, FWA, CSSDA) with their live HTML.
3. **17 AI product sites and 25 hospitality-tech sites**, including the new AI-booking entrants (Lighthouse, DirectBooker, OnSeason, SiteMinder AI Distribution, The Hotels Network).
4. **Technique sources**: GSAP, Lenis, Chrome and WebKit docs, NN/g, WCAG, Apple/Stripe/Linear source code, design critiques of "AI-looking" sites.

Plus about 300 screenshots of the same sites, taken in a real browser at 1440×900 and 390×844.

## What the best product sites have in common (counts from study 1, n = 20)

- **Structure:** header → hero → logo/trust strip (14/20 directly under the hero) → 3–5 feature sections, each a heading beside a real product visual → proof (quotes 14/20, stats 9/20) → final CTA band (18/20) → large footer. Median length ≈ 10.5 screens, 12 sections.
- **Hero:** headline median 6 words (15/20 ≤ 7); 48–64px on desktop (median 58); a one-sentence sub on 15/20; two buttons on 12/20, the primary black on 11/20; text left-aligned on 12/20. The visual is the product: a muted video loop (9/20), a screenshot or DOM mock (5/20) or an interactive mock (4/20). Zero stock photography.
- **Product further down:** real UI (17/20), short muted loops (8/20), tabs (7/20). Scroll-pinned sequences: 2/20. GSAP: 1/20. Lenis: 1/20. Three.js: 0.
- **Type:** sans headlines 17/20, with a mono second voice 13/20; body 16px; H2 30–56px; the closing CTA often 72–88px.
- **Colour:** light pages 14/20; black or white buttons 11/20; the brand colour confined to one button or one section. Gradients on 3/20.
- **Absent:** pricing tables in the hero (0), 3-column icon rows (0), hero carousels (0), sound (0), custom cursors (0), dark-mode toggles (0), stock photos of people (0).

Award winners (study 2) differ in surface (full-screen video or WebGL heroes, Lenis on 21/50, preloaders on 24/50), but agree on the fundamentals: one-line headlines of 1–7 words, two-swatch palettes, grotesk headlines with mono labels, the product shown as motion in section 2–3, calculators and comparison tables on the homepage. Product winners skip the custom cursors and preloaders.

## How chat products show a conversation (study 3, n = 17)

- 12/17 put the demo **in the hero**, at about 45–50% of the width in two-column heroes (Claude, Notion, Mews).
- Built as a **DOM animation or mock** (Cursor, Glean, Decagon, Mistral) or a **muted loop** (Claude 25.6s, Notion 6s). No controls, no sound; loops of 6–26 seconds; Intercom pauses its demo off-screen.
- Nobody scroll-drives a conversation. The technique study's recommendation: a self-playing DOM animation, then hold the final state with a replay; a static transcript under reduced motion.
- The best endings show **a property card with dates, live availability, final price and the direct link** (SiteMinder's AI page, OnSeason, DirectBooker's ChatGPT screenshots).

## What hospitality operators expect (study 3, group 2)

- The best-looking vendors (Mews, Cloudbeds, Canary, Hospitable, Lighthouse) lead with an outcome headline, one sentence and "Book a demo", then trust: property counts, PMS/OTA integrations with names, KPI cases, awards.
- The AI-booking entrants state the commercial model in words ("pay only when a booking is made", "zero commissions", "cut commissions by 5x").
- To avoid: looking like a PMS (feature grids, dozens of logos), "Powered by AI" wallpaper, logo-carousel heroes, unverified counters, badge clutter, stock photos, a text-only illustrative conversation, long player videos.

## Decisions for NEXA

1. **The ChatGPT conversation is the hero visual, self-playing.** Right column on desktop (about half the width), full width on phones. It starts when at least half of it is on screen, plays the whole booking in about 24 seconds, pauses off-screen, and ends on the property's own checkout. Replay and pause controls. Under reduced motion it shows the finished answer with the two priced cards. After the film the window is interactive as before: chips, edits, follow-up requests, the checkout, the gallery. No purple doors, no glow.
2. **Plain scrolling.** No smooth-scroll library, no pinned scenes, no scroll-driven text. Sections fade in once and stay.
3. **The page:** header · hero with the conversation · trust strip (PMS names, countries, the award) · Priced vs Unpriced as two real AI answers side by side · How it works in four numbered steps · Direct and Agent · Your website, your checkout · a dark proof section with the founding line · a pricing teaser (numbers stay on the Pricing page) · who it is for · FAQ · closing CTA · footer. About 10 screens.
4. **Type:** Geist for headlines and text (a grotesk, like 17/20 of the set), Geist Mono for labels and data, Crimson Pro only for the one pull quote. H1 64px desktop / 40px phones, −0.02em; H2 44–56px; body 17px.
5. **Colour:** white page, ink text, black primary buttons; NEXA purple as the single accent (links, the PRICED state, one highlight); one dark section for proof. No gradients, halos or blur.
6. **Copy:** approved copy only. Headline: "Your next guest is asking an AI. Be the answer." Prices appear only on the Pricing page. The conversation and checkout remain labelled illustrative; nothing is submitted or booked.

## Sources

Study reports (with every URL read) are in the session scratchpad: `research/saas.md`, `research/awards.md`, `research/ai-hospitality.md`, `research/techniques.md`. Key references: https://linear.app/ · https://stripe.com/ · https://www.notion.com/ · https://attio.com/ · https://claude.com/ · https://cursor.com/ · https://www.mews.com/en · https://www.siteminder.com/ai-distribution/ · https://www.mylighthouse.com/ · https://www.directbooker.ai/ · https://www.awwwards.com/websites/sites_of_the_year/ · https://www.nngroup.com/articles/scrolljacking-101/ · https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html · https://designmd.cc/benchmarks/linear · https://designmd.cc/benchmarks/stripe.
