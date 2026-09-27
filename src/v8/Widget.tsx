import { useEffect } from 'react';
import { Conversation } from '../v6/Scenes';

// The booking conversation as a widget: the same scene as on the homepage,
// played by time instead of by the page's scroll (the film player), so it can
// live inside an iframe or an HTML embed on any site. It starts when half of
// it is on screen, pauses off screen, can be paused, replayed and, once it has
// ended, used: the composer is live and the checkout opens by hand.
export default function Widget() {
  useEffect(() => { document.title = 'NEXA · A booking conversation'; document.documentElement.classList.add('chat-widget-root'); }, []);
  return <div className="v3-page v7-light v8 chat-widget is-motion"><Conversation motion mode="film"/></div>;
}
