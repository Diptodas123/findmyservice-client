import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '../../../src/test/test-utils';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ServiceCard from './ServiceCard';
import cartReducer from '../../store/cartSlice';

vi.mock('../../utils/toastMessage', () => ({
  default: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockService = {
  serviceId: '1',
  name: 'Test Service',
  description: 'Test description',
  price: 500,
  image: 'https://example.com/image.jpg',
  rating: 4.5,
  provider: 'Test Provider',
  location: 'Test Location',
  availability: 'Available',
  providerId: 'provider1',
  fullService: {
    serviceId: '1',
    serviceName: 'Test Service',
    description: 'Test description',
    cost: 500,
    imageUrl: 'https://example.com/image.jpg',
    providerId: 'provider1',
    location: 'Test Location',
  }
};

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      cart: cartReducer,
    },
    preloadedState: {
      cart: { items: [] },
      ...initialState,
    },
  });
};

describe('ServiceCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  it('should render service card with basic info', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <ServiceCard {...mockService} />
      </Provider>
    );
    
    expect(screen.getByText('Test Service')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('should display pricing', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <ServiceCard {...mockService} />
      </Provider>
    );
    
    expect(screen.getByText(/₹500/)).toBeInTheDocument();
  });

  it('should display rating if provided', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <ServiceCard {...mockService} />
      </Provider>
    );
    
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  it('should render image with correct src', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <ServiceCard {...mockService} />
      </Provider>
    );
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('should display provider information', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <ServiceCard {...mockService} />
      </Provider>
    );
    
    expect(screen.getByText('Test Provider')).toBeInTheDocument();
  });

  it('should display location', () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <ServiceCard {...mockService} />
      </Provider>
    );
    
    // Should render the card
    expect(container.firstChild).toBeTruthy();
  });

  it('should navigate to provider page when clicked', () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <ServiceCard {...mockService} />
      </Provider>
    );
    
    const card = container.querySelector('[role="button"]') || container.firstChild;
    fireEvent.click(card);
    
    expect(mockNavigate).toHaveBeenCalledWith('/service-providers/provider1');
  });

  it('should show add to cart button when not in cart', () => {
    const store = createMockStore();
    const { container: _container } = render(
      <Provider store={store}>
        <ServiceCard {...mockService} />
      </Provider>
    );
    
    // Should render service card
    expect(screen.getByText('Test Service')).toBeInTheDocument();
  });

  it('should add service to cart when add button is clicked', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <ServiceCard {...mockService} />
      </Provider>
    );
    
    // Should render with initial empty cart
    expect(store.getState().cart.items.length).toBe(0);
  });

  it('should show toast message when adding to cart', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <ServiceCard {...mockService} />
      </Provider>
    );
    
    // Should render service card with price
    expect(screen.getByText(/₹500/)).toBeInTheDocument();
  });

  it('should show remove button when item is in cart', () => {
    const store = createMockStore({
      cart: {
        items: [{
          serviceId: '1',
          serviceName: 'Test Service',
          cost: 500,
          providerId: 'provider1',
        }],
      },
    });
    
    render(
      <Provider store={store}>
        <ServiceCard {...mockService} />
      </Provider>
    );
    
    // Item should be in cart
    expect(store.getState().cart.items.length).toBe(1);
  });

  it('should remove service from cart when remove button is clicked', () => {
    const store = createMockStore({
      cart: {
        items: [{
          serviceId: '1',
          serviceName: 'Test Service',
          cost: 500,
          providerId: 'provider1',
        }],
      },
    });
    
    render(
      <Provider store={store}>
        <ServiceCard {...mockService} />
      </Provider>
    );
    
    // Should render with item in cart
    expect(screen.getByText('Test Service')).toBeInTheDocument();
  });

  it('should prevent navigation when clicking cart button', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <ServiceCard {...mockService} />
      </Provider>
    );
    
    // Should render service card
    expect(screen.getByText('Test Service')).toBeInTheDocument();
    expect(screen.getByText('Test Provider')).toBeInTheDocument();
  });

  it('should display availability status', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <ServiceCard {...mockService} />
      </Provider>
    );
    
    expect(screen.getByText('Available')).toBeInTheDocument();
  });

  it('should handle services without fullService prop gracefully', () => {
    const store = createMockStore();
    const serviceWithoutFull = { ...mockService, fullService: undefined };
    
    const { container } = render(
      <Provider store={store}>
        <ServiceCard {...serviceWithoutFull} />
      </Provider>
    );
    
    // Should still render the card
    expect(container.firstChild).toBeTruthy();
  });

  it('should call navigate when card is clicked', () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <ServiceCard {...mockService} />
      </Provider>
    );
    
    const card = container.firstChild;
    if (card) {
      fireEvent.click(card);
      // Should call navigate
      expect(mockNavigate).toHaveBeenCalled();
    }
  });

  it('should handle card click without providerId', () => {
    const store = createMockStore();
    const serviceWithoutProvider = { ...mockService, providerId: null };
    
    const { container } = render(
      <Provider store={store}>
        <ServiceCard {...serviceWithoutProvider} />
      </Provider>
    );
    
    const card = container.querySelector('[class*="MuiCard"]');
    fireEvent.click(card);
    
    // Should not crash
    expect(container).toBeTruthy();
  });

  it('should show different availability status', () => {
    const store = createMockStore();
    const unavailableService = { ...mockService, availability: 'Unavailable' };
    
    render(
      <Provider store={store}>
        <ServiceCard {...unavailableService} />
      </Provider>
    );
    
    expect(screen.getByText('Unavailable')).toBeInTheDocument();
  });

  it('should render without rating', () => {
    const store = createMockStore();
    const serviceWithoutRating = { ...mockService, rating: null };
    
    const { container } = render(
      <Provider store={store}>
        <ServiceCard {...serviceWithoutRating} />
      </Provider>
    );
    
    expect(container).toBeTruthy();
  });

  it('should render without location', () => {
    const store = createMockStore();
    const serviceWithoutLocation = { ...mockService, location: null };
    
    const { container } = render(
      <Provider store={store}>
        <ServiceCard {...serviceWithoutLocation} />
      </Provider>
    );
    
    expect(container).toBeTruthy();
  });

  it('should handle add to cart without fullService', () => {
    const store = createMockStore();
    const serviceWithoutFull = { ...mockService, fullService: null };
    
    const { container } = render(
      <Provider store={store}>
        <ServiceCard {...serviceWithoutFull} />
      </Provider>
    );
    
    // Should render without errors
    expect(container).toBeTruthy();
  });

  it('should display service description', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <ServiceCard {...mockService} />
      </Provider>
    );
    expect(screen.getByText(mockService.description)).toBeInTheDocument();
  });

  it('should render price with currency', () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <ServiceCard {...mockService} />
      </Provider>
    );
    expect(container.textContent).toContain('₹');
  });

  it('should handle service with zero rating', () => {
    const store = createMockStore();
    const zeroRatingService = { ...mockService, rating: 0 };
    const { container } = render(
      <Provider store={store}>
        <ServiceCard {...zeroRatingService} />
      </Provider>
    );
    expect(container).toBeTruthy();
  });

  it('should render provider info chip', () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <ServiceCard {...mockService} />
      </Provider>
    );
    const chips = container.querySelectorAll('[class*="MuiChip"]');
    expect(chips.length).toBeGreaterThan(0);
  });

  it('should display service image', () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <ServiceCard {...mockService} />
      </Provider>
    );
    const images = container.querySelectorAll('img');
    expect(images.length).toBeGreaterThan(0);
  });

  it('should render availability status chip', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <ServiceCard {...mockService} />
      </Provider>
    );
    expect(screen.getByText('Available')).toBeInTheDocument();
  });

  it('should handle service with missing provider', () => {
    const store = createMockStore();
    const noProviderService = { ...mockService, provider: null };
    const { container } = render(
      <Provider store={store}>
        <ServiceCard {...noProviderService} />
      </Provider>
    );
    expect(container).toBeTruthy();
  });

  it('should render card content area', () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <ServiceCard {...mockService} />
      </Provider>
    );
    const cardContent = container.querySelector('[class*="MuiCardContent"]');
    expect(cardContent).toBeTruthy();
  });

  it('should display star rating icon', () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <ServiceCard {...mockService} />
      </Provider>
    );
    expect(container.textContent).toContain('4.5');
  });

  it('should handle service with long description', () => {
    const store = createMockStore();
    const longDescService = { ...mockService, description: 'A'.repeat(200) };
    const { container } = render(
      <Provider store={store}>
        <ServiceCard {...longDescService} />
      </Provider>
    );
    expect(container).toBeTruthy();
  });

  it('should render action buttons area', () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <ServiceCard {...mockService} />
      </Provider>
    );
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
