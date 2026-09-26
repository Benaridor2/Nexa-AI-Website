import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import '@fontsource-variable/crimson-pro';
import '@fontsource-variable/crimson-pro/wght-italic.css';
const isV1 = window.location.pathname.startsWith('/v1');
const isV2 = window.location.pathname.startsWith('/v2');
const isV3 = window.location.pathname.startsWith('/v3');
const isV4 = window.location.pathname.startsWith('/v4');
const isV5 = window.location.pathname.startsWith('/v5');
const isV6 = /^\/v6(\/|$)/.test(window.location.pathname);
const isV7 = /^\/v7(\/|$)/.test(window.location.pathname);
const page = isV1
  ? Promise.all([import('./v1/App'), import('./v1/style.css')])
  : isV2
    ? Promise.all([import('./cinematic/CinematicApp'), import('./cinematic/cinematic.css')])
    : isV3 ? Promise.all([import('./v3/App'), import('./v3/style.css')])
    : isV4 ? Promise.all([import('./v4/App'), import('./v4/style.css')])
    : isV5 ? Promise.all([import('./v5/App'), import('./v5/style.css')])
    : isV6 ? Promise.all([import('./v6/App'), import('./v6/style.css')])
    : isV7 ? Promise.all([import('./v7/App'), import('./v6/style.css'), import('./v7/style.css')])
    : window.location.pathname.replace(/\/$/, '') === '/nexa-ai-connector' ? Promise.all([import('./v6/Connector'), import('./v6/style.css')])
    : window.location.pathname.replace(/\/$/, '') === '/how-it-works' ? Promise.all([import('./v6/HowItWorks'), import('./v6/style.css')])
    : ['/solutions', '/pricing', '/about', '/contact'].includes(window.location.pathname.replace(/\/$/, '')) ? Promise.all([import('./v6/Pages'), import('./v6/style.css')])
    : Promise.all([import('./v8/App'), import('./v6/style.css'), import('./v8/style.css')]);

void page.then(([{ default: App }]) => {
  createRoot(document.getElementById('root')!).render(<React.StrictMode>
    <App />
    {(isV1 || isV2 || isV3 || isV4 || isV5 || isV6 || isV7) && <a href="/" style={{ position: 'fixed', right: 20, bottom: 20, zIndex: 100, background: '#863db3', color: 'white', padding: '13px 20px', borderRadius: 5, fontSize: 13 }}>View latest ↗</a>}
  </React.StrictMode>);
});
