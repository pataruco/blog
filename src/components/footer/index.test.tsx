import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Footer, { createTimeStamp } from './index';

describe('Footer page', () => {
  describe('createTimeStamp', () => {
    it('return null when NEXT_PUBLIC_TIMESTAMP is not provided', () => {
      expect(createTimeStamp()).toBeNull();
    });

    it('return an object with timestamps when NEXT_PUBLIC_TIMESTAMP not provided', () => {
      // @ts-ignore mock
      import.meta.env.NEXT_PUBLIC_TIMESTAMP = 1687295250;
      expect(createTimeStamp()).toEqual({
        dateTimestamp: '2023-06-20T21:07:30.000Z',
        printTimestamp: '20 June 2023 at 10:07 pm BST',
      });
    });
  });

  it('renders', () => {
    render(<Footer />);

    const headings = screen.getAllByRole('heading', { level: 3 });

    const headingContents = ['Follow me', 'Contact me'];

    headings.map((heading, index) => {
      expect(within(heading).getByText(headingContents[index])).toBeDefined();
    });

    expect(screen.queryByTestId('timestamp')).toBeDefined();
    expect.assertions(3);
  });
});
