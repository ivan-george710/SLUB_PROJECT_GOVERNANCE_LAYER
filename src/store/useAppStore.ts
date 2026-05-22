import { create } from 'zustand';

// Define the shape of your state
interface AppState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  isPresentationMode: boolean;
  togglePresentationMode: () => void;
  setPresentationMode: (val: boolean) => void;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (isOpen: boolean) => void;
}

// Create the Zustand store
export const useAppStore = create<AppState>((set) => ({
  theme: 'dark', // Default to dark as per design
  setTheme: (theme) => set({ theme }),
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
    return { theme: newTheme };
  }),
  isPresentationMode: false,
  togglePresentationMode: () => set((state) => {
    // If entering presentation mode, we can try to request fullscreen
    if (!state.isPresentationMode) {
      if (typeof document !== 'undefined' && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch((err) => console.log(err));
      }
    } else {
      if (typeof document !== 'undefined' && document.exitFullscreen) {
        document.exitFullscreen().catch((err) => console.log(err));
      }
    }
    return { isPresentationMode: !state.isPresentationMode };
  }),
  setPresentationMode: (val: boolean) => set({ isPresentationMode: val }),
  isMobileMenuOpen: false,
  setMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen }),
}));
