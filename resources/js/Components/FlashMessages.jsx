import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const FLASH_TYPES = [
    ['success', 'bg-emerald-500'],
    ['error', 'bg-red-500'],
    ['warning', 'bg-amber-500'],
    ['info', 'bg-blue-500'],
];

export default function FlashMessages() {
    const { flash } = usePage().props;
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (!flash) {
            return;
        }

        const nextMessages = FLASH_TYPES.filter(([type]) => flash[type]).map(
            ([type, color]) => ({
                id: `${type}-${Date.now()}`,
                type,
                text: flash[type],
                color,
            }),
        );

        if (!nextMessages.length) {
            return;
        }

        setMessages(nextMessages);

        const timeout = setTimeout(() => setMessages([]), 3500);

        return () => clearTimeout(timeout);
    }, [flash]);

    if (!messages.length) {
        return null;
    }

    return (
        <div className="fixed right-4 top-4 z-50 space-y-2">
            {messages.map((message) => (
                <div
                    key={message.id}
                    className={`${message.color} rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg`}
                >
                    {message.text}
                </div>
            ))}
        </div>
    );
}
