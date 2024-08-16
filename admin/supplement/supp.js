const firebaseConfig = {
    apiKey: "AIzaSyC9vUqJZrK8yP1fkc9gbVNBJbI_PrqvOd0",
    authDomain: "gym-8d5d1.firebaseapp.com",
    databaseURL: "https://gym-8d5d1-default-rtdb.firebaseio.com",
    projectId: "gym-8d5d1",
    storageBucket: "gym-8d5d1.appspot.com",
    messagingSenderId: "509762920091",
    appId: "1:509762920091:web:76324124895e25cdf9f03e"
};

firebase.initializeApp(firebaseConfig);

const database = firebase.database();

document.getElementById("addSupplementForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const price = parseFloat(document.getElementById('price').value);
    const quantity = parseInt(document.getElementById('quantity').value);
    const gram = parseInt(document.getElementById('gram').value);
    const imageUrl = document.getElementById('imageUrl').value;

    saveSupplement(name, description, price, quantity, gram, imageUrl);

    document.getElementById("addSupplementForm").reset();
});

document.getElementById("updateSupplementForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const id = document.getElementById('updateId').value;
    const name = document.getElementById('updateName').value;
    const description = document.getElementById('updateDescription').value;
    const price = parseFloat(document.getElementById('updatePrice').value);
    const quantity = parseInt(document.getElementById('updateQuantity').value);
    const gram = parseInt(document.getElementById('updateGram').value);
    const imageUrl = document.getElementById('updateImageUrl').value;

    updateSupplement(id, name, description, price, quantity, gram, imageUrl);
});

function saveSupplement(name, description, price, quantity, gram, imageUrl) {
    const newSupplementRef = database.ref('supplements').push();
    newSupplementRef.set({
        name: name,
        description: description,
        price: price,
        quantity: quantity,
        gram: gram,
        imageUrl: imageUrl
    }).then(() => {
        alert('Supplement added successfully!');
        loadSupplements();
    }).catch((error) => {
        console.error('Error adding supplement: ', error);
    });
}

function updateSupplement(id, name, description, price, quantity, gram, imageUrl) {
    const supplementRef = database.ref('supplements/' + id);
    supplementRef.update({
        name: name,
        description: description,
        price: price,
        quantity: quantity,
        gram: gram,
        imageUrl: imageUrl
    }).then(() => {
        alert('Supplement updated successfully!');
        loadSupplements();

        // Reset update input fields and hide the form
        document.getElementById('updateSupplementForm').reset();
        document.getElementById('updateSupplementForm').classList.add('hidden');
    }).catch((error) => {
        console.error('Error updating supplement: ', error);
    });
}

function deleteSupplement(id) {
    const supplementRef = database.ref('supplements/' + id);
    supplementRef.remove()
        .then(() => {
            alert('Supplement deleted successfully!');
            loadSupplements(); // Reload the list of supplements
        })
        .catch((error) => {
            console.error('Error deleting supplement: ', error);
        });
}

function loadSupplements() {
    database.ref('supplements').once('value', (snapshot) => {
        const supplements = snapshot.val();
        const supplementList = document.getElementById('supplementList').getElementsByTagName('tbody')[0];
        supplementList.innerHTML = '';
        for (const id in supplements) {
            const supplement = supplements[id];
            const row = supplementList.insertRow();
            row.insertCell(0).textContent = supplement.name;
            row.insertCell(1).textContent = supplement.description;
            row.insertCell(2).textContent = `${supplement.price.toFixed(2)}`;
            row.insertCell(3).textContent = supplement.quantity;
            row.insertCell(4).textContent = `${supplement.gram}g`;

            const imageCell = row.insertCell(5);
            if (supplement.imageUrl) {
                const img = document.createElement('img');
                img.src = supplement.imageUrl;
                img.alt = supplement.name;
                img.style.width = '100px'; // Set width of image
                img.style.height = 'auto'; // Maintain aspect ratio
                imageCell.appendChild(img);
            } else {
                imageCell.textContent = 'No image';
            }

            const actionsCell = row.insertCell(6);
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.className = 'edit-button';
            editButton.onclick = function() {
                document.getElementById('updateId').value = id;
                document.getElementById('updateName').value = supplement.name;
                document.getElementById('updateDescription').value = supplement.description;
                document.getElementById('updatePrice').value = supplement.price;
                document.getElementById('updateQuantity').value = supplement.quantity;
                document.getElementById('updateGram').value = supplement.gram;
                document.getElementById('updateImageUrl').value = supplement.imageUrl;

                document.getElementById('updateSupplementForm').classList.remove('hidden');
                document.getElementById('updateSupplementForm').scrollIntoView({ behavior: 'smooth' });
            };
            actionsCell.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete-button';
            deleteButton.onclick = function() {
                if (confirm('Are you sure you want to delete this supplement?')) {
                    deleteSupplement(id);
                }
            };
            actionsCell.appendChild(deleteButton);
        }
    });
}

// Initial load of supplements
loadSupplements();
