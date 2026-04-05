
import React, { useState } from 'react';

interface PermissionsProps {
    showNotification: (message: string, type: 'success' | 'error') => void;
}

const Permissions: React.FC<PermissionsProps> = ({ showNotification }) => {
    const [folderId, setFolderId] = useState('');
    const [userId, setUserId] = useState('');
    const [level, setLevel] = useState<'read' | 'write'>('read');
    const [permissionId, setPermissionId] = useState('');
    const [grantLoading, setGrantLoading] = useState(false);
    const [revokeLoading, setRevokeLoading] = useState(false);

    const handleGrant = async (e: React.FormEvent) => {
        e.preventDefault();
        setGrantLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                showNotification('You must be logged in to grant permissions.', 'error');
                return;
            }

            const response = await fetch('/api/permissions/grant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ folder_id: folderId, user_id: userId, level }),
            });

            if (response.ok) {
                showNotification('Permission granted successfully!', 'success');
            } else {
                const data = await response.json();
                showNotification(`Failed to grant permission: ${data.message}`, 'error');
            }
        } catch (error) {
            showNotification('An unexpected error occurred.', 'error');
        } finally {
            setGrantLoading(false);
        }
    };

    const handleRevoke = async (e: React.FormEvent) => {
        e.preventDefault();
        setRevokeLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                showNotification('You must be logged in to revoke permissions.', 'error');
                return;
            }

            const response = await fetch(`/api/permissions/revoke/${permissionId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                showNotification('Permission revoked successfully!', 'success');
            } else {
                const data = await response.json();
                showNotification(`Failed to revoke permission: ${data.message}`, 'error');
            }
        } catch (error) {
            showNotification('An unexpected error occurred.', 'error');
        } finally {
            setRevokeLoading(false);
        }
    };

    return (
        <div>
            <h2>Grant Permission</h2>
            <form onSubmit={handleGrant}>
                <input
                    type="text"
                    placeholder="Folder ID"
                    value={folderId}
                    onChange={(e) => setFolderId(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
                <select value={level} onChange={(e) => setLevel(e.target.value as 'read' | 'write')}>
                    <option value="read">Read</option>
                    <option value="write">Write</option>
                </select>
                <button type="submit" disabled={grantLoading}>
                    {grantLoading ? 'Granting...' : 'Grant Permission'}
                </button>
            </form>

            <h2>Revoke Permission</h2>
            <form onSubmit={handleRevoke}>
                <input
                    type="text"
                    placeholder="Permission ID"
                    value={permissionId}
                    onChange={(e) => setPermissionId(e.target.value)}
                />
                <button type="submit" disabled={revokeLoading}>
                    {revokeLoading ? 'Revoking...' : 'Revoke Permission'}
                </button>
            </form>
        </div>
    );
};

export default Permissions;
