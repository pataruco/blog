import postsInfo from '@/app/blog/all-info';
import RSS from 'rss';

import { writeFile } from 'node:fs/promises';
import { BASE_URL } from './metadata';

const generateRss = async () => {
  const feedOptions = {
    title: 'Pedro Martin Valera',
    description: 'I help to build, teach and lead product tech teams.',
    site_url: BASE_URL,
    feed_url: `${BASE_URL}/rss.xml`,
    image_url: `${BASE_URL}/icon.svg`,
    pubDate: new Date(),
    copyright: `All rights reserved ${new Date().getFullYear()}`,
  };

  const feed = new RSS(feedOptions);

  postsInfo.map(({ title, excerpt, date, path }) => {
    feed.item({
      title,
      description: excerpt,
      date,
      url: `${BASE_URL}/blog/${path}`,
    });
  });

  await writeFile('../public/rss.xml', feed.xml({ indent: true }));
};

export default generateRss;
