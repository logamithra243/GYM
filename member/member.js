
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



const contactFormDB = firebase.database().ref("2registerForm");


document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("2registerForm");
  const loginForm = document.getElementById("loginForm");

  if (registerForm) {
      registerForm.addEventListener("submit", Registerform);
  }

  if (loginForm) {
      loginForm.addEventListener("submit", loginFormHandler);
  }
});

function Registerform(e) {
  e.preventDefault();

  const email = getElementVal("email");
  const password = getElementVal("password");

  saveMessages(email, password);
  displayAlert("Registration successful!");


  document.getElementById("2registerForm").reset();
}

const saveMessages = (email, password) => {
  const newContactForm = contactFormDB.push();
  newContactForm.set({
      email: email,
      password: password,
  });
};


function loginFormHandler(e) {
  e.preventDefault();

  const email = getElementVal("loginEmail");
  const password = getElementVal("loginPassword");
  localStorage.setItem('email',email);

  checkCredentials(email, password);
}

const checkCredentials = (email, password) => {
  contactFormDB.orderByChild("email").equalTo(email).once("value")
      .then(snapshot => {
          if (snapshot.exists()) {
              snapshot.forEach(userSnapshot => {
                  const userData = userSnapshot.val();
                  if (userData.password === password) {
                      displayAlert("Login successful!", "dashboard.html");
                  } else {
                      displayAlert("Incorrect password!");
                  }
              });
          } else {
              displayAlert("Email not found!");
          }
      })
      .catch(error => {
          displayAlert("Error: " + error.message);
      });
};

const getElementVal = (id) => {
  return document.getElementById(id).value;
};

const displayAlert = (message, redirectUrl) => {
  const alertElement = document.querySelector(".alert");
  alertElement.style.display = "block";
  alertElement.innerText = message;

  if (redirectUrl) {
      setTimeout(() => {
          alertElement.style.display = "none";
          window.location.href = 'member-home.html'; // Redirect to another page
      }, 3000);
  } else {
      setTimeout(() => {
          alertElement.style.display = "none";
      }, 3000);
  }
};
