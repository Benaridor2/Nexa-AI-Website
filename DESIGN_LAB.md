# Lab: the Nexa fold (experimental homepage)

An experimental homepage concept, isolated from the live site. It is served at
`/lab` on this branch (`claude/nexa-layer-lab`) and its Vercel preview. The
current homepage, the inner pages and `/v1`–`/v5` are untouched.

## How to return to the previous version

- **The live site is unchanged.** `main` and production still serve commit `03423d5`.
- **The checkpoint** is the branch `claude/checkpoint-v6-live-2026-09-25`, frozen at that same commit (the V6 homepage, the inner pages and `/v1`–`/v5`). A local tag of the same name exists but could not be pushed.
- **On this branch**, `/` is still the current homepage; the concept lives only at `/lab`.
- **To remove the experiment entirely**, delete `src/lab/` and `public/lab/`, the `isLab` lines in `src/main.tsx`, the `/lab` rewrite in `vercel.json`, and the two added font packages.

## Isolation

- **Code:** everything is in `src/lab/`, with its own components, motion, styles and data. It reuses `src/v6/listings.json` read-only.
- **Styles:** `lab.css` is loaded only on `/lab`, through the same per-route dynamic import every version uses. Its rules are scoped to `.lab`, apart from `body:has(.lab)`.
- **Fonts:** Instrument Serif and Mona Sans are imported inside the lab bundle, so no other page downloads them.
- **Tested:** the current homepage makes no request for lab code, styles or fonts, and `/v1`–`/v5`, `/pricing`, `/how-it-works` and `/nexa-ai-connector` load as before. The existing test suite passes on this branch: the chat player, the chat, the header, links, the inner pages and the calculator.

## The concept

**One object carries the story: the fold.** A property is presented as a three-panel card hinged like an accordion.

| Panel | What it is | What it holds |
|---|---|---|
| 1. The place | a mounted photograph | what a guest sees |
| 2. The Nexa layer | the violet lining inside the fold | availability, final price and booking route, **from the PMS** |
| 3. The offer | what an AI can put in front of the guest | available, final price, book direct on the property's own website |

The same object has three readings:

- **Closed:** only the place shows, with a thin violet seam at the fold. This is the brand's smallest form.
- **Half open, seen from above:** the zigzag profile draws the N of the Nexa mark, which is itself two blades meeting at a point.
- **Open flat:** the whole record reads like one page.

**The honest metaphor.** The layer is the inside of the fold, not a scan of the photograph. The threads that feed it start at "Your PMS". The data never appears to come from the picture.

**The seam** is the thin violet line of the layer. It carries through the site:

- the thread from the headline into the fold;
- the PMS threads;
- the primary button's lower edge;
- the scene's progress bars;
- the spine of every closed card;
- the dialog's spine.

**Threads** use the mark's geometry: straight runs joined by one slanted segment at the mark's angle. There are no free curves and no glowing halos.

## Visual world

- **Place, in daylight:** limestone, warm wall light falling through three arches at the mark's slant, and a floor the fold stands on and casts shadows onto.
- **System, at night:** a warm dark room with one pool of light, where the violet lining is the only saturated colour.
- **Violet** appears where Nexa's connection exists (the layer, the threads, the direct route). An unpriced property has none: it turns clay.
- **Type:**
  - **Instrument Serif** for places and people: property names, the guest's question, "Your website. Your checkout. Your guest."
  - **Mona Sans** at wide settings for Nexa's voice.
  - **Geist Mono** for data.
- **Photography:** the Sea N' Rent fixture photographs, graded warmer and slightly desaturated so they sit together. The Pearl of Jaffa is the one property followed through the page.

## The central experience (`Scene.tsx`)

**One sticky scene, four chapters, the same object throughout.** Scroll picks the chapter; each chapter then plays on its own clock, so a fast scroll never lands on a half-drawn frame. Tabs jump between chapters, and toggles drive the states directly.

1. **The guest.** The fold is closed: a place.
2. **The AI.** The fold opens flat into the full record. The PMS thread feeds the layer's foot (source: your PMS).
3. **Priced.** It enters unpriced, then plays the change once:
   - **Unpriced:** the layer is gone, leaving a dashed slot ("No live availability · No final price · No direct route"). The offer hangs loose with unknown values, and the AI's answer suggests a booking site.
   - **Priced:** the layer slides into its slot along the slant, the offer locks to it, the values roll in, and the answer ends with book direct.
   - The Unpriced/Priced toggle replays it either way.
4. **Book direct.** The layer tucks into a seam and the place and offer join. The property's own website is built around the same card, carrying the same stay, dates and final price.
   - The environment changes: the AI answer goes, and the browser chrome and site header arrive.
   - "Continue to payment" replaces "Book direct".
   - A thread returns to "Your PMS": "arrives as a direct booking".

## Motion system (`motion.ts`)

There are five verbs: **reveal**, **focus**, **connect**, **transform** and **settle**.

- **Opening:** the fold starts closed on the place, the thread draws from the headline, the fold unfolds flat and then into the N, and it settles. It lasts about 2.5 seconds and never blocks reading. Afterwards the fold answers the pointer slightly.
- **Section headlines** rise once through a mask. Body text never animates.
- **Diagrams** draw their threads, and the connection sheet sends one packet around the loop. "Trace a booking again" replays it.
- **Returning** to a section never hides what was already read.

## Mobile

The fold turns vertical: a leaflet folding down, with landscape panels at readable sizes. The opening thread runs down the margin into the layer. In the scene, the priced chapter puts the AI's answer where the paragraph was. The header has a menu.

## Still version

The still version is served for reduced motion, for low-power devices (2 GB of memory or two cores or fewer), and at `?still`. It shows:

- the same four chapters in normal flow;
- the priced chapter with both states side by side;
- the website result as a static frame;
- every headline and diagram in its finished state.

## Checks run

- **Lab suite:** 70 checks at 1920×1080, 1440×900, 1280×712, 390×844 and 358×694:
  - the headline and the offer are on the first screen;
  - no horizontal overflow;
  - the scene chapters, tabs and both toggles;
  - the website chapter;
  - the Get priced dialog (Escape closes it and returns focus);
  - the phone menu and the FAQ;
  - no console errors;
  - the still version under reduced motion;
  - isolation of the existing site.
- **Contrast:** muted text is 4.6:1 on limestone and above 4.5:1 on paper, chalk on the dark scene is 7.1:1, and white on violet is 6.3:1.

## Content and boundaries

- **Copy:** facts come from the approved site copy and the fixture. The FAQ is verbatim.
- **Prices:** stay prices are the fixture's illustrative 4-night totals. Commission rates stay on `/pricing`, which is linked.
- **Nothing is live:** there is no live integration, no submitted form and no booking. Get priced is a preview dialog, and the website frame is labelled "Illustrative".
- **Property:** Sea N' Rent is presented as a property example, with no outbound links.
