'use client';
import { PostMeta } from '@/types';
// @ts-expect-error
import A11yIsYourAlly, { meta } from './post.mdx';

export const { title, excerpt, date }: PostMeta = meta;

export default function Page() {
  return <A11yIsYourAlly />;
}
