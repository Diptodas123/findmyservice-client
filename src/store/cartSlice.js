import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const toId = (val, key) =>
  val !== null && typeof val === 'object' ? val[key] ?? val.id ?? null : val;

const normalizeItem = (item) => ({
  ...item,
  providerId: toId(item.providerId, 'providerId'),
  serviceId: toId(item.serviceId, 'serviceId'),
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      const normalizedItem = normalizeItem(action.payload);
      const exists = state.items.find(i => i.serviceId === normalizedItem.serviceId);
      if (!exists) {
        state.items.push(normalizedItem);
      }
    },
    removeItem(state, action) {
      const predicate = action.payload;
      if (typeof predicate === 'function') {
        state.items = state.items.filter(i => !predicate(i));
      } else if (predicate && typeof predicate === 'object' && predicate.providerId && predicate.serviceName) {
        state.items = state.items.filter(i => !(i.providerId === predicate.providerId && i.serviceName === predicate.serviceName));
      } else {
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
      state.items = (action.payload || []).map(normalizeItem);
    }
  }
});

export const { addItem, removeItem, clearCart, setCart, updateRequestedDate } = cartSlice.actions;
export default cartSlice.reducer;
