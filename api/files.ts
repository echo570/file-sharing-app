
import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticateToken } from './middleware/auth';
import { supabase } from './supabase';

const hasPermission = async (userId: string, folderPath: string, level: 'read' | 'write'): Promise<boolean> => {
    const { data: folder, error: folderError } = await supabase
        .from('shared_folders')
        .select('id, user_id')
        .eq('folder_path', folderPath)
        .single();

    if (folderError || !folder) {
        return false;
    }

    if (folder.user_id === userId) {
        return true; // Owner has all permissions
    }

    const { data: permission, error: permissionError } = await supabase
        .from('folder_permissions')
        .select('level')
        .eq('folder_id', folder.id)
        .eq('user_id', userId)
        .single();

    if (permissionError || !permission) {
        return false;
    }

    if (level === 'read') {
        return permission.level === 'read' || permission.level === 'write';
    } else if (level === 'write') {
        return permission.level === 'write';
    }

    return false;
};

const upload = multer({ dest: 'uploads/' });

export const uploadFile = [authenticateToken, upload.single('file'), async (req: Request, res: Response) => {
    const { folderPath } = req.body;
    const file = req.file;
    const userId = (req as any).user.id;

    if (!file) {
        return res.status(400).send('No file uploaded.');
    }

    const canUpload = await hasPermission(userId, folderPath, 'write');
    if (!canUpload) {
        return res.status(403).send('You do not have permission to upload to this folder.');
    }

    const targetPath = path.join(folderPath, file.originalname);

    fs.rename(file.path, targetPath, (err) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send('File uploaded successfully.');
    });
}];

export const downloadFile = [authenticateToken, async (req: Request, res: Response) => {
    const { filePath } = req.query;
    const userId = (req as any).user.id;

    if (typeof filePath !== 'string') {
        return res.status(400).send('Invalid file path.');
    }

    const folderPath = path.dirname(filePath);
    const canDownload = await hasPermission(userId, folderPath, 'read');
    if (!canDownload) {
        return res.status(403).send('You do not have permission to download from this folder.');
    }

    res.download(filePath, (err) => {
        if (err) {
            res.status(500).send(err);
        }
    });
}];
