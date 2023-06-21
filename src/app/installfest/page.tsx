'use client';
import '@/styles/highlight-a11y-light.css';
import { WebPage, WithContext } from 'schema-dts';

import Content from './post.mdx';

export default function Page() {
  const jsonLd: WithContext<WebPage> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    about:
      '"Installfest" is my personal setup to install applications that I consider essential for software development.',
    url: 'https://pataruco.dev/installfest',
    author: {
      '@type': 'Person',
      name: 'Pedro Martin Valera',
    },
  };

  return (
    <>
      <script
        type='application/ld+json'
        // rome-ignore lint/security/noDangerouslySetInnerHtml: We are inserting microdata as per Next.js docs https://nextjs.org/docs/app/building-your-application/optimizing/metadata#json-ld
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className='content'>
        <h1>Installfest</h1>
        <p>
          "Installfest" is my personal setup to install applications that I
          consider essential for software development.
        </p>
      </div>
      <Content />
    </>
  );
}
