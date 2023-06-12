import { createBrowserRouter } from 'react-router-dom';

import Page from '../components/page';
// @ts-expect-error
import About, { meta } from '../pages/about.mdx';

console.log({ meta });

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Page>
        <About />
      </Page>
    ),
  },
]);
