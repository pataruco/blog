import { PostMeta } from '@/types';
import Link from 'next/link';

export const PostItem: React.FC<PostMeta> = ({
  date,
  excerpt,
  path,
  title,
}) => {
  return (
    <article className="entry">
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
