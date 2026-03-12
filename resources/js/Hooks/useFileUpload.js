import { useState } from 'react';

export default function useFileUpload() {
    const [progress, setProgress] = useState(0);

    const buildFormData = (payload = {}) => {
        const form = new FormData();

        Object.entries(payload).forEach(([key, value]) => {
            if (value === null || value === undefined) {
                return;
            }

            form.append(key, value);
        });

        return form;
    };

    return {
        progress,
        setProgress,
        buildFormData,
    };
}
