import { createContext } from 'react';

const ThemeModeContext = createContext({
    mode: 'light',
    setMode: () => { }
});

export const ThemeModeProvider = ({ value, children }) => (
    <ThemeModeContext.Provider value={value}>
        {children}
    </ThemeModeContext.Provider>
);

export default ThemeModeContext;
