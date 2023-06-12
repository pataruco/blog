import Page from '../../components/page';

// @ts-expect-error
import AllyContent, { meta as AllyMeta } from './ally-is-you-ally.mdx';

export const blogRoutes = [
  {
    path: AllyMeta,
    element: (
      <Page>
        <AllyContent />
      </Page>
    ),
  },
];
