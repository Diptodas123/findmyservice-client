import { StrictMode, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { buildTheme } from './theme/theme.js'
import { ThemeModeProvider } from './theme/themeModeContext.jsx'
import { ToastContainer } from 'react-toastify'
import { Provider } from 'react-redux'
import store from './store/store'

const Root = () => {
  const [modeState, setModeState] = useState(() => {
    try {
      return localStorage.getItem('themeMode') || 'light';
    } catch {
      return 'light';
    }
  });

  // wrapper setMode that persists to localStorage and supports functional updates
  const setMode = (value) => {
    setModeState((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      try {
        localStorage.setItem('themeMode', next);
      } catch {
        // ignore
      }
      return next;
    });
  };

  const theme = useMemo(() => buildTheme(modeState), [modeState]);

  return (
    <ThemeModeProvider value={{ mode: modeState, setMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastContainer theme={modeState === 'dark' ? 'dark' : 'light'} />
        <Provider store={store}>
          <App />
        </Provider>
      </ThemeProvider>
    </ThemeModeProvider>
  );
};


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
)

export default Root;
