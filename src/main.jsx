import { StrictMode, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { buildTheme } from './theme/theme.js'
import { ThemeModeProvider } from './theme/themeModeContext.jsx'
import { ToastContainer } from 'react-toastify'

const Root = () => {
  const [mode, setMode] = useState('light');
  const theme = useMemo(() => buildTheme(mode), [mode]);

  return (
    <ThemeModeProvider value={{ mode, setMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastContainer />
        <App />
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
