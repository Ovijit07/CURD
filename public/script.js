// Function to create update fields
function createUpdateFields(item) {
    const updateForm = document.createElement('form');
    updateForm.style.display = 'none'; // Initially hide the form
    updateForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(updateForm);
        const requestData = Object.fromEntries(formData.entries());
        try {
            const response = await fetch(`/api/items/${item._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });
            console.log(await response.json());
            showSuccessMessage('Item updated successfully!');
            fetchItems(); // Refresh the list
        } catch (error) {
            console.error('Error updating item:', error);
            showErrorMessage('Failed to update item!');
        }
    });

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.name = 'name';
    nameInput.value = item.name;
    updateForm.appendChild(nameInput);

    const ageInput = document.createElement('input');
    ageInput.type = 'number';
    ageInput.name = 'age';
    ageInput.value = item.age;
    updateForm.appendChild(ageInput);

    const hobbiesInput = document.createElement('input');
    hobbiesInput.type = 'text';
    hobbiesInput.name = 'hobbies';
    hobbiesInput.value = item.hobbies;
    updateForm.appendChild(hobbiesInput);

    const updateButton = document.createElement('button');
    updateButton.type = 'submit';
    updateButton.textContent = 'Update';
    updateForm.appendChild(updateButton);

    return updateForm;
}

// Function to display success message
function showSuccessMessage(message) {
    const successMessage = document.getElementById('successMessage');
    successMessage.textContent = message;
    successMessage.style.color = 'green';
}

// Function to display error message
function showErrorMessage(message) {
    const successMessage = document.getElementById('successMessage');
    successMessage.textContent = message;
    successMessage.style.color = 'red';
}

// Function to fetch existing items and render them in the list
async function fetchItems() {
    try {
        const response = await fetch('/api/items');
        const items = await response.json();
        const itemList = document.getElementById('itemList');
        itemList.innerHTML = '';
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name} - Age: ${item.age}, Hobbies: ${item.hobbies}`;

            // Add update button
            const updateButton = document.createElement('button');
            updateButton.textContent = 'Update';
            updateButton.addEventListener('click', () => {
                updateForm.style.display = 'block'; // Show the update form
            });
            li.appendChild(updateButton);

            // Add delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', async () => {
                const confirmation = confirm('Are you sure you want to delete this item?');
                if (confirmation) {
                    try {
                        const response = await fetch(`/api/items/${item._id}`, {
                            method: 'DELETE'
                        });
                        console.log(await response.json());
                        showSuccessMessage('Item deleted successfully!');
                        fetchItems(); // Refresh the list
                    } catch (error) {
                        console.error('Error deleting item:', error);
                        showErrorMessage('Failed to delete item!');
                    }
                }
            });
            li.appendChild(deleteButton);

            // Create update fields and append to list item
            const updateForm = createUpdateFields(item);
            li.appendChild(updateForm);

            itemList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}

// Fetch items when the page loads
window.onload = fetchItems;

// Event listener for creating a new item
document.getElementById('createForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(document.getElementById('createForm'));
    const requestData = Object.fromEntries(formData.entries());
    try {
        const response = await fetch('/api/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });
        console.log(await response.json());
        showSuccessMessage('Item created successfully!');
        fetchItems(); // Refresh the list
    } catch (error) {
        console.error('Error creating item:', error);
        showErrorMessage('Failed to create item!');
    }
});