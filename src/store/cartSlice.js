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
      const exists = state.items.find(i => i.providerId === item.providerId && i.serviceName === item.serviceName);
      if (!exists) state.items.push(item);
    },
    removeItem(state, action) {
      const predicate = action.payload; 
      if (typeof predicate === 'function') {
        state.items = state.items.filter(i => !predicate(i));
      } else if (predicate && typeof predicate === 'object' && predicate.providerId && predicate.serviceName) {
        state.items = state.items.filter(i => !(i.providerId === predicate.providerId && i.serviceName === predicate.serviceName));
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

export const { addItem, removeItem, clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;
