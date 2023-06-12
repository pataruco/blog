import { createBrowserRouter } from 'react-router-dom';

import Page from '../components/page';
import About from '../pages/about.mdx';
import Blog from '../pages/blog';
import AllyContent, {
  // @ts-expect-error
  meta as AllyMeta,
} from '../pages/posts//ally-is-you-ally.mdx';

export const setPath = (string: string) => string.replaceAll(' ', '-').trim();

console.log(setPath(AllyMeta.title));

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
  {
    path: `/posts/${setPath(AllyMeta.title)}`,
    element: (
      <Page>
        <AllyContent />
      </Page>
    ),
  },
]);
