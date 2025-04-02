const API_URL = "https://mockapi.io/tasks";
let editingTaskId = null;

// Fetch and display tasks on page load
document.addEventListener("DOMContentLoaded", fetchTasks);

async function fetchTasks() {
    const taskList = document.getElementById("task-list");
    const loadingDiv = document.getElementById("loading");

    taskList.innerHTML = "";
    loadingDiv.classList.remove("hidden");

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("Failed to fetch tasks.");
        }

        const tasks = await response.json();
        loadingDiv.classList.add("hidden");

        if (tasks.length === 0) {
            taskList.innerHTML = "<p>No tasks available.</p>";
        } else {
            tasks.forEach(addTaskToList);
        }
    } catch (error) {
        taskList.innerHTML = "<p>Error loading tasks.</p>";
    }
}

// Add task to the UI dynamically
function addTaskToList(task) {
    const taskList = document.getElementById("task-list");
    const listItem = document.createElement("li");
    listItem.dataset.id = task.id;
    listItem.innerHTML = `
        <span>${task.title} - <strong>${task.status}</strong></span>
        <div>
            <button class="edit" onclick="openEditModal('${task.id}', '${task.title}', '${task.status}')">Edit</button>
            <button class="delete" onclick="deleteTask('${task.id}')">Delete</button>
        </div>
    `;
    taskList.appendChild(listItem);
}

// Open Edit Modal
function openEditModal(id, title, status) {
    editingTaskId = id;
    document.getElementById("edit-title").value = title;
    document.getElementById("edit-status").value = status;
    document.getElementById("edit-modal").classList.remove("hidden");
}

// Close Edit Modal
document.getElementById("cancel-edit").addEventListener("click", function() {
    document.getElementById("edit-modal").classList.add("hidden");
});

// Save Edited Task
document.getElementById("save-edit").addEventListener("click", async function() {
    const newTitle = document.getElementById("edit-title").value.trim();
    const newStatus = document.getElementById("edit-status").value;

    if (!newTitle) {
        alert("Task title cannot be empty.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${editingTaskId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title: newTitle, status: newStatus })
        });

        if (!response.ok) {
            throw new Error("Failed to update task.");
        }

        document.getElementById("edit-modal").classList.add("hidden");
        refreshTaskList();
    } catch (error) {
        alert(error.message);
    }
});

// Delete Task
async function deleteTask(id) {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Failed to delete task.");
        }

        refreshTaskList();
    } catch (error) {
        alert(error.message);
    }
}

// Refresh task list dynamically
function refreshTaskList() {
    document.getElementById("task-list").innerHTML = "";
    fetchTasks();
}
