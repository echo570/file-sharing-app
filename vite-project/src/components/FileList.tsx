
import React, { useEffect, useState } from 'react';

const FileList: React.FC = () => {
    const [files, setFiles] = useState<string[]>([]);
    const [ws, setWs] = useState<WebSocket | null>(null);

    useEffect(() => {
        const newWs = new WebSocket('ws://localhost:3000');
        setWs(newWs);

        newWs.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('File change event:', data);
            // For simplicity, we just alert the user. In a real app, you would update the file list.
            alert(`File ${data.path} has been ${data.event}`);
        };

        return () => {
            newWs.close();
        };
    }, []);

    const fetchFiles = async () => {
        // In a real app, you would fetch the file list from the server.
        // For now, we'll just simulate it with a dummy list.
        setFiles(['file1.txt', 'file2.txt', 'file3.txt']);
    };

    return (
        <div>
            <h2>File List</h2>
            <button onClick={fetchFiles}>Refresh Files</button>
            <ul>
                {files.map((file, index) => (
                    <li key={index}>{file}</li>
                ))}
            </ul>
        </div>
    );
};

export default FileList;
