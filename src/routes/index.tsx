import { createBrowserRouter } from 'react-router-dom';

import Page from '../components/page';
import About from '../pages/about';

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
