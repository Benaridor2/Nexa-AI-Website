# NEXA - V6 homepage

A complete hospitality homepage with an independent editorial Hero and local, reversible scroll stories. Built with React, TypeScript, Vite, GSAP, and semantic HTML/CSS.

## Run and compare

```sh
npm ci
npm run dev -- --port 5173
npm run build
```

- `/`: current V6 homepage with a complete guest conversation and slower scroll choreography.
- `/v5`: preserved purple choreography revision.
- `/v4`: preserved Figma-led revision.
- `/v3`: preserved V3 homepage.
- `/v2`: preserved Three.js cinematic experiment.
- `/v1`: preserved initial editorial prototype.
- `/?view=static`: normal-flow accessibility layout, also selected by reduced-motion preference or a viewport shorter than 620px.

V1/V2 retain their historical fictional Miami fixture for comparison. V3 uses the Tel Aviv fixture exclusively. The old versions and verification records remain in Git history; V2 was published at commit `517ca6546b7645a40c0a0b902dbd08eee46f52dd`.

## Product and scope

Guests use their existing AI assistant without installation or activation. NEXA makes property details, live availability, final prices, and a direct booking route available from the operator's PMS. Booking and payment complete on the property's own website, then the reservation reaches its PMS as a direct website booking. Operator onboarding is distinct from guest setup. No MCP or undocumented backend protocol is represented.

Direct means branded demand; Agent means destination-led discovery. They are two demand types through one connection, not competing subscription packages. Recommendations and ranking are not guaranteed.

This remains a visual prototype: no live AI/PMS connection, reservation, payment, authentication, or lead collection. Get Priced opens an accessible preview of the operator onboarding conversation; it explicitly says nothing is submitted. The property is illustrative; no outgoing Sea N' Rent booking link is exposed.

## Complete section order

1. Header and independent Hero.
2. ChatGPT conversation: destination request, clarification, dates and guests, search, apartment result, internal booking demonstration link.
3. How It Connects: existing PMS, one connection, existing website.
4. Compact proof: six PMS integrations, two demand types, existing checkout.
5. UNPRICED / PRICED: availability, final price, direct destination.
6. How It Works: PMS, NEXA, AI answer, property website, illustrative confirmation, PMS receipt.
7. Direct / Agent: two queries converge on one connection and destination.
8. Direct-channel economics, without unapproved prices or savings claims.
9. Hotels and vacation rentals.
10. The company-supplied HVC Startup Competition by SHIC award claim, rendered typographically.
11. Eight native FAQ disclosures.
12. Closing Get Priced action and footer.

Sea N' Rent is a property example, not an endorsed customer or partner. No guest reviews, invented testimonials, conference logos, award images, commercial percentages, unit ceilings, universal support claims, or placement guarantees are published.

## Shared demonstration fixture

`src/v3/stay.ts` owns the property and booking fixture:

- Mediterranean Sea Views | 1BR Apt with Balcony, Sea N' Rent.
- HaYarkon Street 78, Tel Aviv-Yafo, Israel.
- One bedroom, private balcony, Mediterranean view.
- May 1-5, 2027; two adults; four nights; sample total **₪2,480**.

The listing identity and photographs were checked against the official property page. Dates, availability and the final total are deliberately illustrative, not a verified quote. The caption outside the ChatGPT reconstruction makes that distinction explicit. See [SOURCES.md](SOURCES.md) for source URLs and image mapping.

## Motion contract

There is no narrative Play, Pause, Next, Replay, chapter toolbar, scroll snapping, custom wheel interception, or body scroll lock. Ordinary anchors, source links, FAQ disclosures, and the Get Priced preview retain conventional behavior.

Three local paused GSAP timelines are directly sought by ScrollTrigger with `scrub: true`. Scroll position controls every narrative state, including reverse scrolling, search, price reveals, website arrival, confirmation, and PMS receipt. There are no independent narrative clocks or delayed callbacks. A stopped position leaves the scene unchanged.

The budgets, including each sticky viewport, are 260svh / 210svh for conversation, 205svh / 190svh for comparison, and 275svh / 240svh for booking (desktop / mobile). The Hero and all remaining sections stay in normal document flow. Lighter entrance and query-alignment motion also derives from scrolling.

Reduced motion, the static review URL, and screens shorter than 760px show complete normal-flow states. Cleanup guards prevent old animation callbacks from hiding content after a layout-mode change. V3 has no canvas or WebGL initialization, so a failed WebGL context cannot remove its content. The Three.js chunk is isolated to preserved V2.

Critical images and font metrics settle before the final measurement refresh. On reload, a tab-local scroll position is restored after layout if the visitor has not already supplied scroll/keyboard input. This compensates for the initially empty asynchronous route; restoration does not drive or play a narrative. No reservation or user information is stored.

## Verification

Reviewed in the Windows in-app browser with responsive viewport overrides, not physical phones:

- 1440px desktop, 390 x 844 and 360 x 800 portrait: Hero, conversation progression, completed answer, PRICED comparison, property-site arrival, confirmation, and continuation through the homepage.
- 360 x 640: normal-flow conversation and booking explanation, all twelve sections, no hidden narrative remnants or horizontal overflow.
- A stopped intermediate conversation state stayed unchanged; forward/reverse seeking restored the same DOM visual state at the same scroll position in both main scenes.
- Reload at the property-site phase restored the exact scroll position and scene state after fixing asynchronous route restoration.
- Resizing between motion and short-screen flow clears animation styles, inert flags, and hidden attributes.
- FAQ opening, modal keyboard wrapping, Escape, and focus return were exercised. Source links use the verified property URL.
- Images rendered; console checks reported no application warnings or errors during the reviewed flows.
- TypeScript and production Vite build passed during implementation. Final release checks and deployment status are reported with the delivered commit.

No physical-touch, GPU frame-pacing, comprehensive screen-reader, or field Core Web Vitals measurement is claimed. The available browser interface does not provide a scroll-video recorder; forward/backward behavior was inspected live, not inferred solely from stills.

## Release workflow

Push every completed, verified version to [Benaridor2/Nexa-AI-Website](https://github.com/Benaridor2/Nexa-AI-Website), respecting current branch rules and preserving remote history. With direct pushes allowed, use `git push origin HEAD:main`; do not force push.

`main` is connected to Vercel project `nexa-ai`. The production URL is [nexa-ai-delta-three.vercel.app](https://nexa-ai-delta-three.vercel.app). Verify that the exact uploaded commit reaches READY and smoke-check the hosted page and preserved routes. See [DEPLOYMENT.md](DEPLOYMENT.md).
# Current revision: V5

The homepage now uses NEXA's exact purple, an unfolding ChatGPT window, and coordinated scroll motion through the product story. Sea N' Rent remains an illustrative example with no outward website links. See [DESIGN_V5.md](DESIGN_V5.md) for research, implementation and verification, and [DESIGN_V4.md](DESIGN_V4.md) for document reconciliation. Previous versions remain at `/v1`, `/v2`, `/v3` and `/v4`.
