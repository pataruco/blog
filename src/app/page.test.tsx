import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Home from './page';

describe('Home page', () => {
  it('renders', () => {
    render(<Home />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /I am Pedro Martin Valera/i,
      }),
    ).toBeDefined();
  });
});
