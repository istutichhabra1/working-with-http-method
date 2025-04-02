const API_URL = "https://mockapi.io/users";

// Fetch and display users on page load
document.addEventListener("DOMContentLoaded", fetchUsers);

document.getElementById("user-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const messageDiv = document.getElementById("message");

    messageDiv.classList.add("hidden");

    if (!name || !email) {
        showMessage("All fields are required!", "error");
        return;
    }

    try {
        // Check if the email already exists
        const users = await getUsers();
        if (users.some(user => user.email === email)) {
            throw new Error("Email already exists!");
        }

        // Add new user
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email })
        });

        if (!response.ok) {
            throw new Error("Failed to add user.");
        }

        const newUser = await response.json();
        showMessage("User added successfully!", "success");
        addUserToList(newUser);
        document.getElementById("user-form").reset();
    } catch (error) {
        showMessage(error.message, "error");
    }
});

// Fetch users from API
async function fetchUsers() {
    const userList = document.getElementById("user-list");
    const loadingDiv = document.getElementById("loading");

    userList.innerHTML = "";
    loadingDiv.classList.remove("hidden");

    try {
        const users = await getUsers();
        loadingDiv.classList.add("hidden");

        if (users.length === 0) {
            userList.innerHTML = "<p>No users found.</p>";
        } else {
            users.forEach(addUserToList);
        }
    } catch (error) {
        userList.innerHTML = "<p>Error fetching users.</p>";
    }
}

// Helper function to fetch users
async function getUsers() {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error("Failed to fetch users.");
    }
    return await response.json();
}

// Add user to the list dynamically
function addUserToList(user) {
    const userList = document.getElementById("user-list");
    const listItem = document.createElement("li");
    listItem.textContent = `${user.name} - ${user.email}`;
    userList.appendChild(listItem);
}

// Display success or error messages
function showMessage(message, type) {
    const messageDiv = document.getElementById("message");
    messageDiv.textContent = message;
    messageDiv.className = type;
    messageDiv.classList.remove("hidden");
}
