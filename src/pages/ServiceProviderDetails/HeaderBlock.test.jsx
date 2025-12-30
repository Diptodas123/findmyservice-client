import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import HeaderBlock from './HeaderBlock';

describe('HeaderBlock', () => {
  it('should render header block', () => {
    const mockProvider = {
      name: 'Test Provider',
      bio: 'Test bio',
      rating: 4.5,
      reviewCount: 10,
    };
    const { container } = render(<HeaderBlock provider={mockProvider} />);
    expect(container).toBeTruthy();
  });
});
