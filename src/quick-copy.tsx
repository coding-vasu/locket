import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { QuickCopyWindow } from './components/features/QuickCopyWindow';
import { useUIStore } from './store/uiStore';

export function QuickCopyApp() {
  const theme = useUIStore((state) => state.theme);

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  return <QuickCopyWindow />;
}

ReactDOM.createRoot(document.getElementById('quick-copy-root')!).render(
  <React.StrictMode>
    <QuickCopyApp />
  </React.StrictMode>
);
