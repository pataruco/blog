'use client';

import { PostItem } from '@/components/post-item';
import { postsInfo } from './all-info';

const Blog = () => {
  return (
    <>
      <h1>Blog</h1>
      <ul>
        {postsInfo.map(({ date, excerpt, path, title }) => (
          <PostItem
            date={date}
            excerpt={excerpt}
            key={date.getTime().toString()}
            path={path}
            title={title}
          />
        ))}
      </ul>
    </>
  );
};

export default Blog;
