import { defineConfig } from 'vite';

// The annotated conversation as one file: every asset inlined, one chunk, so
// scripts/inline-anatomy.mjs can fold the script and the stylesheet into the
// HTML. Photos come from the live site (VITE_ASSET_BASE).
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist-anatomy',
    emptyOutDir: true,
    assetsInlineLimit: 1e9,
    cssCodeSplit: false,
    chunkSizeWarningLimit: 5000,
    rollupOptions: { input: 'anatomy.html', output: { inlineDynamicImports: true } },
  },
});
