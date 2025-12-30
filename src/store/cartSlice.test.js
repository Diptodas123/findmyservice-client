import { describe, it, expect } from 'vitest';
import cartReducer, { addItem, removeItem, clearCart, setCart, updateRequestedDate } from './cartSlice';

describe('cartSlice', () => {
  const initialState = {
    items: [],
  };

  it('should return initial state', () => {
    expect(cartReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle addItem', () => {
    const item = {
      serviceId: '1',
      serviceName: 'Test Service',
      price: 500,
    };

    const actual = cartReducer(initialState, addItem(item));
    expect(actual.items).toHaveLength(1);
    expect(actual.items[0]).toEqual(item);
  });

  it('should not add duplicate items', () => {
    const item = {
      serviceId: '1',
      serviceName: 'Test Service',
      price: 500,
    };

    const stateWithItem = cartReducer(initialState, addItem(item));
    const actual = cartReducer(stateWithItem, addItem(item));
    
    expect(actual.items).toHaveLength(1);
  });

  it('should handle removeItem with serviceId', () => {
    const item = {
      serviceId: '1',
      serviceName: 'Test Service',
      price: 500,
    };

    const stateWithItem = cartReducer(initialState, addItem(item));
    const actual = cartReducer(stateWithItem, removeItem('1'));
    
    expect(actual.items).toHaveLength(0);
  });

  it('should handle clearCart', () => {
    const item = {
      serviceId: '1',
      serviceName: 'Test Service',
      price: 500,
    };

    const stateWithItem = cartReducer(initialState, addItem(item));
    const actual = cartReducer(stateWithItem, clearCart());
    
    expect(actual.items).toHaveLength(0);
  });

  it('should handle setCart', () => {
    const items = [
      { serviceId: '1', serviceName: 'Service 1', price: 100 },
      { serviceId: '2', serviceName: 'Service 2', price: 200 },
    ];

    const actual = cartReducer(initialState, setCart(items));
    expect(actual.items).toHaveLength(2);
    expect(actual.items).toEqual(items);
  });

  it('should handle updateRequestedDate', () => {
    const item = {
      serviceId: '1',
      serviceName: 'Test Service',
      price: 500,
    };

    const stateWithItem = cartReducer(initialState, addItem(item));
    const actual = cartReducer(stateWithItem, updateRequestedDate({ 
      serviceId: '1', 
      requestedDate: '2025-01-01' 
    }));
    
    expect(actual.items[0].requestedDate).toBe('2025-01-01');
  });
});
