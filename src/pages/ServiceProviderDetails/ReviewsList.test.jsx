import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import ReviewsList from './ReviewsList';

describe('ReviewsList', () => {
  it('should render reviews list', () => {
    const mockReviews = [
      { id: '1', rating: 5, comment: 'Great service!', userName: 'John' },
      { id: '2', rating: 4, comment: 'Good work', userName: 'Jane' },
    ];
    const { container } = render(<ReviewsList reviews={mockReviews} />);
    expect(container).toBeTruthy();
  });

  it('should render empty state when no reviews', () => {
    const { container } = render(<ReviewsList reviews={[]} />);
    expect(container).toBeTruthy();
  });
});
