import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import ReviewsManagement from './ReviewsManagement';

vi.mock('../../utils/apiClient');

describe('ReviewsManagement', () => {
  it('should render reviews management', () => {
    const { container } = render(<ReviewsManagement />);
    expect(container).toBeTruthy();
  });
});
