import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Home from './page';

describe('Home page', () => {
  it('renders', () => {
    render(<Home />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Web developer and educator/i,
      }),
    ).toBeDefined();
  });
});
