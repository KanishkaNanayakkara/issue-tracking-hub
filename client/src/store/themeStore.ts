import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeStore {
    isDark: boolean;
    toggle: () => void;
    setTheme: (dark: boolean) => void;
}

export const useThemeStore = create<ThemeStore>()(
    persist(
        (set, get) => ({
            isDark: false,

            toggle: () => {
                const newValue = !get().isDark;
                set({ isDark: newValue });
                updateDocumentClass(newValue);
            },

            setTheme: (dark: boolean) => {
                set({ isDark: dark });
                updateDocumentClass(dark);
            },
        }),
        {
            name: 'theme-storage',
            onRehydrateStorage: () => (state) => {
                // Apply theme on rehydration
                if (state) {
                    updateDocumentClass(state.isDark);
                }
            },
        }
    )
);

function updateDocumentClass(isDark: boolean) {
    if (isDark) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}
