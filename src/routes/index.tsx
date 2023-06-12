import { createBrowserRouter } from 'react-router-dom';

import Page from '../components/page';
import About from '../pages/about.mdx';
import AllyContent, {
  // @ts-expect-error
  meta as AllyMeta,
} from '../pages/posts//ally-is-you-ally.mdx';

console.log({ AllyMeta });

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
    path: AllyMeta.date,
    element: (
      <Page>
        <AllyContent />
      </Page>
    ),
  },
]);
