import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../src/test/test-utils';
import GlobalFooter from './GlobalFooter';

describe('GlobalFooter', () => {
  it('should render footer component', () => {
    render(<GlobalFooter />);
    
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('should contain copyright text', () => {
    render(<GlobalFooter />);
    
    expect(screen.getByText(/©|copyright/i)).toBeInTheDocument();
  });

  it('should contain links', () => {
    render(<GlobalFooter />);
    
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });
});
