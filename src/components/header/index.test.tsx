import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import Header from './index';

describe('Header', () => {
  it('renders', () => {
    render(<Header />);

    const header = within(screen.getByRole('banner'));

    expect(header).toBeDefined();
  });

  it('toggle a class when button is click', async () => {
    const user = userEvent.setup();

    const { container } = render(<Header />);

    const button = container.querySelector('button');
    const header = container.querySelector('header');

    expect(header?.classList.contains('has-nav')).toBeFalsy();

    if (button) {
      await user.click(button);
    }

    expect(header?.classList.contains('has-nav')).toBeTruthy();
  });
});
