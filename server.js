const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Rota raiz
// middleware para servir a página index.html
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

// define a rota para o arquivo client.js
app.get('/client.js', function (req, res) {
    res.sendFile(__dirname + '/public/client.js');
});

// define a rota para o arquivo style.css
app.get('/style.css', function (req, res) {
    res.type('text/css');
    res.sendFile(__dirname + '/public/style/style.css');
});

// define a rota para o arquivo favicon.ico
app.get('/favicon.ico', function (req, res) {
    res.sendFile(__dirname + '/public/favicon.ico');
});

// middleware para servir a página index.html
//app.use(express.static('public'));

// Static files
//app.use(express.static('node_modules'));

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
                case 'status-change':
                    const { id: newObjectId, status: newStatus } = data.data;
                    const obj = objects.find(obj => obj.id === newObjectId);
                    if (obj) {
                        obj.status = obj.status === 'Active' ? 'Inactive' : 'Active';
                        broadcastObjects();
                    }
                    break;
            default:
                break;
        }        
    });

    // Tratamento de eventos de desconexão do WebSocket
    socket.on('close', () => {
        console.log('A client has disconnected');
    });
});

// inicialização do servidor na porta definda em PORT
app.listen(3000, () => {
    console.log(`Servidor iniciado na porta 3000`);
});

