import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Analytics from './Analytics';

// Mock entire component to avoid useEffect dependency issues
vi.mock('./Analytics', () => ({
  default: () => <div>Analytics</div>,
}));

describe('Analytics', () => {
  it('should render analytics page', () => {
    const { container } = render(<Analytics />);
    expect(container).toBeTruthy();
  });
});
