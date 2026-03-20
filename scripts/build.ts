import path from 'node:path';
import { Feed } from 'feed';
import fs from 'fs-extra';
import { glob } from 'glob';
import matter from 'gray-matter';
import { Marked } from 'marked';
import { createHighlighter } from 'shiki';

const BASE_URL = 'https://www.pataruco.dev';
// Path prefix for deployment (e.g., '/blog/' for GitHub Pages, '/' for custom domain)
// const BASE_PATH = process.env.BASE_PATH || '/blog/';
const BASE_PATH = process.env.BASE_PATH || '/blog/';
const AUTHOR = {
  name: 'Pedro Martin Valera',
  email: 'hola@pataruco.dev',
  link: BASE_URL,
};

async function run() {
  const highlighter = await createHighlighter({
    themes: ['github-light'],
    langs: [
      'javascript',
      'typescript',
      'html',
      'css',
      'bash',
      'json',
      'tsx',
      'mdx',
      'md',
      'toml',
      'sh',
      'rust',
      'scheme',
    ],
  });

  const marked = new Marked();
  const renderer = {
    code(token: { text: string; lang?: string }) {
      if (token.lang === 'mermaid') {
        return `<pre class="mermaid">${token.text}</pre>`;
      }
      try {
        return highlighter.codeToHtml(token.text, {
          lang: token.lang || 'text',
          theme: 'github-light',
        });
      } catch {
        return highlighter.codeToHtml(token.text, {
          lang: 'text',
          theme: 'github-light',
        });
      }
    },
  };
  marked.use({ renderer });

  const template = await fs.readFile('src/templates/base.html', 'utf-8');
  const manifest = await fs.readJson('dist/.vite/manifest.json');

  // Find the JS and CSS files from the manifest
  // Vite 6+ manifest structure
  const indexHtml = manifest['index.html'];
  const mainJsPath = `${BASE_PATH}${indexHtml.file}`;
  const mainCss = indexHtml.css ? `${BASE_PATH}${indexHtml.css[0]}` : '';

  await fs.ensureDir('dist/blog');

  async function renderPage(
    outputPath: string,
    title: string,
    description: string,
    content: string,
    jsonLd: unknown = null,
  ) {
    let renderedJsonLd = '';
    if (jsonLd) {
      renderedJsonLd = `<script type="application/ld+json">${JSON.stringify(
        jsonLd,
      )}</script>`;
    }

    const html = template
      .replace('{{title}}', title)
      .replace('{{description}}', description)
      .replace('{{content}}', content)
      .replaceAll('{{css}}', mainCss)
      .replaceAll('{{js}}', mainJsPath)
      .replace('{{jsonLd}}', renderedJsonLd)
      .replaceAll('{{basePath}}', BASE_PATH)
      .replace(
        '<my-footer></my-footer>',
        `<my-footer build-time="${Date.now()}"></my-footer>`,
      );

    await fs.ensureDir(path.dirname(outputPath));
    await fs.writeFile(outputPath, html);
  }

  const postFiles = await glob('src/content/blog/**/*.md');
  const posts: {
    title: string;
    date: Date;
    excerpt: string;
    slug: string;
    path: string;
    htmlContent: string;
  }[] = [];

  for (const file of postFiles) {
    const raw = await fs.readFile(file, 'utf-8');
    const { data, content } = matter(raw);
    const htmlContent = await marked.parse(content);
    const slug = data.slug || path.basename(file, '.md');
    const postPath = `blog/${slug}`;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      name: data.title,
      description: data.excerpt,
      url: `${BASE_URL}/${postPath}`,
      author: {
        '@type': 'Person',
        name: AUTHOR.name,
      },
      datePublished: data.date.toISOString(),
    };

    const formattedDate = new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'full',
    }).format(data.date);

    await renderPage(
      path.join('dist', postPath, 'index.html'),
      data.title,
      data.excerpt || '',
      `<div class="content"><h1>${
        data.title
      }</h1><p class="meta"><time datetime="${data.date.toISOString()}">${formattedDate}</time></p>${htmlContent}</div>`,
      jsonLd,
    );

    posts.push({
      title: data.title as string,
      date: data.date as Date,
      excerpt: data.excerpt as string,
      slug,
      path: postPath,
      htmlContent,
    });
  }

  posts.sort((a, b) => b.date.getTime() - a.date.getTime());

  const postItemsHtml = posts
    .map((post) => {
      const formattedDate = new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'full',
      }).format(post.date);
      return `
        <post-item
          title="${post.title}"
          date="${post.date.toISOString()}"
          excerpt="${post.excerpt}"
          path="${post.slug}"
        >
          <article class="entry">
            <a href="${BASE_PATH}blog/${post.slug}">
              <h2>${post.title}</h2>
            </a>
            <p>${post.excerpt}</p>
            <footer class="meta">
              <time datetime="${post.date.toISOString()}">
                ${formattedDate}
              </time>
            </footer>
          </article>
        </post-item>
    `;
    })
    .join('');

  const blogIndexContent = `
    <div class="content">
      <h1>Blog</h1>
      <p>My thoughts about building, teaching and leading product tech teams</p>
    </div>
    <div>
      ${postItemsHtml}
    </div>
  `;

  await renderPage(
    'dist/blog/index.html',
    'Blog',
    'My thoughts about building, teaching and leading product tech teams',
    blogIndexContent,
    {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      about:
        'My thoughts about building, teaching and leading product tech teams',
      author: {
        '@type': 'Person',
        name: AUTHOR.name,
      },
    },
  );

  const homeRaw = await fs.readFile('src/content/pages/home.md', 'utf-8');
  const { data: homeData, content: homeContent } = matter(homeRaw);
  const homeHtml = await marked.parse(homeContent);
  await renderPage(
    'dist/index.html',
    homeData.title,
    homeData.description,
    `<div class="content">${homeHtml}</div>`,
    {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      about: AUTHOR.name,
      description: homeData.description,
      url: BASE_URL,
      author: {
        '@type': 'Person',
        name: AUTHOR.name,
      },
    },
  );

  const feed = new Feed({
    title: 'Pedro Martin Valera',
    description:
      'My thoughts about building, teaching and leading product tech teams',
    id: BASE_URL,
    link: BASE_URL,
    language: 'en',
    copyright: `All rights reserved ${new Date().getFullYear()}, Pedro Martin Valera`,
    author: AUTHOR,
  });

  posts.forEach((post) => {
    feed.addItem({
      title: post.title,
      id: `${BASE_URL}/${post.path}`,
      link: `${BASE_URL}/${post.path}`,
      description: post.excerpt,
      author: [AUTHOR],
      date: post.date,
    });
  });

  await fs.writeFile('dist/rss.xml', feed.rss2());
  await fs.writeFile('dist/atom.xml', feed.atom1());

  const sitemapItems = posts
    .map(
      (post) => `
  <url><loc>${BASE_URL}/${
    post.path
  }</loc><lastmod>${post.date.toISOString()}</lastmod></url>`,
    )
    .join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${BASE_URL}/</loc><lastmod>${new Date().toISOString()}</lastmod></url>
  <url><loc>${BASE_URL}/blog</loc><lastmod>${new Date().toISOString()}</lastmod></url>
  <url><loc>${BASE_URL}/installfest</loc><lastmod>${new Date().toISOString()}</lastmod></url>
  ${sitemapItems}
</urlset>`;
  await fs.writeFile('dist/sitemap.xml', sitemap);

  const robots = `User-agent: *
Allow: /
Disallow: /private/
Sitemap: ${BASE_URL}/sitemap.xml`;
  await fs.writeFile('dist/robots.txt', robots);

  console.log('Build complete!');
}

run().catch(console.error);
