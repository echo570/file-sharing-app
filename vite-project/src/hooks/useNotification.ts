
import { useState } from 'react';

interface NotificationState {
    message: string;
    type: 'success' | 'error';
}

export const useNotification = () => {
    const [notification, setNotification] = useState<NotificationState | null>(null);

    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({ message, type });
    };

    const hideNotification = () => {
        setNotification(null);
    };

    return { notification, showNotification, hideNotification };
};
