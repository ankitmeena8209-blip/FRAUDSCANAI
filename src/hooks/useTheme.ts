import { useEffect, useState } from 'react';
import { loadTheme, saveTheme } from '../services/storage';

export function useTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => loadTheme());

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('light', theme === 'light');
    saveTheme(theme);
  }, [theme]);

  return { theme, setTheme } as const;
}
