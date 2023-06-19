'use client';

import { PostItem } from '@/components/post-item';
import Head from 'next/head';
import { postsInfo } from './all-info';

const Blog = () => {
  return (
    <>
      <Head>
        <title>Blog</title>
        <meta
          name="description"
          content="My thoughts about building, teaching and leading product tech teams"
          key="description"
        />
      </Head>

      <div className="content">
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

export default Blog;
