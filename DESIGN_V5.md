# V5: NEXA brand and scroll choreography

## Latest direction

The user clarified that Figma was a loose starting point, requested stronger original scroll animation throughout the homepage, insisted on the actual NEXA purple, prohibited outward Sea N' Rent links, and explicitly requested that the conversation look like and be labeled ChatGPT. These directions supersede V4's generic assistant treatment.

## Research

- [Illoca by Unseen](https://illoca.unseen.co/), found in the [GSAP showcase](https://gsap.com/showcase/): inspected the live opening at several scroll positions. Its changes in camera framing informed the idea of entering a product scene rather than fading a card into view. No assets or layout were copied.
- [Creator's Astra website demonstration](https://www.youtube.com/watch?v=sL96fJ8hVBE): search-indexed creator description describes a scroll-controlled passage through paintings and rooms. This is an author-reported Astra example; the video itself could not be retrieved through the research tool. It is a conceptual reference, not a verified implementation or performance benchmark.
- [GSAP ScrollTrigger documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/): scroll-linked timelines and cleanup. Native scroll remains the sole narrative transport.
- [ChatGPT](https://chatgpt.com/): inspected the current anonymous interface, header, collapsed sidebar, welcome state and composer. The prototype uses the corresponding light interface treatment and an explicit ChatGPT label. It is an illustrative conversation, not a live integration.

## Implementation

- All brand-purple surfaces, glows, borders and translucent layers derive from `#863DB3` (134, 61, 179). Removed V4's independently tinted lavender palette. Neutral text and surfaces remain neutral; red/green are reserved for status and gold for proof.
- The opening begins as the window enters the viewport, before it pins. Purple panels separate and a layered ChatGPT window unfolds in perspective, grows toward the viewer and resolves flat for reading. The question assembles, moves into the transcript, then search and the successful illustrated result appear.
- PRICED data rows lift and rotate locally while their missing values are replaced. Flattened nested 3D composition to fix disappearing text observed during mobile testing.
- The successful property result carries its image into the illustrative property website. The website is revealed with a directional mask; booking remains on the property's own website.
- Direct and Agent queries arrive from different offsets, their paths draw into the connector, and the destination resolves next. Economics rows, architectural audience illustrations and the closing aperture have coordinated scroll motion.
- Removed all outward Sea N' Rent anchors, including those in preserved V3 and V4. The illustrative Book direct link now points to the internal booking explanation. No live reservation or payment is possible.
- Corrected the overbroad short-screen fallback: ordinary 712px desktop windows now animate. Reduced motion, forced static mode and windows below 620px high retain a complete readable flow.
- Animation cleanup restores each element's original style, ARIA and inert attributes instead of discarding original decorative semantics.

## Checks

TypeScript/Vite production build; desktop 1440x900 and 1280x712; mobile 390x844 and 390x700; short-screen 360x600. Inspected opening, middle and completed narrative states through actual browser scrolling. Opening reverse-scroll returned exactly the same styles and accessibility state at matching progress. Verified literal ChatGPT label, computed brand color `rgb(134, 61, 179)`, no outward property links, and no horizontal overflow. At compact mobile height the result and booking link fit above the composer. Previous V4 remains at `/v4`.

No physical-device frame-rate or comprehensive screen-reader claim is made. This remains a marketing prototype with illustrative booking data and a non-submitting onboarding dialog.
