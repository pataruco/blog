'use client';

import meta from './info';
import Content from './post.mdx';

const { date, title } = meta;

export default function Page() {
  return (
    <>
      <h1>{title}</h1>
      <div className="meta">
        <time dateTime={date.toISOString()}>
          {new Intl.DateTimeFormat('en-GB', { dateStyle: 'full' }).format(date)}
        </time>
      </div>
      <Content />
    </>
  );
}
