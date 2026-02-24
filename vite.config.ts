import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  base: '',
  build: {
    manifest: true,
    assetsDir: '.',
    rollupOptions: {
      input: 'index.html',
    },
  },
});
