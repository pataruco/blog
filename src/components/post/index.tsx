import { PostMeta } from '@/types';
import { MDXProps } from 'mdx/types';

interface PostParams {
  title: PostMeta['title'];
  date: PostMeta['date'];
  Content: (props: MDXProps) => JSX.Element;
}

const Post: React.FC<PostParams> = ({ title, date, Content }) => {
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
};

export default Post;
