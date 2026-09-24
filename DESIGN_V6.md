# V6 — closed portal and continuous conversation

The initial Hero previews the upper portion of the closed NEXA-purple panel. The chat itself is hidden behind it until scrolling opens the scene. The initial request asks for an apartment near the sea in Tel Aviv; ChatGPT asks for dates and guests; the guest answers; only then the illustrative Sea N' Rent recommendation appears.

The full conversation stays on screen with the result. Responsive spacing keeps the transcript above the recommendation, with no upward transcript translation. Short viewports receive compact layouts; below 620px tall or with reduced motion, the complete transcript reads in normal flow.

Lenis 1.3.26 smooths wheel scrolling with lerp 0.14 and an unmodified wheel multiplier. GSAP reads the same actual scroll position without a second scrub delay. Touch remains native, and the smooth-scroll instance is destroyed when the motion layout is disabled. Cubic smoothstep transitions respond more evenly than the earlier quintic easing. No section snapping is used. Lenis is integrated following https://github.com/darkroomengineering/lenis#gsap-scrolltrigger.

Scene lengths: conversation 460svh, comparison 320svh, booking 400svh, connector 260svh. Each sequence retains deliberate reading holds. Availability, price, PRICED status, captions, and confirmation text transition sequentially to prevent old and new text occupying the same position simultaneously.

The compact phone audit found and fixed a booking-title/photo collision and a PMS receipt covering the payment note. Comparison values can wrap inside reserved space. The exact NEXA purple remains #863DB3 and all six numbered chapter labels retain opposite-edge alignment.

Product boundaries remain unchanged: guest uses an existing assistant with no installation or activation, booking and payment complete on the property's own website, and no outgoing Sea N' Rent booking link is exposed. All dates, availability, prices, confirmations, and reservations are illustrative.

Validation: TypeScript/Vite production build; browser inspections at 1440x900, 1280x712, 390x844, and 358x694, plus 390x600 static layout. Checked closed Hero, complete transcript and result, scroll progress, reverse navigation, transition text opacity, booking title/photo separation, payment-note/receipt clearance, modal dismissal, runtime errors, image loading, and horizontal overflow. V5 remains archived at /v5.
