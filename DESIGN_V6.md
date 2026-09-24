# V6 — conversation and motion refinement

The opening request is destination-led: an apartment near the sea in Tel Aviv. ChatGPT asks for dates and guest count, the guest answers, then the illustrative Sea N' Rent result appears. No property name, dates, or guest count appears in the initial request.

The header and Hero occupy the initial viewport. The conversation unfolds below the fold. A clipped transcript viewport moves earlier messages upward before the result appears; the property photograph belongs only to the successful recommendation and its website handoff.

Scroll sequences use a quintic smoothstep for zero acceleration at beat boundaries and 350ms GSAP scrub damping. Reading holds separate the transitions. Conversation: 550svh desktop / 560svh mobile. Comparison: 360 / 350svh. Booking journey: 480 / 460svh. Connector: a new 300svh sticky chapter with a final reading hold. No wheel interception or forced snap.

The property website enters as a complete surface instead of a horizontal wipe cutting its logo and copy. The connector builds from queries through NEXA to the property's website. Ledger, architectural windows, and closing aperture retain reversible scroll motion with damping.

All six numbered chapter labels have separate left and right spans across the page gutters. The exact NEXA purple remains #863DB3. Booking and payment are on the property's own website. No guest installation, activation, or MCP is implied. No outgoing property booking link is present.

Reduced motion and viewports shorter than 620px receive the complete static reading layout. V5 remains available at /v5. The default route loads V6 lazily, preserving historical versions.

Validation: production TypeScript/Vite build; browser desktop and phone inspection of the initial Hero, natural conversation, result, comparison, website handoff, PMS receipt, connector, and static transcript. Responsive compact-phone adjustments keep held scenes inside the viewport. Booking figures remain illustrative and the prototype does not submit reservations or leads.
