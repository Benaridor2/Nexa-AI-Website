import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import '@fontsource-variable/crimson-pro';
import '@fontsource-variable/crimson-pro/wght-italic.css';
import './v6/style.css';
import './v8/style.css';
import './v8/widget.css';
import Widget from './v8/Widget';

// The conversation widget as one HTML file (npm run build:widget).
createRoot(document.getElementById('root')!).render(<React.StrictMode><Widget/></React.StrictMode>);
