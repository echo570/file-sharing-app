
import React, { useState } from 'react';

interface UploadFileProps {
    showNotification: (message: string, type: 'success' | 'error') => void;
}

const UploadFile: React.FC<UploadFileProps> = ({ showNotification }) => {
    const [file, setFile] = useState<File | null>(null);
    const [folderPath, setFolderPath] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!file || !folderPath) {
                showNotification('File and folder path are required', 'error');
                return;
            }

            const formData = new FormData();
            formData.append('file', file);
            formData.append('folderPath', folderPath);

            const token = localStorage.getItem('token');
            if (!token) {
                showNotification('You must be logged in to upload a file.', 'error');
                return;
            }

            const response = await fetch('/api/files/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                showNotification('File uploaded successfully!', 'success');
            } else {
                const text = await response.text();
                showNotification(`Failed to upload file: ${text}`, 'error');
            }
        } catch (error) {
            showNotification('An unexpected error occurred.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Upload a File</h2>
            <input
                type="text"
                placeholder="Folder Path"
                value={folderPath}
                onChange={(e) => setFolderPath(e.target.value)}
            />
            <input type="file" onChange={handleFileChange} />
            <button type="submit" disabled={loading}>
                {loading ? 'Uploading...' : 'Upload File'}
            </button>
        </form>
    );
};

export default UploadFile;
