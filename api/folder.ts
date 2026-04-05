
import { Request, Response } from 'express';
import { supabase } from './supabase';
import { authenticateToken } from './middleware/auth';

export const shareFolder = [authenticateToken, async (req: Request, res: Response) => {
    const { folder_path } = req.body;
    const userId = (req as any).user.id;

    if (!folder_path) {
        return res.status(400).json({ message: 'Folder path is required' });
    }

    try {
        const { data, error } = await supabase
            .from('shared_folders')
            .insert([{ user_id: userId, folder_path }])
            .select();

        if (error) {
            return res.status(400).json({ message: error.message });
        }

        res.status(201).json({ message: 'Folder shared successfully', data });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}];
