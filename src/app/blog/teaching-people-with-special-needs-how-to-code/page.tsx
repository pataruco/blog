'use client';

import Post from '@/components/post';

import { Head } from 'next/document';
import meta from './info';
import Content from './post.mdx';

const { date, title } = meta;

export default function Page() {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Post date={date} title={title} Content={Content} />
    </>
  );
}
