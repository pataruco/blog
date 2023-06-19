'use client';

import Post from '@/components/post';

import meta from './info';
import Content from './post.mdx';

const { date, title } = meta;

export default function Page() {
  return <Post date={date} title={title} Content={Content} />;
}
