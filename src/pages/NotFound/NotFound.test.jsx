import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../src/test/test-utils';
import NotFound from './NotFound';

describe('NotFound', () => {
  it('should render 404 message', () => {
    render(<NotFound />);
    
    expect(screen.getByText(/404|not found/i)).toBeInTheDocument();
  });

  it('should have a link to go back home', () => {
    render(<NotFound />);
    
    const homeLink = screen.getByRole('link', { name: /home|back/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });
});
