import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import '@fontsource-variable/crimson-pro';
import '@fontsource-variable/crimson-pro/wght-italic.css';
import './v6/style.css';
import './v8/style.css';
import './v8/embed.css';
import { Conversation } from './v6/Scenes';
import { useNarrativeScroll } from './v6/useNarrativeScroll';
import { portalTarget } from './v6/motion';

// The conversation as an embed: <div id="nexa-chat"></div> plus one script,
// and the scene lives in the host page exactly as on the homepage: pinned by
// the page's own scroll, Lenis smoothing the wheel, the skip pill, the flick,
// the live composer, the checkout, the gallery. The scene renders inside a
// shadow root so its styles and the host page's never touch; the fonts and
// Lenis's rules, which must live in the document, are added to its head by
// scripts/bundle-embed.mjs.
declare global { interface Window { __NEXA_CHAT_CSS__?: string } }

function Embed() {
  const [flow, setFlow] = useState(() => matchMedia('(prefers-reduced-motion: reduce), (max-height: 619px)').matches);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce), (max-height: 619px)');
    const change = () => setFlow(media.matches);
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, []);
  useNarrativeScroll(!flow);
  return <div className={`v3-page v7-light v8 chat-embed ${flow ? 'is-flow' : 'is-motion'}`}><Conversation motion={!flow} controls={false}/></div>;
}

const host = document.querySelector<HTMLElement>('div[data-nexa-chat], #nexa-chat') ?? (() => {
  const div = document.createElement('div');
  div.id = 'nexa-chat';
  const script = document.currentScript;
  if (script?.parentNode) script.parentNode.insertBefore(div, script); else document.body.appendChild(div);
  return div;
})();
const shadow = host.attachShadow({ mode: 'open' });
const style = document.createElement('style');
style.textContent = window.__NEXA_CHAT_CSS__ ?? '';
shadow.appendChild(style);
const mount = document.createElement('div');
shadow.appendChild(mount);
portalTarget.el = mount;
createRoot(mount).render(<React.StrictMode><Embed/></React.StrictMode>);
