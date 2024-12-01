import { useEffect, useState } from 'react';

const STORAGE_PREFIX = 'vanij-poc';

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}-theme`);
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem(`${STORAGE_PREFIX}-theme`, theme);
  }, [theme]);

  return { theme, setTheme };
}