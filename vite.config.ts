import mdx from '@mdx-js/rollup';
import react from '@vitejs/plugin-react-swc';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    mdx({
      remarkPlugins: [
        remarkGfm,
        [remarkFrontmatter, { type: 'yaml', marker: '-' }],
        [remarkMdxFrontmatter, { name: 'meta' }],
      ],
    }),
  ],
});
