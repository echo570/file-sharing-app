
import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import chokidar from 'chokidar';
import { supabase } from './supabase';

export const createWebSocketServer = (server: http.Server) => {
    const wss = new WebSocketServer({ server });

    const watchFolders = async () => {
        const { data: folders, error } = await supabase.from('shared_folders').select('folder_path');
        if (error) {
            console.error('Error fetching shared folders:', error);
            return;
        }

        folders.forEach(folder => {
            const watcher = chokidar.watch(folder.folder_path, { persistent: true });

            watcher.on('all', (event, path) => {
                console.log(`File ${path} has been ${event}`);
                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ event, path }));
                    }
                });
            });
        });
    };

    watchFolders();

    wss.on('connection', (ws: WebSocket) => {
        console.log('Client connected');

        ws.on('message', (message: string) => {
            console.log(`Received message: ${message}`);
            // Broadcast the message to all clients
            wss.clients.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
        });

        ws.on('close', () => {
            console.log('Client disconnected');
        });
    });

    return wss;
};
