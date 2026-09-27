// Folds dist-embed/nexa-chat.css into dist-embed/nexa-chat.js: the @font-face
// rules and Lenis's html rules go into the document's head (a shadow tree
// cannot hold them), everything else into the embed's shadow root, with :root
// rewritten to :host. Writes public/embed/nexa-chat.js.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
const dir = resolve('dist-embed');
const js = readFileSync(resolve(dir, 'nexa-chat.js'), 'utf8');
let css = readFileSync(resolve(dir, 'nexa-chat.css'), 'utf8');
const doc = [];
css = css.replace(/@font-face\s*{[^}]*}/g, block => { doc.push(block); return ''; });
css = css.replace(/(^|})([^{}]*\.lenis[^{}]*{[^}]*})/g, (_, before, block) => { doc.push(block); return before; });
css = css.replace(/:root\b/g, ':host');
const prelude = `(function(){var d=document.createElement('style');d.setAttribute('data-nexa-chat-fonts','');d.textContent=${JSON.stringify(doc.join('\n'))};document.head.appendChild(d);window.__NEXA_CHAT_CSS__=${JSON.stringify(css)};})();\n`;
mkdirSync(resolve('public/embed'), { recursive: true });
const out = resolve('public/embed/nexa-chat.js');
writeFileSync(out, prelude + js);
console.log(`wrote ${out} (${((prelude.length + js.length) / 1024 / 1024).toFixed(2)} MB; ${doc.length} document rules)`);
