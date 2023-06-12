import { Link } from 'react-router-dom';
import { blogPostsMetaInformation } from '../pages/posts';
import { setPath } from '../routes';

const Blog = () => {
  return (
    <div>
      <h2>Blog</h2>
      {blogPostsMetaInformation.map(({ title, date, excerpt }) => {
        return (
          <article>
            <Link to={setPath(title)}>
              <h3>{title}</h3>
            </Link>
            <p>
              <time dateTime={date.toISOString()}>
                {new Intl.DateTimeFormat('en-GB', {
                  dateStyle: 'full',
                }).format(date)}
              </time>
            </p>
            <p>{excerpt}</p>
          </article>
        );
      })}
    </div>
  );
};

export default Blog;
