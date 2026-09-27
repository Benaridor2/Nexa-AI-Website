import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import '@fontsource-variable/crimson-pro';
import '@fontsource-variable/crimson-pro/wght-italic.css';
import './v6/style.css';
import './v8/style.css';
import './v8/anatomy.css';
import Anatomy from './v8/Anatomy';

// The annotated conversation as a page of its own: the entry of the
// standalone build (npm run build:anatomy), which folds everything into one
// HTML file for the designer.
createRoot(document.getElementById('root')!).render(<React.StrictMode><Anatomy/></React.StrictMode>);
