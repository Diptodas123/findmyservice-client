import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import BackToTop from './BackToTop';

describe('BackToTop', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 800, writable: true });
  });

  it('should not render when not scrolled', () => {
    const { container } = render(<BackToTop />);
    expect(container.querySelector('button')).not.toBeInTheDocument();
  });

  it('should render when scrolled past viewport height', async () => {
    const { container } = render(<BackToTop />);
    
    Object.defineProperty(window, 'scrollY', { value: 900, writable: true });
    fireEvent.scroll(window);
    
    await waitFor(() => {
      expect(container.querySelector('button')).toBeInTheDocument();
    });
  });

  it('should scroll to top when clicked', async () => {
    const { container } = render(<BackToTop />);
    
    Object.defineProperty(window, 'scrollY', { value: 1000, writable: true });
    fireEvent.scroll(window);
    
    await waitFor(() => {
      const button = container.querySelector('button');
      if (button) {
        fireEvent.click(button);
        expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
      }
    });
  });
});
