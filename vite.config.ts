import { defineConfig } from 'vite';

export default defineConfig({
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
