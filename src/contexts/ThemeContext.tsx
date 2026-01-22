import React, { createContext, useContext, ReactNode } from 'react';
import { useDeviceType, DeviceType } from '@/hooks/useDeviceType';
import { themeAssets, ThemeAssets } from '@/config/themeAssets';

interface ThemeContextValue {
  deviceType: DeviceType;
  assets: ThemeAssets;
  isMobile: boolean;
  isPC: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const deviceType = useDeviceType();
  const assets = themeAssets[deviceType];

  const value: ThemeContextValue = {
    deviceType,
    assets,
    isMobile: deviceType === 'mobile',
    isPC: deviceType === 'pc',
  };

  return (
    <ThemeContext.Provider value={value}>
      <div className={`theme-${deviceType}`}>
        {children}
      </div>
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
