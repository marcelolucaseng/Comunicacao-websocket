const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();
const server = http.createServer(app);
const { v4: uuidv4 } = require('uuid');
const PORT = 3000;

// Static files
app.use(express.static('public'));
app.use(express.static('node_modules'));

app.get('/style.css', function (req, res) {
    res.type('text/css');
    res.sendFile(__dirname + './public/style/style.css');
});

// WebSocket server
const wss = new WebSocket.Server({ server });

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

// inicialização do servidor na porta definda em PORT
app.listen(PORT, () => {
    console.log(`Servidor iniciado na porta ${PORT}`);
});

try {
    console.log(`Sem erro\n`)

} catch (erro) {
    console.log(`O nome do erro é: ${erro.name}\n`)
    console.log(`A mensagem de erro é: ${erro.message}\n`)
    console.log(`A stack do erro é: ${erro.stack}\n`)
}
 // usamos o \n acima para pular uma linha extra e visualizarmos melhor