import { render } from '@testing-library/react';
import { WebPage, WithContext } from 'schema-dts';
import { describe, expect, it, vi } from 'vitest';

import { author } from '@/utils/metadata';

import Page from './page';

const Component = () => <h1>Hola</h1>;

describe('Blog index', () => {
  it('renders', () => {
    vi.mock('./post.mdx', () => {
      return {
        default: 'hola',
      };
    });

    const jsonLd: WithContext<WebPage> = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      about:
        '"Installfest" is my personal setup to install applications that I consider essential for software development.',
      url: 'https://pataruco.dev/installfest',
      author,
    };

    const { container } = render(<Page />);

    expect(container.querySelector('h1')?.textContent).toBe('Installfest');
    expect(container.querySelector('p')?.textContent).toBe(
      '"Installfest" is my personal setup to install applications that I consider essential for software development.',
    );
    expect(container.querySelector('script')?.textContent).toBe(
      JSON.stringify(jsonLd),
    );
  });
});
