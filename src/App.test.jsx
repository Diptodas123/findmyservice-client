import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from './store/store';
import App from './App';

// Mock lazy loaded components
vi.mock('./pages/Home/HomePage.jsx', () => ({
  default: () => <div>HomePage</div>,
}));

vi.mock('./pages/Profile/ProfilePage.jsx', () => ({
  default: () => <div>ProfilePage</div>,
}));

vi.mock('./pages/Login/Login.jsx', () => ({
  default: () => <div>Login</div>,
}));

vi.mock('./pages/Signup/Signup.jsx', () => ({
  default: () => <div>Signup</div>,
}));

vi.mock('./pages/ServiceProviderDetails/ServiceProviderDetails.jsx', () => ({
  default: () => <div>ServiceProviderDetails</div>,
}));

vi.mock('./pages/ServiceDetails/ServiceDetails.jsx', () => ({
  default: () => <div>ServiceDetails</div>,
}));

vi.mock('./pages/Cart/Cart.jsx', () => ({
  default: () => <div>Cart</div>,
}));

vi.mock('./pages/ProviderDashboard/ProviderDashboard.jsx', () => ({
  default: () => <div>ProviderDashboard</div>,
}));

vi.mock('./pages/Search/Search.jsx', () => ({
  default: () => <div>Search</div>,
}));

vi.mock('./pages/NotFound/NotFound.jsx', () => ({
  default: () => <div>NotFound</div>,
}));

vi.mock('./pages/Contact/Contact.jsx', () => ({
  default: () => <div>Contact</div>,
}));

describe('App', () => {
  it('should render app', () => {
    const { container } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(container).toBeTruthy();
  });
});
