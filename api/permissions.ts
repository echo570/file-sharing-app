
import { Request, Response } from 'express';
import { supabase } from './supabase';
import { authenticateToken } from './middleware/auth';

export const grantPermission = [authenticateToken, async (req: Request, res: Response) => {
    const { folder_id, user_id, level } = req.body;
    const ownerId = (req as any).user.id;

    try {
        // Verify that the user granting permission is the owner of the folder
        const { data: folder, error: folderError } = await supabase
            .from('shared_folders')
            .select('user_id')
            .eq('id', folder_id)
            .single();

        if (folderError || !folder || folder.user_id !== ownerId) {
            return res.status(403).json({ message: 'You do not have permission to grant access to this folder' });
        }

        const { data, error } = await supabase
            .from('folder_permissions')
            .insert([{ folder_id, user_id, level }])
            .select();

        if (error) {
            return res.status(400).json({ message: error.message });
        }

        res.status(201).json({ message: 'Permission granted successfully', data });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}];

export const revokePermission = [authenticateToken, async (req: Request, res: Response) => {
    const { permission_id } = req.params;
    const ownerId = (req as any).user.id;

    try {
        // Verify that the user revoking permission is the owner of the folder
        const { data: permission, error: permissionError } = await supabase
            .from('folder_permissions')
            .select('*, shared_folders(user_id)')
            .eq('id', permission_id)
            .single();

        if (permissionError || !permission || (permission.shared_folders as any).user_id !== ownerId) {
            return res.status(403).json({ message: 'You do not have permission to revoke access to this folder' });
        }

        const { error } = await supabase
            .from('folder_permissions')
            .delete()
            .eq('id', permission_id);

        if (error) {
            return res.status(400).json({ message: error.message });
        }

        res.status(200).json({ message: 'Permission revoked successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}];
