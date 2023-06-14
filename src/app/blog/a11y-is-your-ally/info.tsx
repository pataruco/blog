import { PostMeta } from '@/types';
// @ts-expect-error
import { meta } from './post.mdx';
export const { title, excerpt, date }: PostMeta = meta;
