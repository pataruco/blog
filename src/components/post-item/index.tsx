import { PostMeta } from '@/types';
import { BASE_URL, author } from '@/utils/metadata';
import Link from 'next/link';

import { BlogPosting, WithContext } from 'schema-dts';

export const PostItem: React.FC<PostMeta> = ({
  date,
  excerpt,
  path,
  title,
}) => {
  const jsonLd: WithContext<BlogPosting> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    name: title,
    description: excerpt,
    url: `${BASE_URL}/blog/${path}`,
    author,
    datePublished: date.toISOString(),
  };

  return (
    <article className="entry">
      <script
        type="application/ld+json"
        // rome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link href={`/blog/${path}`}>
        <h2>{title}</h2>
      </Link>
      <p>{excerpt}</p>
      <footer className="meta">
        <time dateTime={date.toISOString()}>
          {new Intl.DateTimeFormat('en-GB', { dateStyle: 'full' }).format(date)}
        </time>
      </footer>
    </article>
  );
};
