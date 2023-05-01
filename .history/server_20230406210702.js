const WebSocket = require('websocket').server;

const wss = new WebSocket.Server({ port: 3000 });

let objects = [];

function createObject() {
    const id = objects.length + 1;
    const status = 'inactive';
    objects.push({ id, status });
    return { id, status };
}

function activateObject(id) {
    const object = objects.find((o) => o.id === id);
    if (object) {
        object.status = 'active';
        return object;
    } else {
        return null;
    }
}

function deactivateObject(id) {
    const object = objects.find((o) => o.id === id);
    if (object) {
        object.status = 'inactive';
        return object;
    } else {
        return null;
    }
}

wss.on('connection', (ws) => {
    console.log('Client connected');

    // Send initial list of objects to the client
    ws.send(JSON.stringify(objects));

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        switch (data.action) {
            case 'create':
                const newObject = createObject();
                ws.send(JSON.stringify([newObject]));
                break;
            case 'activate':
                const activatedObject = activateObject(data.id);
                if (activatedObject) {
                    wss.clients.forEach((client) => {
                        client.send(JSON.stringify([activatedObject]));
                    });
                }
                break;
            case 'deactivate':
                const deactivatedObject = deactivateObject(data.id);
                if (deactivatedObject) {
                    wss.clients.forEach((client) => {
                        client.send(JSON.stringify([deactivatedObject]));
                    });
                }
                break;
            default:
                console.log(`Unknown action: ${data.action}`);
                break;
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
