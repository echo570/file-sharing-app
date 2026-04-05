
import express from 'express';
import { signup, signin } from './auth';
import { shareFolder } from './folder';
import { uploadFile, downloadFile } from './files';
import { grantPermission, revokePermission } from './permissions';
import health from './health';

const app = express();

app.use(express.json());

app.get('/api/health', health);
app.post('/api/auth/signup', signup);
app.post('/api/auth/signin', signin);
app.post('/api/folder/share', shareFolder);
app.post('/api/files/upload', uploadFile);
app.get('/api/files/download', downloadFile);
app.post('/api/permissions/grant', grantPermission);
app.delete('/api/permissions/revoke/:permission_id', revokePermission);

export default app;
