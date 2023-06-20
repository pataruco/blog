import { BASE_URL } from '@/utils/metadata';
import { MetadataRoute } from 'next';

import postsInfo from './blog/all-info';

const blogPostSiteMap = postsInfo.map(({ path, date }) => ({
  url: `${BASE_URL}/blog/${path}`,
  lastModified: date,
}));

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
    },
    {
      url: `${BASE_URL}/installfest`,
      lastModified: new Date(),
    },
  ].concat(blogPostSiteMap);
}
