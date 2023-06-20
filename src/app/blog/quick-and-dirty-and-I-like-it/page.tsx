'use client';

import Post from '@/components/post';

import meta from './info';
import Content from './post.mdx';

const { date, title, excerpt, path } = meta;

export default function Page() {
  return (
    <Post
      Content={Content}
      date={date}
      excerpt={excerpt}
      path={path}
      title={title}
    />
  );
}
