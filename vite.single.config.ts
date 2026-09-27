import { defineConfig } from 'vite';

// A page as one file: every asset inlined, one chunk, so scripts/inline-single.mjs
// can fold the script and the stylesheet into the HTML. SINGLE_INPUT names the
// HTML entry (anatomy.html or widget.html); photos come from the live site
// (VITE_ASSET_BASE).
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist-single',
    emptyOutDir: true,
    assetsInlineLimit: 1e9,
    cssCodeSplit: false,
    chunkSizeWarningLimit: 5000,
    rollupOptions: { input: process.env.SINGLE_INPUT || 'anatomy.html', output: { inlineDynamicImports: true } },
  },
});
