# V8 homepage: the conversation as it was, the sections underneath

V8 is the homepage that ships from `/`. It keeps the part of the site that was
liked, the V6 hero and the ChatGPT conversation that follows the scroll, and
puts the V7 sections under it (see DESIGN_V7.md for the research those come
from). The film version of the conversation stays reachable at `/v7`, the
previous homepage at `/v6`.

## What changed from V6

1. **No player bar.** The chapter bar with Play, the progress track and the
   chapter labels is gone. The conversation moves with the scroll and with
   nothing else. Under the window, while the conversation is pinned, one pill:
   "Skip the conversation", with "or flick down" beside it on a mouse.
2. **Skipping.** The pill, or a flick of the wheel, runs the conversation to
   its end in 1.35 s and lands the page on the sections. A flick is a lot of
   travel in little time: at least 760 px of wheel within half a second, with
   no gap over 160 ms. A steady turn of a notched wheel, however long, reads on
   and never skips. The wheel event that completes the flick and the momentum
   after it are swallowed for 400 ms, so the page does not carry past the
   sections; a scroll back up cancels the glide at once. On phones the hint is
   hidden and the pill does the skipping; the keyboard skip button remains.
3. **"Watch a booking happen"** (hero link and the button in How it works)
   glides to the opening of the conversation and leaves the reader to scroll.
   There is no autoplay any more.
4. **Scope.** The `.v7` class sits on a wrapper around the sections, not on the
   page root, so V7's type and colour rules cannot reach the V6 hero and
   window. V7's rules for `.hero-actions`, `.hero-pms` and `.closing-line`,
   names V6 also uses, are scoped to `.v7`. A computed-style diff of the hero
   and the conversation against `/v6` (29,920 properties at 1440 and 390, at
   four story points) finds no difference beyond 1 px of rounding where the
   pill row replaces the bar.
5. **Section headings** in the sections take the hero's serif (Crimson Pro),
   so the page reads as one voice from top to bottom.

## Verified

- `v8test`: window closed on load, no bar, no overflow; pill hidden until
  pinned; a slow wheel and a steady wheel read on; a flick skips and does not
  carry past; the pill skips; Watch a booking happen glides to the opening and
  waits; every section present; FAQ; Get Priced dialog; reduced motion; the
  old routes load without the V8 page. 71 checks at 1440×900, 1280×712,
  390×844 and 358×694.
- Chat interactivity (`chat3`, `interact`), header, links, pages and the
  calculator unchanged. On phones the checkout card scrolls inside itself when
  its description is expanded, exactly as on V6 live.
