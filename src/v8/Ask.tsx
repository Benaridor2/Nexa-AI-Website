import { useEffect, useState } from 'react';
import { Arrow } from '../v6/Scenes';
import { STAY } from '../v6/stay';

// The ask: a guest's question, typed and retyped, in a composer that stays at
// the bottom of the screen and travels with the reader over the sections, the
// way the reference site's floating composer does. It is the one thing on the
// page that does not stay put: a reminder that a guest is asking right now.
// Pressing it brings the reader to the conversation to watch the AI answer.
// It hides while the conversation itself is on screen (that has its own
// composer), while a dialog is open, and at the footer.
const QUESTIONS = [STAY.question, 'May 1-5, two adults. Is it available?', "What's the final price?", 'Can I book it direct?'];

export function Ask({ onSend }: { onSend: () => void }) {
  const [text, setText] = useState(QUESTIONS[0]);
  const [hidden, setHidden] = useState(true);

  // Typing, at a human pace, with a pause to read each question.
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let q = 0, i = QUESTIONS[0].length, deleting = true, timer = 0;
    const tick = () => {
      const full = QUESTIONS[q];
      if (deleting) {
        i -= 1; setText(full.slice(0, i));
        if (i <= 0) { deleting = false; q = (q + 1) % QUESTIONS.length; timer = window.setTimeout(tick, 480); return; }
        timer = window.setTimeout(tick, 16);
      } else {
        i += 1; setText(full.slice(0, i));
        if (i >= full.length) { deleting = true; timer = window.setTimeout(tick, 3200); return; }
        timer = window.setTimeout(tick, 36 + Math.random() * 44);
      }
    };
    timer = window.setTimeout(tick, 3200);
    return () => window.clearTimeout(timer);
  }, []);

  // Where it shows: over the sections, not over the conversation, a dialog or the footer.
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const vh = innerHeight;
      const chat = document.getElementById('guest-story')?.getBoundingClientRect();
      const footer = document.querySelector('.footer')?.getBoundingClientRect();
      const overChat = chat ? chat.top < vh * .92 && chat.bottom > vh * .6 : false;
      const atFooter = footer ? footer.top < vh - 16 : false;
      setHidden(overChat || atFooter || Boolean(document.querySelector('dialog[open]')));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const dialogs = new MutationObserver(schedule);
    dialogs.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['open'] });
    return () => { if (frame) cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); dialogs.disconnect(); };
  }, []);

  return <button type="button" className={`ask${hidden ? ' is-hidden' : ''}`} onClick={onSend} aria-label="A guest is asking. Watch the AI answer." tabIndex={hidden ? -1 : 0}>
    <span className="ask-live" aria-hidden="true"/>
    <span className="ask-text"><span className="ask-who">A guest is asking, right now</span><span className="ask-q">{text}<i className="ask-caret"/></span></span>
    <span className="ask-send" aria-hidden="true"><Arrow/></span>
  </button>;
}
