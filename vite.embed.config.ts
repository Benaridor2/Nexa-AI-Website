import { defineConfig } from 'vite';

// The conversation as one script for other sites (npm run build:embed):
// an IIFE with React inside, every asset inlined, the stylesheet emitted
// beside it and folded in by scripts/bundle-embed.mjs.
export default defineConfig({
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  build: {
    outDir: 'dist-embed',
    emptyOutDir: true,
    assetsInlineLimit: 1e9,
    cssCodeSplit: false,
    chunkSizeWarningLimit: 5000,
    lib: { entry: 'src/embed-entry.tsx', name: 'NexaChat', formats: ['iife'], fileName: () => 'nexa-chat.js' },
    rollupOptions: { output: { assetFileNames: 'nexa-chat.[ext]' } },
  },
});
