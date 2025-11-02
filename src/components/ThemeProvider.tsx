import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const theme = useSelector((state: RootState) => state.themeState.theme);

  useEffect(() => {
    // Apply theme to document on mount and when theme changes
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return <>{children}</>;
};

export default ThemeProvider;
