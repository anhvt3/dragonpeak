import React, { createContext, useContext, ReactNode } from 'react';

interface ThemeContextValue {
  assets: any;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
  assets: any;
}

export function ThemeProvider({ children, assets }: ThemeProviderProps) {
  const value: ThemeContextValue = {
    assets,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

