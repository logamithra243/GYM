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

document.getElementById("addDietPlanForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const dietPlanName = document.getElementById('dietPlanName').value;
    const days = getDaysFromForm();

    saveDietPlan(dietPlanName, days);
});

document.getElementById("updateDietPlanForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const id = document.getElementById('updateDietPlanId').value;
    const dietPlanName = document.getElementById('updateDietPlanName').value;
    const days = getDaysFromUpdateForm();

    updateDietPlan(id, dietPlanName, days);
});

function saveDietPlan(dietPlanName, days) {
    const newDietPlanRef = database.ref('dietPlans').push();
    newDietPlanRef.set({
        name: dietPlanName,
        days: days
    }).then(() => {
        alert('Diet plan added successfully!');
        document.getElementById("addDietPlanForm").reset();
        document.getElementById('days-container').innerHTML = `
            <div class="day-form">
                <input type="text" class="day-name" placeholder="Day Name (e.g., Day 1)" required>
                <input type="text" class="breakfast" placeholder="Breakfast" required>
                <input type="text" class="lunch" placeholder="Lunch" required>
                <input type="text" class="dinner" placeholder="Dinner" required>
            </div>
        `;
        loadDietPlans();
    }).catch((error) => {
        console.error('Error saving diet plan: ', error);
    });
}

function updateDietPlan(id, dietPlanName, days) {
    const dietPlanRef = database.ref('dietPlans/' + id);
    dietPlanRef.update({
        name: dietPlanName,
        days: days
    }).then(() => {
        alert('Diet plan updated successfully!');
        document.getElementById("updateDietPlanForm").reset();
        document.getElementById('update-days-container').innerHTML = '';
        document.getElementById('update-diet-plan').classList.add('hidden');
        loadDietPlans();
    }).catch((error) => {
        console.error('Error updating diet plan: ', error);
    });
}

function deleteDietPlan(id) {
    if (confirm('Are you sure you want to delete this diet plan?')) {
        const dietPlanRef = database.ref('dietPlans/' + id);
        dietPlanRef.remove().then(() => {
            alert('Diet plan deleted successfully!');
            loadDietPlans();
        }).catch((error) => {
            console.error('Error deleting diet plan: ', error);
        });
    }
}

function deleteDay(dietPlanId, dayIndex) {
    const dietPlanRef = database.ref('dietPlans/' + dietPlanId + '/days/' + dayIndex);
    dietPlanRef.remove().then(() => {
        alert('Day removed successfully!');
        loadDietPlans();
    }).catch((error) => {
        console.error('Error removing day: ', error);
    });
}

function addDayForm() {
    const daysContainer = document.getElementById('days-container');
    const dayForm = document.createElement('div');
    dayForm.className = 'day-form';
    dayForm.innerHTML = `
        <input type="text" class="day-name" placeholder="Day Name (e.g., Day 2)" required>
        <input type="text" class="breakfast" placeholder="Breakfast" required>
        <input type="text" class="lunch" placeholder="Lunch" required>
        <input type="text" class="dinner" placeholder="Dinner" required>
    `;
    daysContainer.appendChild(dayForm);
}

function addUpdateDayForm() {
    const updateDaysContainer = document.getElementById('update-days-container');
    const dayForm = document.createElement('div');
    dayForm.className = 'day-form';
    dayForm.innerHTML = `
        <input type="text" class="update-day-name" placeholder="Day Name (e.g., Day 2)" required>
        <input type="text" class="update-breakfast" placeholder="Breakfast" required>
        <input type="text" class="update-lunch" placeholder="Lunch" required>
        <input type="text" class="update-dinner" placeholder="Dinner" required>
        <button type="button" onclick="deleteUpdateDay(this)">Delete Day</button>
    `;
    updateDaysContainer.appendChild(dayForm);
}

function deleteUpdateDay(button) {
    const dayForm = button.parentElement;
    dayForm.remove();
}

function getDaysFromForm() {
    const days = [];
    document.querySelectorAll('#days-container .day-form').forEach((form, index) => {
        const dayName = form.querySelector('.day-name').value;
        const breakfast = form.querySelector('.breakfast').value;
        const lunch = form.querySelector('.lunch').value;
        const dinner = form.querySelector('.dinner').value;

        days.push({
            dayName: dayName,
            breakfast: breakfast,
            lunch: lunch,
            dinner: dinner
        });
    });
    return days;
}

function getDaysFromUpdateForm() {
    const days = [];
    document.querySelectorAll('#update-days-container .day-form').forEach((form, index) => {
        const dayName = form.querySelector('.update-day-name').value;
        const breakfast = form.querySelector('.update-breakfast').value;
        const lunch = form.querySelector('.update-lunch').value;
        const dinner = form.querySelector('.update-dinner').value;

        days.push({
            dayName: dayName,
            breakfast: breakfast,
            lunch: lunch,
            dinner: dinner
        });
    });
    return days;
}

function loadDietPlans() {
    const dietPlanList = document.getElementById('dietPlanList').getElementsByTagName('tbody')[0];
    dietPlanList.innerHTML = '';

    database.ref('dietPlans').once('value', (snapshot) => {
        snapshot.forEach((dietPlanSnapshot) => {
            const dietPlan = dietPlanSnapshot.val();
            const dietPlanId = dietPlanSnapshot.key;

            const row = dietPlanList.insertRow();
            row.insertCell(0).textContent = dietPlan.name;
            const daysCell = row.insertCell(1);
            dietPlan.days.forEach(day => {
                const dayElement = document.createElement('div');
                dayElement.innerHTML = `
                    <strong>${day.dayName}</strong><br>
                    Breakfast: ${day.breakfast}<br>
                    Lunch: ${day.lunch}<br>
                    Dinner: ${day.dinner}
                `;
                daysCell.appendChild(dayElement);
            });
            const actionsCell = row.insertCell(2);
            actionsCell.innerHTML = `
                <button class="edit-button" onclick="editDietPlan('${dietPlanId}')">Edit</button>
                <button class="delete-button" onclick="deleteDietPlan('${dietPlanId}')">Delete</button>
            `;
        });
    });
}

function editDietPlan(dietPlanId) {
    const dietPlanRef = database.ref('dietPlans/' + dietPlanId);
    dietPlanRef.once('value').then((snapshot) => {
        const dietPlan = snapshot.val();

        document.getElementById('updateDietPlanId').value = dietPlanId;
        document.getElementById('updateDietPlanName').value = dietPlan.name;

        const updateDaysContainer = document.getElementById('update-days-container');
        updateDaysContainer.innerHTML = '';

        dietPlan.days.forEach(day => {
            const dayForm = document.createElement('div');
            dayForm.className = 'day-form';
            dayForm.innerHTML = `
                <input type="text" class="update-day-name" value="${day.dayName}" required>
                <input type="text" class="update-breakfast" value="${day.breakfast}" required>
                <input type="text" class="update-lunch" value="${day.lunch}" required>
                <input type="text" class="update-dinner" value="${day.dinner}" required>
                <button type="button" onclick="deleteUpdateDay(this)">Delete Day</button>
            `;
            updateDaysContainer.appendChild(dayForm);
        });

        // Show the update form and scroll to it
        document.getElementById('update-diet-plan').classList.remove('hidden');
        document.getElementById('update-diet-plan').scrollIntoView({ behavior: 'smooth' });
    });
}

// Initial Load
loadDietPlans();