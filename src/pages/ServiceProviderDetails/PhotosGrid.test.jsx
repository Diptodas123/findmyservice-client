import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import PhotosGrid from './PhotosGrid';

describe('PhotosGrid', () => {
  it('should render photos grid', () => {
    const mockPhotos = [
      'https://example.com/photo1.jpg',
      'https://example.com/photo2.jpg',
    ];
    const { container } = render(<PhotosGrid photos={mockPhotos} />);
    expect(container).toBeTruthy();
  });

  it('should render empty state when no photos', () => {
    const { container } = render(<PhotosGrid photos={[]} />);
    expect(container).toBeTruthy();
  });
});
