import en from '../../../lang/en.json';
import id from '../../../lang/id.json';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEYS = {
    language: 'starterkit-language',
    theme: 'starterkit-theme',
};

const fallbackTranslations = { en, id };

const AppSettingsContext = createContext(null);

const resolveInitialLanguage = (initialLocale) => {
    return localStorage.getItem(STORAGE_KEYS.language) || initialLocale || 'en';
};

const resolveInitialTheme = () => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);

    if (savedTheme) {
        return savedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
};

export function AppSettingsProvider({
    children,
    initialLocale = 'en',
    sharedTranslations = {},
}) {
    const [language, setLanguage] = useState(() =>
        resolveInitialLanguage(initialLocale),
    );
    const [theme, setTheme] = useState(resolveInitialTheme);

    const translationMap = useMemo(() => {
        return {
            ...fallbackTranslations,
            [initialLocale]: {
                ...fallbackTranslations[initialLocale],
                ...sharedTranslations,
            },
        };
    }, [initialLocale, sharedTranslations]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.language, language);
    }, [language]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.theme, theme);

        const root = document.documentElement;
        root.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    const value = useMemo(
        () => ({
            language,
            setLanguage,
            theme,
            setTheme,
            t: (key) =>
                translationMap[language]?.[key] ||
                translationMap.en?.[key] ||
                key,
        }),
        [language, theme, translationMap],
    );

    return (
        <AppSettingsContext.Provider value={value}>
            {children}
        </AppSettingsContext.Provider>
    );
}

export function useAppSettings() {
    const context = useContext(AppSettingsContext);

    if (!context) {
        throw new Error('useAppSettings must be used inside AppSettingsProvider');
    }

    return context;
}
