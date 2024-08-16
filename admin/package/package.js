// Firebase configuration
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

// Event listener for adding a package
document.getElementById("addpackage").addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById('name')?.value;
    const price = parseFloat(document.getElementById('price')?.value);
    const duration = parseInt(document.getElementById('duration')?.value);
    const benefits = document.getElementById('benefits')?.value;

    if (name && !isNaN(price) && !isNaN(duration) && benefits) {
        savePackage(name, price, duration, benefits);
        document.getElementById("addpackage").reset();
    } else {
        console.error('Form fields are missing or invalid.');
    }
});

// Event listener for updating a package
document.getElementById("updatepackage").addEventListener("submit", function(e) {
    e.preventDefault();

    const id = document.getElementById('updateId')?.value;
    const name = document.getElementById('updateName')?.value;
    const price = parseFloat(document.getElementById('updatePrice')?.value);
    const duration = parseInt(document.getElementById('updateDuration')?.value);
    const benefits = document.getElementById('updateBenefits')?.value;

    if (id && name && !isNaN(price) && !isNaN(duration) && benefits) {
        updatePackage(id, name, price, duration, benefits);
    } else {
        console.error('Update ID or form fields are missing or invalid.');
    }
});

// Save a new package to Firebase
function savePackage(name, price, duration, benefits) {
    const newPackageRef = database.ref('packages').push();
    newPackageRef.set({
        name: name,
        price: price,
        duration: duration,
        benefits: benefits
    }).then(() => {
        alert('Package added successfully!');
        loadPackages();
    }).catch((error) => {
        console.error('Error adding package: ', error);
    });
}

// Update an existing package in Firebase
function updatePackage(id, name, price, duration, benefits) {
    const packageRef = database.ref('packages/' + id);
    packageRef.update({
        name: name,
        price: price,
        duration: duration,
        benefits: benefits
    }).then(() => {
        alert('Package updated successfully!');
        loadPackages();

        // Reset update input fields and hide the form
        document.getElementById('updateId').value = '';
        document.getElementById('updateName').value = '';
        document.getElementById('updatePrice').value = '';
        document.getElementById('updateDuration').value = '';
        document.getElementById('updateBenefits').value = '';

        document.getElementById('update-package').classList.add('hidden');
    }).catch((error) => {
        console.error('Error updating package: ', error);
    });
}

// Delete a package from Firebase
function deletePackage(id) {
    const packageRef = database.ref('packages/' + id);
    packageRef.remove()
        .then(() => {
            alert('Package deleted successfully!');
            loadPackages(); // Reload the list of packages
        })
        .catch((error) => {
            console.error('Error deleting package: ', error);
        });
}

// Load packages from Firebase and display them
function loadPackages() {
    database.ref('packages').once('value', (snapshot) => {
        const packages = snapshot.val();
        const packageList = document.getElementById('packageList').getElementsByTagName('tbody')[0];
        packageList.innerHTML = '';
        for (const id in packages) {
            const pkg = packages[id];
            const row = packageList.insertRow();
            row.insertCell(0).textContent = pkg.name;
            row.insertCell(1).textContent = `${pkg.price.toFixed(2)}`;
            row.insertCell(2).textContent = pkg.duration;
            row.insertCell(3).textContent = pkg.benefits;

            const actionsCell = row.insertCell(4);
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.className = 'edit-button';
            editButton.onclick = function() {
                // Populate the update form with the selected package's data
                document.getElementById('updateId').value = id;
                document.getElementById('updateName').value = pkg.name;
                document.getElementById('updatePrice').value = pkg.price;
                document.getElementById('updateDuration').value = pkg.duration;
                document.getElementById('updateBenefits').value = pkg.benefits;

                document.getElementById('update-package').classList.remove('hidden');
            };

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete-button';
            deleteButton.onclick = function() {
                if (confirm('Are you sure you want to delete this package?')) {
                    deletePackage(id);
                }
            };

            actionsCell.appendChild(editButton);
            actionsCell.appendChild(deleteButton);
        }
    });
}

// Load packages on page load
loadPackages();
