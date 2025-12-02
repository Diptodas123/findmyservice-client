import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      const item = action.payload;
      
      // Check if item already exists
      const exists = state.items.find(i => i.serviceId === item.serviceId);
      if (!exists) {
        state.items.push(item);
      }
    },
    removeItem(state, action) {
      const predicate = action.payload; 
      if (typeof predicate === 'function') {
        state.items = state.items.filter(i => !predicate(i));
      } else if (predicate && typeof predicate === 'object' && predicate.providerId && predicate.serviceName) {
        state.items = state.items.filter(i => !(i.providerId === predicate.providerId && i.serviceName === predicate.serviceName));
      } else {
        // Handle serviceId as a simple value
        state.items = state.items.filter(i => i.serviceId !== predicate);
      }
    },
    updateRequestedDate(state, action) {
      const { serviceId, requestedDate } = action.payload;
      const item = state.items.find(i => i.serviceId === serviceId);
      if (item) {
        item.requestedDate = requestedDate;
      }
    },
    clearCart(state) {
      state.items = [];
    },
    setCart(state, action) {
      state.items = action.payload || [];
    }
  }
});

export const { addItem, removeItem, clearCart, setCart, updateRequestedDate } = cartSlice.actions;
export default cartSlice.reducer;
