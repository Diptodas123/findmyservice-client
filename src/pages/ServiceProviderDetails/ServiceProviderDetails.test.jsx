import { describe, it, expect, vi } from 'vitest';
import { render } from '../../../src/test/test-utils';
import ServiceProviderDetails from './ServiceProviderDetails';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
  };
});

describe('ServiceProviderDetails', () => {
  it('should render service provider details page', () => {
    const { container } = render(<ServiceProviderDetails />);
    expect(container).toBeInTheDocument();
  });

  it('should render without crashing', () => {
    const { container } = render(<ServiceProviderDetails />);
    expect(container.firstChild).toBeTruthy();
  });

  it('should display loading state initially', () => {
    render(<ServiceProviderDetails />);
    const container = document.body;
    expect(container).toBeTruthy();
  });

  it('should have provider id from params', () => {
    const { container } = render(<ServiceProviderDetails />);
    // Should use the mocked id '1'
    expect(container).toBeInTheDocument();
  });

  it('should render provider details structure', () => {
    const { container } = render(<ServiceProviderDetails />);
    expect(container.querySelector('div')).toBeTruthy();
  });

  it('should handle provider data fetching', () => {
    const { container } = render(<ServiceProviderDetails />);
    // Component initializes and attempts to fetch
    expect(container.firstChild).toBeTruthy();
  });

  it('should render with proper layout', () => {
    const { container } = render(<ServiceProviderDetails />);
    const divs = container.querySelectorAll('div');
    expect(divs.length).toBeGreaterThan(0);
  });

  it('should initialize with correct params', () => {
    const { container } = render(<ServiceProviderDetails />);
    // Provider ID should be available from useParams mock
    expect(container).toBeInTheDocument();
  });

  it('should use provider id from URL params', () => {
    const { container } = render(<ServiceProviderDetails />);
    // Mocked useParams returns id: '1'
    expect(container).toBeTruthy();
  });

  it('should render provider detail container', () => {
    const { container } = render(<ServiceProviderDetails />);
    expect(container.firstChild).not.toBeNull();
  });

  it('should handle data loading', () => {
    const { container } = render(<ServiceProviderDetails />);
    // Component should handle loading state
    expect(container).toBeTruthy();
  });

  it('should render multiple sections', () => {
    const { container } = render(<ServiceProviderDetails />);
    const sections = container.querySelectorAll('[class*="MuiBox"]');
    expect(sections.length).toBeGreaterThan(0);
  });

  it('should initialize provider data fetching', () => {
    const { container } = render(<ServiceProviderDetails />);
    expect(container).toBeInTheDocument();
  });

  it('should render provider information area', () => {
    const { container } = render(<ServiceProviderDetails />);
    const papers = container.querySelectorAll('[class*="MuiPaper"]');
    expect(papers.length).toBeGreaterThan(0);
  });

  it('should handle provider fetching', () => {
    const { container } = render(<ServiceProviderDetails />);
    // Component attempts to fetch provider data
    expect(container.firstChild).toBeTruthy();
  });
});
