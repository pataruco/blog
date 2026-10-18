import { defineConfig } from 'vite';

export default defineConfig({
  // Static multi-page site: no SPA fallback to index.html in dev/preview.
  appType: 'mpa',
  base: '',
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    manifest: true,
    assetsDir: '.',
    rollupOptions: {
      input: 'index.html',
    },
  },
});
