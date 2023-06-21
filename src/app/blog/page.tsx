'use client';

import { PostItem } from '@/components/post-item';

import postsInfo from './all-info';

import { about, author } from '@/utils/metadata';
import { Blog, WithContext } from 'schema-dts';

const BlogComponent = () => {
  const jsonLd: WithContext<Blog> = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    about,
    author,
  };

  return (
    <>
      <script
        type='application/ld+json'
        // rome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className='content'>
        <h1>Blog</h1>
        <p>
          My thoughts about building, teaching and leading product tech teams
        </p>
      </div>
      <div>
        {postsInfo.map(({ date, excerpt, path, title }) => (
          <PostItem
            date={date}
            excerpt={excerpt}
            key={date.getTime().toString()}
            path={path}
            title={title}
          />
        ))}
      </div>
    </>
  );
};

export default BlogComponent;
