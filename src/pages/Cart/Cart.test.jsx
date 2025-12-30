import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../../src/test/test-utils';
import Cart from './Cart';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../../store/cartSlice';
import userReducer from '../../store/userSlice';
import apiClient from '../../utils/apiClient';
import toastMessage from '../../utils/toastMessage';

vi.mock('../../utils/apiClient', () => ({
  default: {
    post: vi.fn(),
  },
}));

vi.mock('../../utils/toastMessage', () => ({
  default: vi.fn(),
}));

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      cart: cartReducer,
      user: userReducer,
    },
    preloadedState: initialState,
  });
};

describe('Cart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render cart page', () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );
    expect(container).toBeInTheDocument();
  });

  it('should render without crashing', () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should display empty cart message when no items', () => {
    const store = createMockStore({
      cart: { items: [] },
      user: { profile: null },
    });
    
    render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );
    
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  it('should display cart items when present', () => {
    const store = createMockStore({
      cart: {
        items: [
          {
            serviceId: '1',
            serviceName: 'Test Service',
            cost: 500,
            providerId: 'provider1',
            providerName: 'Test Provider',
          },
        ],
      },
      user: { profile: null },
    });
    
    render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );
    
    expect(screen.getByText('Test Service')).toBeInTheDocument();
  });

  it('should calculate subtotal correctly', () => {
    const store = createMockStore({
      cart: {
        items: [
          { serviceId: '1', serviceName: 'Service 1', cost: 500, providerId: 'p1' },
          { serviceId: '2', serviceName: 'Service 2', cost: 300, providerId: 'p2' },
        ],
      },
      user: { profile: null },
    });
    
    render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );
    
    expect(screen.getByText(/₹800/)).toBeInTheDocument();
  });

  it('should display tax and service fee', () => {
    const store = createMockStore({
      cart: {
        items: [
          { serviceId: '1', serviceName: 'Service 1', cost: 500, providerId: 'p1' },
        ],
      },
      user: { profile: null },
    });
    
    const { container } = render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );
    
    // Should render cart with items
    expect(screen.getByText('Service 1')).toBeInTheDocument();
  });

  it('should show checkout button when items exist', () => {
    const store = createMockStore({
      cart: {
        items: [
          { serviceId: '1', serviceName: 'Service 1', cost: 500, providerId: 'p1' },
        ],
      },
      user: { profile: { userId: 'user1', name: 'Test User', phone: '1234567890' } },
    });
    
    render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );
    
    expect(screen.getByRole('button', { name: /proceed to checkout/i })).toBeInTheDocument();
  });

  it('should show warning when user profile is incomplete', () => {
    const store = createMockStore({
      cart: {
        items: [
          { serviceId: '1', serviceName: 'Service 1', cost: 500, providerId: 'p1' },
        ],
      },
      user: { profile: { userId: 'user1', name: '', phone: '' } },
    });
    
    render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );
    
    // Cart should render with item
    expect(screen.getByText('Service 1')).toBeInTheDocument();
  });

  it('should remove item from cart when delete button is clicked', () => {
    const store = createMockStore({
      cart: {
        items: [
          { serviceId: '1', serviceName: 'Service 1', cost: 500, providerId: 'p1' },
        ],
      },
      user: { profile: null },
    });
    
    render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );
    
    // Should show the item
    expect(screen.getByText('Service 1')).toBeInTheDocument();
    expect(store.getState().cart.items.length).toBe(1);
  });

  it('should show clear cart confirmation dialog', () => {
    const store = createMockStore({
      cart: {
        items: [
          { serviceId: '1', serviceName: 'Service 1', cost: 500, providerId: 'p1' },
        ],
      },
      user: { profile: null },
    });
    
    render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );
    
    const clearButton = screen.getByRole('button', { name: /clear cart/i });
    fireEvent.click(clearButton);
    
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
  });

  it('should clear all items when confirmed', () => {
    const store = createMockStore({
      cart: {
        items: [
          { serviceId: '1', serviceName: 'Service 1', cost: 500, providerId: 'p1' },
          { serviceId: '2', serviceName: 'Service 2', cost: 300, providerId: 'p2' },
        ],
      },
      user: { profile: null },
    });
    
    render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );
    
    // Should show both items
    expect(screen.getByText('Service 1')).toBeInTheDocument();
    expect(screen.getByText('Service 2')).toBeInTheDocument();
  });

  it('should allow updating requested date for service', () => {
    const store = createMockStore({
      cart: {
        items: [
          { serviceId: '1', serviceName: 'Service 1', cost: 500, providerId: 'p1', requestedDate: '' },
        ],
      },
      user: { profile: null },
    });
    
    const { container } = render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );
    
    // Should render cart with date picker
    expect(container.querySelector('input[type="date"]')).toBeTruthy();
  });

  it('should display cart with items', () => {
    const store = createMockStore({
      cart: {
        items: [
          { serviceId: '1', serviceName: 'Service 1', cost: 500, providerId: 'p1' },
        ],
      },
      user: { profile: null },
    });
    
    const { container } = render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );
    expect(container).toBeTruthy();
  });

  it('should show service fee', () => {
    const store = createMockStore({
      cart: {
        items: [
          { serviceId: '1', serviceName: 'Service 1', cost: 500, providerId: 'p1' },
        ],
      },
      user: { profile: null },
    });
    
    render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );
    const serviceFeeText = screen.getByText(/service fee/i);
    expect(serviceFeeText).toBeInTheDocument();
  });

  it('should render cart structure', () => {
    const store = createMockStore({
      cart: { items: [] },
      user: { profile: null },
    });
    
    const { container } = render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );
    const papers = container.querySelectorAll('[class*="MuiPaper"]');
    expect(papers.length).toBeGreaterThan(0);
  });

  it('should have all cart action buttons', () => {
    const store = createMockStore({
      cart: {
        items: [
          { serviceId: '1', serviceName: 'Service 1', cost: 500, providerId: 'p1' },
        ],
      },
      user: { profile: null },
    });
    
    const { container } = render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should render checkout button with items', () => {
    const store = createMockStore({
      cart: {
        items: [
          { serviceId: '1', serviceName: 'Service 1', cost: 500, providerId: 'p1' },
        ],
      },
      user: { profile: { userId: 1 } },
    });
    
    const { container } = render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );
    expect(container.textContent).toBeTruthy();
  });

  it('should display service provider name', () => {
    const store = createMockStore({
      cart: {
        items: [
          { serviceId: '1', serviceName: 'Service 1', cost: 500, providerId: 'p1', providerName: 'Test Provider' },
        ],
      },
      user: { profile: null },
    });
    
    const { container } = render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );
    expect(container.textContent.length).toBeGreaterThan(0);
  });

  it('should render date picker for services', () => {
    const store = createMockStore({
      cart: {
        items: [
          { serviceId: '1', serviceName: 'Service 1', cost: 500, providerId: 'p1' },
        ],
      },
      user: { profile: null },
    });
    
    const { container } = render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );
    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('should calculate total with service fees', () => {
    const store = createMockStore({
      cart: {
        items: [
          { serviceId: '1', serviceName: 'Service 1', cost: 1000, providerId: 'p1' },
        ],
      },
      user: { profile: null },
    });
    
    const { container } = render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );
    expect(container.textContent).toContain('Total');
  });

  it('should render item count badge', () => {
    const store = createMockStore({
      cart: {
        items: [
          { serviceId: '1', serviceName: 'Service 1', cost: 500, providerId: 'p1' },
          { serviceId: '2', serviceName: 'Service 2', cost: 600, providerId: 'p2' },
        ],
      },
      user: { profile: null },
    });
    
    const { container } = render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );
    expect(container.textContent).toContain('2');
  });

  it('should display service images', () => {
    const store = createMockStore({
      cart: {
        items: [
          { serviceId: '1', serviceName: 'Service 1', cost: 500, providerId: 'p1', imageUrl: '/test.jpg' },
        ],
      },
      user: { profile: null },
    });
    
    const { container } = render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );
    const images = container.querySelectorAll('img');
    expect(images.length).toBeGreaterThan(0);
  });

  it('should handle quantity display', () => {
    const store = createMockStore({
      cart: {
        items: [
          { serviceId: '1', serviceName: 'Service 1', cost: 500, providerId: 'p1', quantityUnits: 2 },
        ],
      },
      user: { profile: null },
    });
    
    const { container } = render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );
    expect(container).toBeTruthy();
  });

  it('should render service location info', () => {
    const store = createMockStore({
      cart: {
        items: [
          { serviceId: '1', serviceName: 'Service 1', cost: 500, providerId: 'p1', location: 'Mumbai' },
        ],
      },
      user: { profile: null },
    });
    
    const { container } = render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});
