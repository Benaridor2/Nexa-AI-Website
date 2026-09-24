# NEXA - first homepage prototype

The authorized first experiment: Hero, PRICED / UNPRICED, and a controlled AI-answer-to-property-website booking demonstration.

## Run locally

```sh
npm install
npm run dev -- --port 5173
```

Open http://127.0.0.1:5173/. Build with `npm run build`; serve the production build with `npm run preview`.

## Product and interaction

- The guest uses their existing AI assistant without installation or activation.
- Live availability, final prices, and a direct booking route come from the property's PMS through NEXA.
- Booking and payment complete on the property's website. The website's confirmation precedes the direct PMS booking result.
- The entire experience uses one fictional fixture: Example Oceanfront Hotel, Miami Beach; May 1-5, 2027; four nights, two guests; $1,240 final total.
- PRICED reveals the explanatory data layer, availability/price, then the booking link. Controls are keyboard accessible.
- Four directly selectable journey steps support play, pause, restart, and replay. Playback starts only on request and pauses when the browser tab is hidden.
- OS reduced motion is respected. The footer also provides a session-only motion toggle.
- Get Priced previews the property onboarding context in a native dialog. No data is collected or submitted.

## Visual sources

The supplied Figma file `QCfFETwUFtGRI0U7OXyIA3` was reviewed, including Home V1, Hero, Logo, Colors, and Components. NEXA logo PNGs and the terrace photograph are source assets from that file. WebP derivatives preserve the photograph while reducing payload. The fictional hotel is illustrative, not customer evidence.

Crimson Pro and Geist are self-hosted from Fontsource packages. GSAP handles the introductory animation, section reveals, data sequence, and shared-element booking transition. Semantic HTML and responsive CSS keep text and controls in the DOM.

## Scope

Local visual prototype only. No backend, real AI/PMS connection, authentication, payment collection, or real reservation. Future homepage sections await direction review.

## Verification completed

- Successful TypeScript and production Vite build.
- Browser review at 1440px desktop, 390px mobile, and 360px narrow mobile; no horizontal overflow at the checked widths.
- Watched intermediate and final animation states; fixed transient title overlap during the shared-card expansion.
- Exercised PRICED / UNPRICED, all four journey tabs, forward/reverse selection, play/pause/completion, keyboard arrows, and the reduced-motion mode.
- Verified Get Priced dialog opening, keyboard wrap, Escape/focus return, and its handoff into the journey.
- Checked source image loading, booking data continuity, critical text contrast, and browser console warnings/errors.

These are local prototype checks, not field performance measurements or a claim of production integration.
