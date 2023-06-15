import { PostMeta } from '@/types';
import Link from 'next/link';

export const PostItem: React.FC<PostMeta> = ({
  date,
  excerpt,
  path,
  title,
}) => {
  return (
    <li>
      <Link href={`/blog/${path}`}>
        <h2>{title}</h2>
      </Link>
      <p>
        <time dateTime={date.toISOString()}>
          {new Intl.DateTimeFormat('en-GB', { dateStyle: 'full' }).format(date)}
        </time>
      </p>
      <p>{excerpt}</p>
    </li>
  );
};
