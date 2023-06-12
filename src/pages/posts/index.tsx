// @ts-expect-error
import AllyContent, { meta as AllyMeta } from './ally-is-you-ally.mdx';
import AllyDecisionContent, {
  // @ts-expect-error
  meta as AllyDecisionMeta,
} from './how-we-might-influence-product-decision-makers-about-accessibility.mdx';
import TeachingContent, {
  // @ts-expect-error
  meta as TeachingMeta,
} from './teaching-people-with-special-needs-how-to-code.mdx';

export const blogPostsMetaInformation = [
  {
    content: AllyContent,
    title: AllyMeta.title,
    date: AllyMeta.date,
    excerpt: AllyMeta.excerpt,
  },
  {
    content: AllyDecisionContent,
    title: AllyDecisionMeta.title,
    date: AllyDecisionMeta.date,
    excerpt: AllyDecisionMeta.excerpt,
  },
  {
    content: TeachingContent,
    title: TeachingMeta.title,
    date: TeachingMeta.date,
    excerpt: TeachingMeta.excerpt,
  },
]
  .map((post) => {
    return {
      ...post,
      date: new Date(post.date),
    };
  })
  .sort(
    ({ date: dateA }, { date: dateB }) => dateA.getTime() - dateB.getTime(),
  );
