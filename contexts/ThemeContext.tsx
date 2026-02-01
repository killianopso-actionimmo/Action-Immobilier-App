import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        // Charger le thème depuis localStorage ou utiliser 'dark' par défaut
        const saved = localStorage.getItem('app_theme');
        return (saved as Theme) || 'dark';
    });

    useEffect(() => {
        // Sauvegarder le thème dans localStorage
        localStorage.setItem('app_theme', theme);

        // Appliquer la classe au body
        document.body.classList.remove('dark', 'light');
        document.body.classList.add(theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
