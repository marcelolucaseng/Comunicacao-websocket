const express = require('express');
const app = express();
const http = require('http').createServer(app);
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server: http });
const uuid = require('uuid').v4;

const PORT = process.env.PORT || 3000;

app.use(express.static('public', {
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));


// Lista de objetos
let objects = [];

// Adicionar alguns objetos para fins de teste
objects.push({ id: uuid(), status: 'Ativo' });
objects.push({ id: uuid(), status: 'Inativo' });

// Servir arquivos estáticos na rota /public
app.use('/public', express.static('public'));

// Rota inicial que serve o arquivo index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Conexão do WebSocket
wss.on('connection', (ws) => {
    console.log('Cliente conectado');

    // Enviar lista atual de objetos para um novo cliente conectado
    ws.send(JSON.stringify(objects));

    // Receber mensagens do cliente
    ws.on('message', (message) => {
        console.log(`Mensagem recebida: ${message}`);

        // Adicionar um novo objeto
        if (message === 'criar') {
            const newObject = { id: uuid(), status: 'Inativo' };
            objects.push(newObject);

            // Enviar mensagem atualizada para todos os clientes
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(objects));
                }
            });
        }

        // Alterar o status de um objeto
        if (message.startsWith('status:')) {
            const objectId = message.split(':')[1];
            const object = objects.find((o) => o.id === objectId);

            if (object) {
                object.status = object.status === 'Ativo' ? 'Inativo' : 'Ativo';

                // Enviar mensagem atualizada para todos os clientes
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(objects));
                    }
                });
            }
        }

        // Excluir um objeto
        if (message.startsWith('excluir:')) {
            const objectId = message.split(':')[1];
            objects = objects.filter((o) => o.id !== objectId);

            // Enviar mensagem atualizada para todos os clientes
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(objects));
                }
            });
        }
    });
});

http.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
