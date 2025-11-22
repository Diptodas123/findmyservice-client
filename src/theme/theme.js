import { createTheme } from '@mui/material/styles';

// Theme factory to support light/dark mode toggle
export function buildTheme(mode = 'light') {
  const isLight = mode === 'light';
  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#3949AB',
        light: '#9FA8DA',
        dark: '#283593'
      },
      secondary: {
        main: '#FFB300',
        light: '#FFE082',
        dark: '#FFA000'
      },
      background: isLight
        ? { default: '#F6F8FA', paper: '#FFFFFF' }
        : { default: '#121212', paper: '#1E1E1E' },
      divider: isLight ? '#E2E8F0' : '#2E2E2E'
    },
    shape: { borderRadius: 8 },
    components: {
      MuiButton: { styleOverrides: { root: { textTransform: 'none' } } },
      MuiAppBar: { styleOverrides: { root: { transition: 'background-color .3s ease' } } }
    }
  });
}

export default buildTheme();
