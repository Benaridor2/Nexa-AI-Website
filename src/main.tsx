import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/geist';
import '@fontsource-variable/crimson-pro';
import '@fontsource-variable/crimson-pro/wght-italic.css';
const isV1 = window.location.pathname.startsWith('/v1');
const isV2 = window.location.pathname.startsWith('/v2');
const isV3 = window.location.pathname.startsWith('/v3');
const page = isV1
  ? Promise.all([import('./v1/App'), import('./v1/style.css')])
  : isV2
    ? Promise.all([import('./cinematic/CinematicApp'), import('./cinematic/cinematic.css')])
    : isV3 ? Promise.all([import('./v3/App'), import('./v3/style.css')])
    : Promise.all([import('./v4/App'), import('./v4/style.css')]);

void page.then(([{ default: App }]) => {
  createRoot(document.getElementById('root')!).render(<React.StrictMode>
    <App />
    {(isV1 || isV2 || isV3) && <a href="/" style={{ position: 'fixed', right: 20, bottom: 20, zIndex: 100, background: '#863db3', color: 'white', padding: '13px 20px', borderRadius: 5, fontSize: 13 }}>View latest ↗</a>}
  </React.StrictMode>);
});
