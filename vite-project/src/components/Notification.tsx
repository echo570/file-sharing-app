
import React from 'react';
import './Notification.css';

interface NotificationProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
    return (
        <div className={`notification ${type}`}>
            <span>{message}</span>
            <button onClick={onClose}>&times;</button>
        </div>
    );
};

export default Notification;
