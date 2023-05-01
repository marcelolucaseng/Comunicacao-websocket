const socket = new WebSocket('ws://localhost:3000');

// Quando a conexão é estabelecida, enviar uma mensagem vazia para o servidor
socket.addEventListener('open', (event) => {
    console.log('Conexão estabelecida com o servidor');
    socket.send('');
});

// Quando uma mensagem é recebida do servidor, atualizar a lista de objetos na página
socket.addEventListener('message', (event) => {
    const objects = JSON.parse(event.data);
    const objectsDiv = document.getElementById('objects');
    objectsDiv.innerHTML = '';

    objects.forEach((object) => {
        const div = document.createElement('div');
        div.className = 'object';
        div.id = object.id;

        const idSpan = document.createElement('span');
        idSpan.innerText = `ID: ${object.id}`;
        div.appendChild(idSpan);

        const statusSpan = document.createElement('span');
        statusSpan.innerText = `Status: ${object.status}`;
        div.appendChild(statusSpan);

        const toggleButton = document.createElement('button');
        toggleButton.innerText = object.status === 'Ativo' ? 'Desativar' : 'Ativar';
        toggleButton.addEventListener('click', () => {
            const newStatus = object.status === 'Ativo' ? 'Inativo' : 'Ativo';
            socket.send(JSON.stringify({ type: 'update', id: object.id, status: newStatus }));
        });
        div.appendChild(toggleButton);

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Excluir';
        deleteButton.addEventListener('click', () => {
            socket.send(JSON.stringify({ type: 'delete', id: object.id }));
        });
        div.appendChild(deleteButton);

        objectsDiv.appendChild(div);
    });
});

// Quando o formulário de criação de objeto é enviado, enviar uma mensagem ao servidor para criar um novo objeto
const form = document.getElementById('create-object-form');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const nameInput = document.getElementById('object-name-input');
    const name = nameInput.value;
    nameInput.value = '';
    socket.send(JSON.stringify({ type: 'create', name }));
});
