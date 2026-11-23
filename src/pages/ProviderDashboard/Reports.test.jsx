import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import Reports from './Reports';

vi.mock('../../utils/apiClient');
vi.mock('jspdf', () => ({
  default: vi.fn(() => ({
    text: vi.fn(),
    save: vi.fn(),
    autoTable: vi.fn(),
  })),
}));

describe('Reports', () => {
  it('should render reports page', () => {
    const { container } = render(<Reports />);
    expect(container).toBeTruthy();
  });
});
