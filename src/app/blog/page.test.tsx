import { about, author } from '@/utils/metadata';
import { render } from '@testing-library/react';
import { Blog, WithContext } from 'schema-dts';
import { describe, expect, it } from 'vitest';

import BlogComponent from './page';

describe('Blog index', () => {
  it('renders', () => {
    const jsonLd: WithContext<Blog> = {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      about,
      author,
    };

    const { container } = render(<BlogComponent />);

    expect(container.querySelector('h1')?.textContent).toBe('Blog');
    expect(container.querySelector('p')?.textContent).toBe(
      'My thoughts about building, teaching and leading product tech teams',
    );
    expect(container.querySelector('script')?.textContent).toBe(
      JSON.stringify(jsonLd),
    );
  });
});
