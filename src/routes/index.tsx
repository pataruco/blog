import { createBrowserRouter } from 'react-router-dom';

import Page from '../components/page';
import About from '../pages/about.mdx';
import Blog from '../pages/blog';
import { blogPostsMetaInformation } from '../pages/posts';

export const setPath = (string: string) =>
  `/posts/${string.replaceAll(' ', '-').trim().toLowerCase()}`;

const blogRoutes = blogPostsMetaInformation.map(
  ({ content: Content, title }) => {
    return {
      path: setPath(title),
      element: (
        <Page>
          <Content />
        </Page>
      ),
    };
  },
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Page>
        <About />
      </Page>
    ),
  },
  {
    path: '/blog',
    element: (
      <Page>
        <Blog />
      </Page>
    ),
  },
  ...blogRoutes,
]);
