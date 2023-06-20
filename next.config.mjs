import nextMDX from '@next/mdx';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  experimental: {
    appDir: true,
    swcTraceProfiling: true,
    mdxRs: true,
  },
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
};

const withMDX = nextMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeHighlight],
  },
});

export default withMDX(nextConfig);
