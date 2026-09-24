# NEXA - cinematic V2 prototype

The authorized homepage experiment covers the Hero, PRICED / UNPRICED, and the passage from an AI answer to booking on the property's own website. V2 connects these scenes through one continuous spatial narrative. The remaining homepage sections await direction review.

V1 is preserved at commit `1c08e9f` (`Preserve NEXA V1 prototype before cinematic V2`) and remains available at `/v1`. Its components and styles live in `src/v1/`. The root route `/` serves V2; links in both versions support comparison.

## Run locally

```sh
npm install
npm run dev -- --port 5173
```

Open [V2](http://127.0.0.1:5173/), [V1](http://127.0.0.1:5173/v1), or the [forced DOM fallback](http://127.0.0.1:5173/?view=static). Build with `npm run build`; serve the production build with `npm run preview`.

## Product and interaction

- The guest uses their existing AI assistant without installation or activation.
- Live availability, final prices, and a direct booking route come from the property's PMS through NEXA.
- Booking and payment complete on the property's website. The website's confirmation precedes the direct PMS booking result.
- Both versions use one fictional fixture: Example Oceanfront Hotel, Miami Beach; May 1-5, 2027; four nights, two guests; $1,240 final total.
- The NEXA data assembly explains availability, final price, and the direct destination. It is a marketing visualization, not a guest activation interface or a description of an undocumented backend protocol.
- V2 scrolling and timed playback arrive at an unconfirmed property booking page. Only the separate **Preview confirmation** action displays an illustrative confirmation and then the direct PMS booking result. No reservation or payment occurs.
- Get Priced previews the property onboarding context in a native dialog. No data is collected or submitted.

## V2 motion and controls

Three.js supplies a perspective camera, the photographic plane, separated surfaces, lighting, and depth. CSS3D surfaces keep meaningful labels as semantic DOM elements. A normal HTML booking target follows the projected destination surface, keeping keyboard focus independent of CSS3D transforms. The same photograph remains the visual anchor through the reveal, data opening, PRICED assembly, and full-page property arrival.

A shared GSAP timeline drives the scene and DOM presentation. Desktop uses native scrolling across one `380svh` story with a sticky stage; explicit Play, chapter selection, and PRICED / UNPRICED controls use that same timeline and synchronize its scroll position. Playback starts only on request. Pause, replay, direct chapter selection, and keyboard chapter navigation are provided.

Mobile uses an unpinned portrait composition with tighter camera travel and direct chapter controls. Reduced motion uses static keyframes and a **Next** control instead of continuous timed playback. The footer also provides a session-only motion toggle.

If WebGL cannot initialize or its context is lost, a DOM fallback retains the photograph, booking details, controls, and property website. Append `?view=static` to inspect that fallback deliberately. Both alternatives disable 3D and present held keyframes with a Next control. The forced fallback is independent of the system motion preference.

## Visual sources

The supplied Figma file `QCfFETwUFtGRI0U7OXyIA3` was reviewed, including Home V1, Hero, Logo, Colors, and Components. NEXA logo PNGs and the terrace photograph are source assets from that file. WebP derivatives preserve the photograph while reducing payload. The fictional hotel is illustrative, not customer evidence.

Crimson Pro and Geist are self-hosted from Fontsource packages. The shared photograph is **1440 x 960**. It supports the 1440px-wide review at approximately 1x; this does not claim native 2x detail for a full-width image. V2 coordinates the plane projection with the property's DOM image crop during the arrival.

## Scope

Visual prototype only. No backend, real AI/PMS connection, authentication, payment collection, or real reservation.

## V2 verification record

The following checks were observed in the Windows in-app browser, using responsive viewport overrides rather than physical phones:

- **1440 x 1000 and 1440 x 800 desktop:** inspected the major compositions, watched continuous playback, and verified arrival stays unconfirmed. Compared V1 and V2 at the same desktop size.
- **390 x 844 and 360 x 800 mobile viewports:** inspected portrait Three.js compositions and real playback, booking arrival, explicit confirmation, control clearance, and page overflow. Mobile uses ordinary page scrolling.
- **Controls:** exercised chapter selection, PRICED / UNPRICED, replay, native reverse scrolling, wheel interruption over the dock, and pointer/Enter activation of Book direct.
- **Reduced motion and forced fallback:** verified static Next states, keyboard chapter navigation, the complete booking path, and hidden-content accessibility attributes. The 360px fallback card clears its comparison controls.
- **Get Priced:** verified playback pauses, keyboard focus wraps, Escape closes, and focus returns.
- **Build:** TypeScript and production Vite build pass. Browser review reported no console errors or warnings. Vite reports the lazy Three.js chunk exceeds its 500KB uncompressed advisory threshold (about 145.5KB gzip).

Development playback instrumentation recorded a 17.6ms 95th-percentile timeline-update interval on a 1440 x 800 run, with 2 of 950 intervals above 34ms. A 360 x 800 run recorded 20.2ms, with 14 of 752 intervals above 34ms. A later 390 x 844 run recorded 17.5ms, with 1 of 799 intervals above 34ms. The render count stayed unchanged after playback settled, confirming that there is no continuous idle render loop. These are application update intervals, not GPU presentation measurements or field Core Web Vitals. Cold scene initialization produced a longer render call (up to about 270ms in the narrow-viewport test); later rendering was substantially shorter. The immediate HTML hero remains available while the scene initializes. No physical-handset performance or comprehensive screen-reader audit is claimed.

## V1 history

V1 used separate editorial sections, a PRICED data reveal, and a shared-element booking-card transition. Its four selectable journey steps offered play, pause, restart, and replay, with browser-visibility pausing and a reduced-motion option. GSAP handled entrance reveals, the data sequence, and the shared-element transition; semantic HTML and responsive CSS provided its interfaces.

The following verification was recorded for V1 before the cinematic rebuild. It is historical evidence for that version, not a claim that every check has been repeated against V2:

- Successful TypeScript and production Vite build.
- Browser review at 1440px desktop, 390px mobile, and 360px narrow mobile; no horizontal overflow at the checked widths.
- Watched intermediate and final animation states; fixed transient title overlap during the shared-card expansion.
- Exercised PRICED / UNPRICED, all four journey tabs, forward/reverse selection, play/pause/completion, keyboard arrows, and the reduced-motion mode.
- Verified Get Priced dialog opening, keyboard wrap, Escape/focus return, and its handoff into the journey.
- Checked source image loading, booking data continuity, critical text contrast, and browser console warnings/errors.

These are prototype checks, not field performance measurements or a claim of production integration.
