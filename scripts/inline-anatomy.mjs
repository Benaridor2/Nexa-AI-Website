// Folds dist-anatomy/anatomy.html, its one script and its one stylesheet into a single HTML file.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const dir = resolve('dist-anatomy');
let html = readFileSync(resolve(dir, 'anatomy.html'), 'utf8');
html = html.replace(/<script type="module"[^>]*src="\.\/(assets\/[^"]+\.js)"><\/script>/g, (_, file) => {
  const js = readFileSync(resolve(dir, file), 'utf8').replace(/<\/script/gi, '<\\/script');
  return `<script type="module">${js}</script>`;
});
html = html.replace(/<link rel="stylesheet"[^>]*href="\.\/(assets\/[^"]+\.css)">/g, (_, file) => `<style>${readFileSync(resolve(dir, file), 'utf8')}</style>`);
const out = resolve(process.argv[2] || 'dist-anatomy/nexa-chat-anatomy.html');
writeFileSync(out, html);
console.log(`wrote ${out} (${(html.length / 1024 / 1024).toFixed(2)} MB)`);
