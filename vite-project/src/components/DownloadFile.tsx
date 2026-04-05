
import React, { useState } from 'react';

interface DownloadFileProps {
    showNotification: (message: string, type: 'success' | 'error') => void;
}

const DownloadFile: React.FC<DownloadFileProps> = ({ showNotification }) => {
    const [filePath, setFilePath] = useState('');

    const handleDownload = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            showNotification('You must be logged in to download a file.', 'error');
            return;
        }

        const url = `/api/files/download?filePath=${encodeURIComponent(filePath)}`;
        const a = document.createElement('a');
        a.href = url;
        a.download = filePath.split('/').pop() || 'download';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div>
            <h2>Download a File</h2>
            <input
                type="text"
                placeholder="File Path"
                value={filePath}
                onChange={(e) => setFilePath(e.target.value)}
            />
            <button onClick={handleDownload}>Download File</button>
        </div>
    );
};

export default DownloadFile;
