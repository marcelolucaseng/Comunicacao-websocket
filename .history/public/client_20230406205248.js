const socket = new WebSocket('ws://localhost:3000');

const objectsDiv = document.getElementById('objects');
const createObjectForm = document.getElementById('create-object-form');

createObjectForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const nameInput = document.getElementById('object-name-input');
    const statusInput = document.getElementById('object-status-input');
    socket.send(JSON.stringify({ action: 'create', name: nameInput.value, status: statusInput.value }));
    nameInput.value = '';
    statusInput.value = '';
});

socket.addEventListener('message', (event) => {
    const objects = JSON.parse(event.data);
    objectsDiv.innerHTML = '';
    objects.forEach((object) => {
        const objectDiv = document.createElement('div');
        objectDiv.classList.add('object');
        objectDiv.innerHTML = `
      <div class="id">${object.id}</div>
      <div class="name">${object.name}</div>
      <div class="status">${object.status}</div>
      <div class="buttons">
        <button class="update-button" data-id="${object.id}">Update</button>
        <button class="delete-button" data-id="${object.id}">Delete</button>
      </div>
    `;
        const updateButton = objectDiv.querySelector('.update-button');
        const deleteButton = objectDiv.querySelector('.delete-button');
        updateButton.addEventListener('click', (event) => {
            const objectId = event.target.dataset.id;
            const status = prompt('Enter new status:');
            if (status !== null && status !== '') {
                socket.send(JSON.stringify({ action: 'update', id: objectId, status }));
            }
        });
        deleteButton.addEventListener('click', (event) => {
            const objectId = event.target.dataset.id;
            const confirmation = confirm('Are you sure you want to delete this object?');
            if (confirmation) {
                socket.send(JSON.stringify({ action: 'delete', id: objectId }));
            }
        });
        objectsDiv.appendChild(objectDiv);
    });
});
