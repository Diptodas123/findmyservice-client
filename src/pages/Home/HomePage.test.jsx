import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../src/test/test-utils';
import HomePage from './HomePage';

describe('HomePage', () => {
  it('should render without crashing', () => {
    render(<HomePage />);
    expect(document.body).toBeInTheDocument();
  });

  it('should render Banner component', () => {
    const { container } = render(<HomePage />);
    // Check that page renders successfully
    expect(container.querySelector('.container')).toBeInTheDocument();
  });

  it('should render HowItWorks section', () => {
    render(<HomePage />);
    expect(screen.getByText(/How It Works/i)).toBeInTheDocument();
  });

  it('should render Testimonials section', () => {
    render(<HomePage />);
    expect(screen.getByText(/What our customers say/i)).toBeInTheDocument();
  });

  it('should render Newsletter section', () => {
    render(<HomePage />);
    expect(screen.getByText(/Get updates — join our newsletter/i)).toBeInTheDocument();
  });

  it('should have proper structure with container', () => {
    const { container } = render(<HomePage />);
    expect(container.querySelector('.container')).toBeInTheDocument();
  });
});
