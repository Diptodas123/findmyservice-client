import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../src/test/test-utils';
import HowItWorks from './HowItWorks';

describe('HowItWorks', () => {
  it('should render the component', () => {
    render(<HowItWorks />);
    
    expect(screen.getByText('How It Works')).toBeInTheDocument();
  });

  it('should render all four steps', () => {
    render(<HowItWorks />);
    
    expect(screen.getByText(/Contact Service Provider/i)).toBeInTheDocument();
    expect(screen.getByText(/Book a Service/i)).toBeInTheDocument();
    expect(screen.getByText(/Receive Service/i)).toBeInTheDocument();
    expect(screen.getByText(/Pay Securely/i)).toBeInTheDocument();
  });

  it('should display step descriptions', () => {
    render(<HowItWorks />);
    
    expect(screen.getByText(/Message or call the provider/i)).toBeInTheDocument();
    expect(screen.getByText(/Search, compare and schedule/i)).toBeInTheDocument();
  });

  it('should have proper section structure', () => {
    const { container } = render(<HowItWorks />);
    
    const section = container.querySelector('.hiw-section');
    expect(section).toBeInTheDocument();
  });
});
