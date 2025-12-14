import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'auto';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  getEffectiveTheme: () => 'light' | 'dark';
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      setTheme: (theme: Theme) => {
        set({ theme });
        applyTheme(theme);
      },
      getEffectiveTheme: () => {
        const { theme } = get();
        if (theme === 'auto') {
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return theme;
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.theme) {
          // Apply theme immediately on rehydration
          setTimeout(() => {
            applyTheme(state.theme);
          }, 0);
        } else {
          // Default to light if no theme is stored
          applyTheme('light');
        }
      },
    }
  )
);

const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  
  if (theme === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.remove('light', 'dark');
    root.classList.add(prefersDark ? 'dark' : 'light');
  } else {
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }
};

// Initialize theme on load
if (typeof window !== 'undefined') {
  // Listen for system theme changes when auto is selected
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleSystemThemeChange = () => {
    const store = useThemeStore.getState();
    if (store.theme === 'auto') {
      applyTheme('auto');
    }
  };
  
  // Add listener for system theme changes
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleSystemThemeChange);
  } else {
    // Fallback for older browsers
    mediaQuery.addListener(handleSystemThemeChange);
  }
}

