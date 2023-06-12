import { createBrowserRouter } from 'react-router-dom';

import Page from '../components/page';
import About from '../pages/about.mdx';
import AllyContent, {
  // @ts-expect-error
  meta as AllyMeta,
} from '../pages/posts//ally-is-you-ally.mdx';

const setPath = (string: string) => string.replaceAll(' ', '-').trim();

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
    path: `/posts/${setPath(AllyMeta.title)}`,
    element: (
      <Page>
        <AllyContent />
      </Page>
    ),
  },
]);
