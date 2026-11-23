import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeModeProvider } from '../theme/themeModeContext';
import { buildTheme } from '../theme/theme';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../store/userSlice';
import cartReducer from '../store/cartSlice';

// Create a test store
export const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      user: userReducer,
      cart: cartReducer,
    },
    preloadedState,
  });
};

// Custom render with all providers
export const renderWithProviders = (
  ui,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    mode = 'light',
    ...renderOptions
  } = {}
) => {
  const theme = buildTheme(mode);
  
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <ThemeModeProvider value={{ mode, setMode: () => {} }}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
              {children}
            </BrowserRouter>
          </ThemeProvider>
        </ThemeModeProvider>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

// Re-export everything
// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react';
export { renderWithProviders as render };
