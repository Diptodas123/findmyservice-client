import { useContext } from 'react';
import ThemeModeContext from './themeModeContext.jsx';

export const useThemeMode = () => useContext(ThemeModeContext);
