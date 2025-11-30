import { configureStore } from '@reduxjs/toolkit';
import cartReducer, { setCart } from './cartSlice';
import userReducer, { setUser } from './userSlice';
import searchReducer from './searchSlice';

const loadCart = () => {
  try {
    const raw = localStorage.getItem('cart');
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    //ignore
  }
};

const saveCart = (state) => {
  try {
    const payload = JSON.stringify(state.cart.items || []);
    localStorage.setItem('cart', payload);
  } catch {
    // ignore
  }
};

const loadUser = () => {
  try {
    const raw = localStorage.getItem('userDetails');
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
};

const saveUser = (state) => {
  try {
    const payload = JSON.stringify(state.user.profile || {});
    localStorage.setItem('userDetails', payload);
  } catch {
    // ignore
  }
};

const preloadedCart = loadCart();
const preloadedUser = loadUser();

const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
    search: searchReducer
  },
});

// Hydrate persisted data after store creation — lets reducers process incoming data
if (preloadedCart && Array.isArray(preloadedCart)) {
  try {
    store.dispatch(setCart(preloadedCart));
  } catch {
    // ignore
  }
}

if (preloadedUser && typeof preloadedUser === 'object') {
  try {
    store.dispatch(setUser(preloadedUser));
  } catch {
    // ignore
  }
}

store.subscribe(() => {
  saveCart(store.getState());
  saveUser(store.getState());
});

export default store;
