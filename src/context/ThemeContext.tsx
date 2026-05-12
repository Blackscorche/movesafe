import React, { createContext, useContext, ReactNode } from 'react';
import { colors, ColorKey } from '../utils/theme';

interface ThemeContextValue {
  colors: typeof colors;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  colors,
  isDark: true,
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeContext.Provider value={{ colors, isDark: true }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  return useContext(ThemeContext);
};
