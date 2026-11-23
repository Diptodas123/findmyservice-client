import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../src/test/test-utils';
import Header from './Header';

describe('Header', () => {
  it('should render header component', () => {
    render(<Header />);
    
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });

  it('should contain navigation links', () => {
    render(<Header />);
    
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('should render without crashing', () => {
    render(<Header />);
    
    expect(document.body).toBeInTheDocument();
  });
});
