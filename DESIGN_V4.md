# V4: Figma-led homepage refinement

Reviewed both supplied documents in full: `Nexa Website V3 - Draft.docx` and `nexa_design_brief_for_gpt.md`. The DOCX contains no embedded images or tables. Also reviewed fresh Figma Hero context and its rendered screenshot (file QCfFETwUFtGRI0U7OXyIA3, node 1:2125), and Conduit's homepage structure.

## Direction

The latest user request takes precedence over the older full-photo Hero. V4 restores Figma's centered editorial opening, Crimson Pro typography, full Hero paragraph, two calls to action, and partially revealed chat window beneath the fold. The typography follows the actual Figma rather than the older markdown's Sora suggestion. The layout is an original responsive interpretation, not a pixel-for-pixel export; Figma stock imagery, third-party icons and backgrounds are not reused.

The window stays locally sticky while native scroll advances the question, message morph, search, result reveal and direct booking link. Perspective resolves into a readable flat window. PRICED / UNPRICED changes availability, final price and direct path in sequence. The later successful answer carries its apartment image into the property's website and shows a reservation returning through that website's existing PMS flow.

Sea N' Rent photography appears only in the successful answer and its subsequent website handoff. There is no property image in the Hero's initial state, the UNPRICED comparison, connector diagram or audience decoration. The listing remains an illustrative example, not a customer claim or a live quote.

## Copy and source reconciliation

- Restored Hero headline and paragraph, value line, Watch a booking happen CTA, How it connects explanation, proof strip, two guest types, audience language, FAQ title, closing headline and footer sentence.
- Preserved homepage sequence: Hero/chat, connection, proof, PRICED comparison, booking explanation, connector, commercial-value placeholder, audience, FAQ, closing. Unapproved customer quotes are omitted.
- Restored the four-step explanation and explicit no-installation wording.
- Retained later corrections: guests use their existing AI; booking and payment complete on the property's website; NEXA does not directly submit the reservation to the PMS.
- Commission percentages, profit calculations, fixed-fee claims, inventory locks and guaranteed placement from older drafts remain unpublished. The markdown expressly excludes pricing design while terms are being finalized. No invented signup endpoint, contact destination or legal document is linked.
- Used 3,000-unit portfolio maximum from the fact brief rather than the conflicting 10,000 in the homepage draft.
- Used “Live in days” rather than the conflicting “Live in hours.”
- Inner-page specifications, blog and solutions are source context, not an instruction to expand this homepage revision into a functional account platform.

## Verification

Production TypeScript/Vite build; desktop 1440x900; mobile 390x844 and 360x800; short-screen 360x640 normal-flow fallback. Visually inspected initial partial chat, completed answer, failed/priced comparison, and property checkout. Reverse scroll returned the chat's styles and accessibility state exactly at matching progress. Short-screen switch removed hidden animation states. No horizontal overflow, broken images or browser console warnings/errors were observed. FAQ and Get Priced dialog interactions checked, including Escape dismissal.

Prototype boundaries remain explicit: sample booking data, no actual booking/payment, and no submitted onboarding form. Previous V3 remains available at `/v3`; V1 and V2 also remain accessible.
