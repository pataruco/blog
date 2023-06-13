'use client';
import { PostMeta } from '@/types';
// @ts-expect-error
import Content, { meta } from './post.mdx';

export const { title, excerpt, date }: PostMeta = meta;

export default function Page() {
  return <Content />;
}
