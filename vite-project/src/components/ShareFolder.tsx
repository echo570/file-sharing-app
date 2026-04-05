
import React, { useState } from 'react';

interface ShareFolderProps {
    showNotification: (message: string, type: 'success' | 'error') => void;
}

const ShareFolder: React.FC<ShareFolderProps> = ({ showNotification }) => {
    const [folderPath, setFolderPath] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                showNotification('You must be logged in to share a folder.', 'error');
                return;
            }

            const response = await fetch('/api/folder/share', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ folder_path: folderPath }),
            });

            if (response.ok) {
                showNotification('Folder shared successfully!', 'success');
            } else {
                const data = await response.json();
                showNotification(`Failed to share folder: ${data.message}`, 'error');
            }
        } catch (error) {
            showNotification('An unexpected error occurred.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Share a Folder</h2>
            <input
                type="text"
                placeholder="Folder Path"
                value={folderPath}
                onChange={(e) => setFolderPath(e.target.value)}
            />
            <button type="submit" disabled={loading}>
                {loading ? 'Sharing...' : 'Share Folder'}
            </button>
        </form>
    );
};

export default ShareFolder;
