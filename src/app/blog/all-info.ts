'use client';

import { PostMeta } from '@/types';

import a11yMeta from './a11y-is-your-ally/info';
import a11yInfluenceMeta from './how-we-might-influence-product-decision-makers-about-accessibility-in-digital-products/info';
import quickAndDirtyMeta from './quick-and-dirty-and-I-like-it/info';
import teachingMeta from './teaching-people-with-special-needs-how-to-code/info';

const postsInfo: PostMeta[] = [
  a11yMeta,
  a11yInfluenceMeta,
  teachingMeta,
  quickAndDirtyMeta,
].sort(({ date: dateA }, { date: dateB }) => {
  return dateB.getTime() - dateA.getTime();
});

export default postsInfo;
