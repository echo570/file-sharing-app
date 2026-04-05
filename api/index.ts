
import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import app from './app';
import { createWebSocketServer } from './websocket';

const port = process.env.PORT || 3000;

const server = http.createServer(app);
const wss = createWebSocketServer(server);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
