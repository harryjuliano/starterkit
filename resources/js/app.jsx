import '../css/app.css';
import './bootstrap';

import { AppSettingsProvider } from '@/Contexts/AppSettingsContext';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        const initialProps = props.initialPage.props;

        root.render(
            <AppSettingsProvider
                initialLocale={initialProps.app?.locale}
                sharedTranslations={initialProps.translations}
            >
                <App {...props} />
            </AppSettingsProvider>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});
