import ApplicationLogo from '@/Components/ApplicationLogo';
import FlashMessages from '@/Components/FlashMessages';
import { useAppSettings } from '@/Contexts/AppSettingsContext';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    const { language, setLanguage, theme, setTheme, t } = useAppSettings();

    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 dark:bg-gray-900 sm:justify-center sm:pt-0">
            <FlashMessages />
            <div className="mb-4 flex items-center gap-2">
                <select
                    className="rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    aria-label={t('language')}
                >
                    <option value="en">EN</option>
                    <option value="id">ID</option>
                </select>
                <button
                    type="button"
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                    {theme === 'dark' ? t('light') : t('dark')}
                </button>
            </div>

            <div>
                <Link href="/">
                    <ApplicationLogo className="h-20 w-20 fill-current text-gray-500 dark:text-gray-300" />
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md dark:bg-gray-800 sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
