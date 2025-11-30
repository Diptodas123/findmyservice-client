import { configureStore } from '@reduxjs/toolkit';
import cartReducer, { setCart } from './cartSlice';
import userReducer, { setUser } from './userSlice';
import searchReducer from './searchSlice';
import providerReducer, { setProvider } from './providerSlice';

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

const loadProvider = () => {
  try {
    const raw = localStorage.getItem('providerDetails');
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
};

const saveProvider = (state) => {
  try {
    const payload = JSON.stringify(state.provider.profile || {});
    localStorage.setItem('providerDetails', payload);
  } catch {
    // ignore
  }
};

const preloadedCart = loadCart();
const preloadedUser = loadUser();
const preloadedProvider = loadProvider();

const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
    search: searchReducer,
    provider: providerReducer
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

if (preloadedProvider && typeof preloadedProvider === 'object') {
  try {
    // Handle migration: if provider data has nested profile, extract it
    const providerData = preloadedProvider.profile ? preloadedProvider.profile : preloadedProvider;
    store.dispatch(setProvider(providerData));
  } catch {
    // ignore
  }
}

store.subscribe(() => {
  saveCart(store.getState());
  saveUser(store.getState());
  saveProvider(store.getState());
});

export default store;
