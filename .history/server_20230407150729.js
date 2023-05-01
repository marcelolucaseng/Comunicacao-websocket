const express = require('express');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

// Static files
app.use(express.static('public'));
app.use(express.static('node_modules'));

// WebSocket server
const server = new WebSocket.Server({ port: 8080 });

// Array to store objects
let objects = [];

// Function to broadcast objects to all clients
const broadcastObjects = () => {
    const data = JSON.stringify(objects);
    server.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};

// WebSocket server event listeners
server.on('connection', (socket) => {
    console.log('A client has connected');

    // Send current objects to new client
    socket.send(JSON.stringify(objects));

    // Receive and handle messages from client
    socket.on('message', (message) => {
        const data = JSON.parse(message);

        switch (data.type) {
            case 'create':
                const newObject = {
                    id: uuidv4(),
                    status: 'Inactive'
                };
                objects.push(newObject);
                broadcastObjects();
                break;
            case 'update':
                const { id, status } = data.data;
                const object = objects.find(obj => obj.id === id);
                if (object) {
                    object.status = status;
                    broadcastObjects();
                }
                break;
            case 'delete':
                const objectId = data.data.id;
                objects = objects.filter(obj => obj.id !== objectId);
                broadcastObjects();
                break;
            default:
                break;
        }
    });

    // Handle disconnection
    socket.on('close', () => {
        console.log('A client has disconnected');
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
