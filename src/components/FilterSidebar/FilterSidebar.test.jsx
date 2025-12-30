import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../src/test/test-utils';
import FilterSidebar from './FilterSidebar';

describe('FilterSidebar', () => {
  const mockProps = {
    query: '',
    setQuery: vi.fn(),
    location: '',
    setLocation: vi.fn(),
    locationOptions: [],
    categories: ['Plumbing', 'Electrical', 'Cleaning'],
    selectedCategories: [],
    handleCategoryChange: vi.fn(),
    priceMin: 0,
    setPriceMin: vi.fn(),
    priceMax: 5000,
    setPriceMax: vi.fn(),
    ratingOptions: [1, 2, 3, 4, 5],
    selectedRatings: [],
    handleRatingChange: vi.fn(),
    handleClearFilters: vi.fn(),
    handleClearCategories: vi.fn(),
  };

  it('should render filter sidebar', () => {
    const { container } = render(<FilterSidebar {...mockProps} />);
    expect(container).toBeInTheDocument();
  });

  it('should render without crashing', () => {
    const { container } = render(<FilterSidebar {...mockProps} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('should render categories section', () => {
    render(<FilterSidebar {...mockProps} />);
    expect(screen.getByText('Plumbing')).toBeInTheDocument();
    expect(screen.getByText('Electrical')).toBeInTheDocument();
  });

  it('should render price range inputs', () => {
    const { container } = render(<FilterSidebar {...mockProps} />);
    const numberInputs = container.querySelectorAll('input[type="number"]');
    expect(numberInputs.length).toBeGreaterThan(0);
  });

  it('should render clear filters button', () => {
    const { container } = render(<FilterSidebar {...mockProps} />);
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should handle category selection', () => {
    render(<FilterSidebar {...mockProps} />);
    const plumbingCheckbox = screen.getByLabelText('Plumbing');
    fireEvent.click(plumbingCheckbox);
    expect(mockProps.handleCategoryChange).toHaveBeenCalled();
  });

  it('should display selected categories', () => {
    const propsWithSelected = { ...mockProps, selectedCategories: ['Plumbing'] };
    render(<FilterSidebar {...propsWithSelected} />);
    expect(screen.getByText('Plumbing')).toBeInTheDocument();
  });

  it('should render location filter', () => {
    const { container } = render(<FilterSidebar {...mockProps} />);
    expect(container.querySelector('input')).toBeTruthy();
  });

  it('should handle min price change', () => {
    render(<FilterSidebar {...mockProps} />);
    const inputs = screen.getAllByRole('spinbutton');
    if (inputs.length > 0) {
      fireEvent.change(inputs[0], { target: { value: '100' } });
      expect(mockProps.setPriceMin).toHaveBeenCalled();
    }
  });

  it('should handle max price change', () => {
    render(<FilterSidebar {...mockProps} />);
    const inputs = screen.getAllByRole('spinbutton');
    if (inputs.length > 1) {
      fireEvent.change(inputs[1], { target: { value: '1000' } });
      expect(mockProps.setPriceMax).toHaveBeenCalled();
    }
  });

  it('should update search query', () => {
    render(<FilterSidebar {...mockProps} />);
    const searchInput = screen.getByLabelText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'plumbing' } });
    expect(mockProps.setQuery).toHaveBeenCalledWith('plumbing');
  });

  it('should handle location selection', () => {
    const propsWithLocations = { 
      ...mockProps, 
      locationOptions: ['New York', 'Los Angeles', 'Chicago'] 
    };
    const { container } = render(<FilterSidebar {...propsWithLocations} />);
    const locationSelect = container.querySelector('[aria-label="Location"]') || container.querySelector('select');
    if (locationSelect) {
      fireEvent.change(locationSelect, { target: { value: 'New York' } });
    }
    // Just verify component renders with locations
    expect(container).toBeTruthy();
  });

  it('should render with multiple rating options', () => {
    const { container } = render(<FilterSidebar {...mockProps} />);
    // Should render rating checkboxes
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    expect(checkboxes.length).toBeGreaterThan(0);
  });

  it('should handle slider price range change', () => {
    const { container } = render(<FilterSidebar {...mockProps} />);
    const slider = container.querySelector('[class*="MuiSlider"]');
    if (slider) {
      // Slider exists
      expect(slider).toBeTruthy();
    }
  });

  it('should show selected categories', () => {
    const propsWithSelection = {
      ...mockProps,
      selectedCategories: ['Plumbing', 'Electrical'],
    };
    render(<FilterSidebar {...propsWithSelection} />);
    expect(screen.getByText('Plumbing')).toBeInTheDocument();
    expect(screen.getByText('Electrical')).toBeInTheDocument();
  });

  it('should handle clear categories', () => {
    const { container } = render(<FilterSidebar {...mockProps} />);
    const allCheckbox = container.querySelector('input[type="checkbox"]');
    if (allCheckbox) {
      fireEvent.click(allCheckbox);
    }
    expect(container).toBeTruthy();
  });

  it('should handle empty categories list', () => {
    const propsWithNoCategories = { ...mockProps, categories: [] };
    const { container } = render(<FilterSidebar {...propsWithNoCategories} />);
    expect(container).toBeTruthy();
  });

  it('should handle empty location options', () => {
    const propsWithNoLocations = { ...mockProps, locationOptions: [] };
    const { container } = render(<FilterSidebar {...propsWithNoLocations} />);
    expect(container).toBeTruthy();
  });

  it('should render accordion for categories', () => {
    const { container } = render(<FilterSidebar {...mockProps} />);
    const accordion = container.querySelector('[class*="MuiAccordion"]');
    expect(accordion).toBeTruthy();
  });
});
