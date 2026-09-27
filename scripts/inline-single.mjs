// Folds dist-single/<page>.html, its one script and its one stylesheet into a single HTML file.
// Usage: node scripts/inline-single.mjs <page.html> <out.html>
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const [page = 'anatomy.html', outFile = 'dist-single/nexa-chat-anatomy.html'] = process.argv.slice(2);
const dir = resolve('dist-single');
let html = readFileSync(resolve(dir, page), 'utf8');
html = html.replace(/<script type="module"[^>]*src="\.\/(assets\/[^"]+\.js)"><\/script>/g, (_, file) => {
  const js = readFileSync(resolve(dir, file), 'utf8').replace(/<\/script/gi, '<\\/script');
  return `<script type="module">${js}</script>`;
});
html = html.replace(/<link rel="stylesheet"[^>]*href="\.\/(assets\/[^"]+\.css)">/g, (_, file) => `<style>${readFileSync(resolve(dir, file), 'utf8')}</style>`);
const out = resolve(outFile);
writeFileSync(out, html);
console.log(`wrote ${out} (${(html.length / 1024 / 1024).toFixed(2)} MB)`);
