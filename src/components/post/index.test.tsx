import { BASE_URL, author } from '@/utils/metadata';
import { render, within } from '@testing-library/react';
import { BlogPosting, WithContext } from 'schema-dts';
import { describe, expect, it } from 'vitest';

import Post from './index';

const Content = () => <h1>👋</h1>;
const title = 'title';
const date = new Date('1978-07-18');
const excerpt = 'excerp';
const path = '/path/to/hell';

describe('Post', () => {
  it('renders', () => {
    const { container } = render(
      <Post
        title={title}
        excerpt={excerpt}
        path={path}
        date={date}
        Content={Content}
      />,
    );

    const jsonLd: WithContext<BlogPosting> = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      about: excerpt,
      url: `${BASE_URL}/blog/${path}`,
      author,
    };

    expect(container.querySelector('h1')?.textContent).toBe(title);
    expect(container.querySelector('time')?.textContent).toBe(
      new Intl.DateTimeFormat('en-GB', { dateStyle: 'full' }).format(date),
    );

    expect(within(container).getByText('👋')).toBeDefined();

    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );

    expect(script).toBeDefined();

    expect(script?.textContent).toBe(JSON.stringify(jsonLd));
  });
});
