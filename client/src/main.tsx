import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Theme is already initialized in index.html script tag to prevent flicker
// This is just a fallback in case the script didn't run
const initializeTheme = () => {
  if (!document.documentElement.classList.contains('light') && !document.documentElement.classList.contains('dark')) {
  const savedTheme = localStorage.getItem('theme-storage');
  if (savedTheme) {
    try {
      const parsed = JSON.parse(savedTheme);
      const theme = parsed.state?.theme || 'light';
      const root = document.documentElement;
      
      if (theme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.remove('light', 'dark');
        root.classList.add(prefersDark ? 'dark' : 'light');
      } else {
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
      }
    } catch {
      document.documentElement.classList.add('light');
    }
  } else {
    document.documentElement.classList.add('light');
    }
  }
};

initializeTheme();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)





