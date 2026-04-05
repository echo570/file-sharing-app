
import React from 'react';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import ShareFolder from './components/ShareFolder';
import FileList from './components/FileList';
import UploadFile from './components/UploadFile';
import DownloadFile from './components/DownloadFile';
import Permissions from './components/Permissions';
import Notification from './components/Notification';
import { useNotification } from './hooks/useNotification';
import './App.css';

const App: React.FC = () => {
    const { notification, showNotification, hideNotification } = useNotification();

    return (
        <div className="App">
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={hideNotification}
                />
            )}
            <header className="App-header">
                <h1>File Sharing App</h1>
            </header>
            <main className="App-main">
                <div className="auth-section">
                    <SignUp showNotification={showNotification} />
                    <SignIn showNotification={showNotification} />
                </div>
                <div className="main-section">
                    <div className="folder-section">
                        <ShareFolder showNotification={showNotification} />
                        <Permissions showNotification={showNotification} />
                    </div>
                    <div className="file-section">
                        <FileList />
                        <UploadFile showNotification={showNotification} />
                        <DownloadFile showNotification={showNotification} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;
