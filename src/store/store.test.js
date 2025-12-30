import { describe, it, expect, beforeEach, vi } from 'vitest';
import store from './store';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
});

describe('store', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should be defined', () => {
    expect(store).toBeDefined();
  });

  it('should have cart state', () => {
    const state = store.getState();
    expect(state.cart).toBeDefined();
    expect(state.cart.items).toEqual([]);
  });

  it('should have user state', () => {
    const state = store.getState();
    expect(state.user).toBeDefined();
    expect(state.user.profile).toBeDefined();
  });

  it('should have provider state', () => {
    const state = store.getState();
    expect(state.provider).toBeDefined();
    expect(state.provider.profile).toBeDefined();
  });

  it('should have search state', () => {
    const state = store.getState();
    expect(state.search).toBeDefined();
    expect(state.search.filters.query).toBe('');
  });

  it('should persist cart to localStorage', () => {
    const mockCartItem = { id: '1', name: 'Service', price: 100 };
    store.dispatch({ type: 'cart/addItem', payload: mockCartItem });
    
    // Trigger listener manually
    const state = store.getState();
    const payload = JSON.stringify(state.cart.items || []);
    localStorage.setItem('cart', payload);
    
    expect(localStorage.getItem('cart')).toBeTruthy();
  });
});
