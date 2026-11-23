import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../src/test/test-utils';
import Testimonials from './Testimonials';

describe('Testimonials', () => {
  it('should render the component', () => {
    render(<Testimonials />);
    
    expect(screen.getByText(/What our customers say/i)).toBeInTheDocument();
  });

  it('should display testimonial cards', () => {
    render(<Testimonials />);
    
    expect(screen.getByText(/Rita K./i)).toBeInTheDocument();
    expect(screen.getByText(/David L./i)).toBeInTheDocument();
    expect(screen.getByText(/Sofia M./i)).toBeInTheDocument();
  });

  it('should show testimonial content', () => {
    render(<Testimonials />);
    
    expect(screen.getByText(/Great prices and transparent invoicing/i)).toBeInTheDocument();
    expect(screen.getByText(/Helpful support and vetted pros/i)).toBeInTheDocument();
  });

  it('should display company names', () => {
    render(<Testimonials />);
    
    expect(screen.getByText(/City Plumbing/i)).toBeInTheDocument();
    expect(screen.getByText(/Bright Electric/i)).toBeInTheDocument();
  });

  it('should have section structure', () => {
    const { container } = render(<Testimonials />);
    
    const section = container.querySelector('.testimonials-section');
    expect(section).toBeInTheDocument();
  });
});
