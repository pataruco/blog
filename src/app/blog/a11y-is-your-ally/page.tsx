'use client';
// @ts-expect-error
import A11yIsYourAlly, { meta } from './post.mdx';

console.log({ meta });

export default function Page() {
  return <A11yIsYourAlly />;
}
