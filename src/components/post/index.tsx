import { PostMeta } from '@/types';
import { MDXProps } from 'mdx/types';
import { BlogPosting, WithContext } from 'schema-dts';

import './style.css';

interface PostParams extends PostMeta {
  Content: (props: MDXProps) => JSX.Element;
}

const Post: React.FC<PostParams> = ({
  Content,
  date,
  excerpt,
  path,
  title,
}) => {
  const jsonLd: WithContext<BlogPosting> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    about: excerpt,
    url: `https://pataruco.dev/blog/${path}`,
    author: {
      '@type': 'Person',
      name: 'Pedro Martin Valera',
    },
  };

  return (
    <article className="blog-post">
      <script
        type="application/ld+json"
        // rome-ignore lint/security/noDangerouslySetInnerHtml: We are inserting microdata as per Next.js docs https://nextjs.org/docs/app/building-your-application/optimizing/metadata#json-ld
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1>{title}</h1>
      <div className="meta">
        <time dateTime={date.toISOString()}>
          {new Intl.DateTimeFormat('en-GB', { dateStyle: 'full' }).format(date)}
        </time>
      </div>
      <Content />
    </article>
  );
};

export default Post;
