const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener('open', (event) => {
    console.log('WebSocket connection established');
});

socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);

    if (data.type === 'update') {
        const objectsContainer = document.getElementById('objects-container');
        objectsContainer.innerHTML = '';

        for (const object of data.data) {
            const objectDiv = document.createElement('div');
            objectDiv.setAttribute('class', 'object');
            objectDiv.setAttribute('data-id', object.id);

            const objectId = document.createElement('span');
            objectId.setAttribute('class', 'id');
            objectId.innerText = object.id;

            const objectStatus = document.createElement('span');
            objectStatus.setAttribute('class', 'status');
            objectStatus.innerText = object.status;

            const objectButton = document.createElement('button');
            objectButton.setAttribute('class', 'status-change');
            objectButton.innerText = object.status === 'Active' ? 'Deactivate' : 'Activate';

            const deleteButton = document.createElement('button');
            deleteButton.setAttribute('class', 'delete');
            deleteButton.innerText = 'Delete';

            objectDiv.appendChild(objectId);
            objectDiv.appendChild(objectStatus);
            objectDiv.appendChild(objectButton);
            objectDiv.appendChild(deleteButton);
            objectsContainer.appendChild(objectDiv);
        }
    }
});

const button = document.getElementById('create-button');
if (button) {
    button.addEventListener('click', createObject);
}

const createObjectForm = document.getElementById('create-object-form');

createObjectForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const nameInput = createObjectForm.elements.name;
    const status = 'Inactive';
    const id = uuidv4();
    const object = { id, name: nameInput.value, status };
    socket.send(JSON.stringify({ type: 'create', data: object }));
    nameInput.value = '';
});

const objectsContainer = document.getElementById('objects-container');

objectsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('status-change')) {
        const id = event.target.closest('.object').getAttribute('data-id');
        socket.send(JSON.stringify({ type: 'status-change', data: { id } }));
    } else if (event.target.classList.contains('delete')) {
        const id = event.target.closest('.object').getAttribute('data-id');
        socket.send(JSON.stringify({ type: 'delete', data: { id } }));
    }
});