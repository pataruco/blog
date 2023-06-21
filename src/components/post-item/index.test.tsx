import { BASE_URL, author } from '@/utils/metadata';
import { render } from '@testing-library/react';
import { BlogPosting, WithContext } from 'schema-dts';
import { describe, expect, it } from 'vitest';

import { PostItem } from './index';

const title = 'title';
const date = new Date('1978-07-18');
const excerpt = 'excerp';
const path = 'path/to/hell';

describe('Post', () => {
  it('renders', () => {
    const { container } = render(
      <PostItem title={title} excerpt={excerpt} path={path} date={date} />,
    );

    const jsonLd: WithContext<BlogPosting> = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      name: title,
      description: excerpt,
      url: `${BASE_URL}/blog/${path}`,
      author,
      datePublished: date.toISOString(),
    };

    expect(container.querySelector('a')?.href).toBe(
      `http://localhost:3000/blog/${path}`,
    );
    expect(container.querySelector('h2')?.textContent).toBe(title);
    expect(container.querySelector('time')?.textContent).toBe(
      new Intl.DateTimeFormat('en-GB', { dateStyle: 'full' }).format(date),
    );

    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );

    expect(script).toBeDefined();

    expect(script?.textContent).toBe(JSON.stringify(jsonLd));
  });
});
