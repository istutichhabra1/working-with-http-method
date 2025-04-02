document.getElementById("registration-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const messageDiv = document.getElementById("message");

    messageDiv.classList.add("hidden");

    // Basic validation
    if (!name || !email || !password) {
        showMessage("All fields are required!", "error");
        return;
    }

    const userData = {
        name: name,
        email: email,
        password: password
    };

    try {
        const response = await fetch("https://mockapi.io/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error("Failed to register. Email may already exist.");
        }

        showMessage("Registration successful!", "success");
        document.getElementById("registration-form").reset();

    } catch (error) {
        showMessage(error.message, "error");
    }
});

function showMessage(message, type) {
    const messageDiv = document.getElementById("message");
    messageDiv.textContent = message;
    messageDiv.className = type;
    messageDiv.classList.remove("hidden");
}
