// signup page js

document.addEventListener('DOMContentLoaded', function() {
    // Get the form and attach a submit event listener
    const signupForm = document.querySelector('.signup-form');
    signupForm.addEventListener('submit', function(event){
        event.preventDefault(); // Prevent the default form submission

        // Get values from the form
        const newUsername = document.getElementById('newUsername').value;
        const imgLink = document.getElementById('img-link').value;
        const newUserEmail = document.getElementById('newUseremail').value;
        const newPassword = document.getElementById('newPassword').value;

        // Create a data object to send to the server
        const formData = {
            name: newUsername,
            imgLink: imgLink,
            email: newUserEmail,
            pass: newPassword
        };

        // Use fetch to send the data to the server
        fetch('http://localhost:4000/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(data => {
            // Handle the response from the server (if needed)
            console.log(data);
            alert("User Registered please login:)")
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});

// Login js

document.addEventListener('DOMContentLoaded', function () {
    // Select the form element
    const loginForm = document.querySelector('.login-form');

    // Add a submit event listener to the form
    loginForm.addEventListener('submit', function (event) {
        // Prevent the default form submission
        event.preventDefault();

        // Get the values from the form fields
        const email = document.getElementById('useremail').value;
        const password = document.getElementById('password').value;

        // Perform any client-side validation if needed

        // Create an object with the login data
        const loginData = {
            email: email,
            pass: password
        };

        // Send the login data to the server
        fetch('http://localhost:4000/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        })
        .then(response => response.json())
        .then(data => {
            // Handle the response from the server
            console.log(data);

            // You can redirect the user or perform other actions based on the response
            if (data.mesg === "Login successful") {
                // Redirect to the dashboard or home page
                window.location.href = '../backend/view/index.html';
                localStorage.setItem('userName',data.userName)
                localStorage.setItem('userImg',data.userImg)
            } else {
                // Display an error message to the user
                alert('Login failed. Please check your credentials.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});