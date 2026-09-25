# V6 — closed portal and continuous conversation

The initial Hero previews the upper portion of the closed NEXA-purple panel. The chat itself is hidden behind it until scrolling opens the scene. The initial request asks for an apartment near the sea in Tel Aviv; ChatGPT asks for dates and guests; the guest answers; only then the illustrative Sea N' Rent recommendation appears.

The full conversation stays on screen with the result. Responsive spacing keeps the transcript above the recommendation, with no upward transcript translation. Short viewports receive compact layouts; below 620px tall or with reduced motion, the complete transcript reads in normal flow.

Lenis 1.3.26 smooths wheel scrolling with lerp 0.14 and an unmodified wheel multiplier. GSAP reads the same actual scroll position without a second scrub delay. Touch remains native, and the smooth-scroll instance is destroyed when the motion layout is disabled. Cubic smoothstep transitions respond more evenly than the earlier quintic easing. No section snapping is used. Lenis is integrated following https://github.com/darkroomengineering/lenis#gsap-scrolltrigger.

Scene lengths: conversation 460svh, comparison 320svh, booking 400svh, connector 260svh. Each sequence retains deliberate reading holds. Availability, price, PRICED status, captions, and confirmation text transition sequentially to prevent old and new text occupying the same position simultaneously.

The compact phone audit found and fixed a booking-title/photo collision and a PMS receipt covering the payment note. Comparison values can wrap inside reserved space. The exact NEXA purple remains #863DB3 and all six numbered chapter labels retain opposite-edge alignment.

Product boundaries remain unchanged: guest uses an existing assistant with no installation or activation, booking and payment complete on the property's own website, and no outgoing Sea N' Rent booking link is exposed. All dates, availability, prices, confirmations, and reservations are illustrative.

Validation: TypeScript/Vite production build; browser inspections at 1440x900, 1280x712, 390x844, and 358x694, plus 390x600 static layout. Checked closed Hero, complete transcript and result, scroll progress, reverse navigation, transition text opacity, booking title/photo separation, payment-note/receipt clearance, modal dismissal, runtime errors, image loading, and horizontal overflow. V5 remains archived at /v5.

## Checkout and emphasis refinement

Removed the two conversation-frame labels and duplicate lower Hero descriptor. The business promise is centered directly beneath the Hero actions. Hero phrasing is now “priced, listed, bookable direct.”

The conversation now holds the complete result, shows a decorative cursor approaching and selecting Book direct, then reveals an illustrative checkout belonging to the property. It shows the selected stay, final total, empty-looking noneditable card placeholders, and a disabled payment button. It never collects card data or initiates payment. The final message gains purple emphasis and holds before leaving the scene. The conversation scroll span is extended to 650svh to preserve the earlier conversation pacing while adding this finale.

Proof points use a dark, warm background, stronger gold typography, and a scroll-linked lift and glow. The comparison takeaway has larger, higher-contrast text and a purple rule that intensifies in its concluding beat; comparison extends to 350svh. Booking and connector conclusions also receive restrained purple emphasis.

Numbered chapter labels use opposite-edge text, a slash prefix on the right, a thin baseline, and a purple line reveal as the chapter enters. The user's Conduit screenshot informed this treatment.

The booking answer is now a flex layout with an explicit photo slot between its title and stay details. The moving photo's initial geometry derives from that slot, preventing overlap across responsive sizes. Desktop 1440x900 and 1280x712, phone 390x844 and 358x694, and 390x600 static fallback were inspected. Checkout content fits the tested animated viewports without nested scrolling. Short-phone comparison spacing was adjusted to preserve separation between the label, heading, and card. No browser errors or broken images were observed.

## Narrative refinement - September 25

- How It Works opens with the guest question alone in a large ChatGPT-style card. It recedes into the guest AI, then shows the request to the property website and the AI-to-AI response. Availability, USD final price and the direct booking route appear individually. The recommendation hands the same apartment image into the property website, ending with a direct booking receipt in the PMS.
- Four chapter indicators follow the active step. A dedicated /how-it-works route expands the journey.
- PRICED/UNPRICED now stages missing data, the OTA detour, the NEXA connection, three sequential data checks and the closing statement. The disclaimer explanation is expandable below the scene.
- Product starts with large Direct/Agent explanations, then transfers focus to the shared connection and website. Both audience CTAs route to /nexa-ai-connector, as specified in the website plan.
- Illustrative apartment totals use dollars throughout V6. No exchange-rate conversion is claimed.
- Wheel navigation advances a single narrative beat with cubic easing inside the four pinned chapters. Direction reversal interrupts travel; repeated momentum during one gesture is absorbed. Portal entry/inter-section movement, touch and keyboard remain continuous. Reduced-motion and static views bypass this behavior.
- Browser reviewed at desktop 1440x900 and 1280x712, and mobile 390x844 and 358x694. Fixed recommendation photo/title and compact checkout receipt collisions. Build passes; the pre-existing archived V2 spatial chunk warning remains.
- Final pacing correction: beat travel is 0.45-0.72 seconds with a 90ms settling interval; continued scrolling can proceed without waiting for an idle gesture. Direction reversal remains immediate. The website/PMS diagram stays aligned without perspective tilt, and the final desktop booking panel reserves space for its payment note.

## V7 light theme and interactive checkout

- Light theme: header, Hero, guest story, How It Connects, connector, audience, FAQ and footer are white; the proof strip and PRICED/UNPRICED form one continuous dark band, and the closing is the only other dark band. All overrides live in the `/* V7 light theme */` block at the end of `style.css`, scoped to the homepage (`.v7-light`), so `/how-it-works` and `/nexa-ai-connector` are unchanged. Header and footer use `public/nexa-purple.png` (1520 x 333); `theme-color` is `#ffffff`. The connector diagram cards are white with `#e6e1ea` borders; the Nexa node stays dark purple.
- Chat halo: a `.chat-halo` element behind the unchanged ChatGPT window copies its box and receives the same portal transform and opacity, with a blurred brand-purple fill (48px offset on desktop, 28px on phones). The shutters are flat purple inside a clipping layer, so the halo can extend past the stage. The window's drop shadow is tinted purple instead of black to keep the halo clean.
- Conversation: the first answer shows two Sea N' Rent cards (the verified 1BR and a placeholder second listing), then "I'd also like a pool." and one pool card. The cursor now clicks Book direct on the pool card, and the checkout shows that listing. Placeholder names, totals, description and photos are constants in `stay.ts`. The scene grows to 700svh desktop / 720svh phone. The question-to-options beats keep their previous scroll distance, and the new beats get their own holds. On phones, earlier messages scroll up when the pool answer arrives.
- Checkout: `Show description` expands a description with a 250ms height transition (`aria-expanded`, `aria-controls`), and a four-photo carousel has Next / Previous buttons. Both are driven by clicks through React state, not by scroll progress.
- Hero: the Title Case promise line was removed, leaving eyebrow, headline and paragraph.
- Verified on the production build at 1440x900, 1280x712, 390x844, 358x694 and `/?view=static`: white Hero, halo following the portal, two options, the pool follow-up, cursor click and checkout, description expand and collapse, carousel next and back, forward/reverse scroll restoring identical scene states, no light-on-light text, no console errors, no horizontal overflow. Every message stays visible at 1440x900 and 1280x712. On phones the collapsed checkout fits without scrolling; at 358x694 the expanded description scrolls inside the checkout.
