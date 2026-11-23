import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import ContactCard from './ContactCard';

describe('ContactCard', () => {
  it('should render contact card', () => {
    const mockProvider = {
      email: 'test@example.com',
      phone: '123-456-7890',
      address: '123 Main St',
    };
    const { container } = render(<ContactCard provider={mockProvider} />);
    expect(container).toBeTruthy();
  });
});
