document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput");
    const addTaskButton = document.getElementById("addTaskButton");
    const taskList = document.getElementById("taskList");
    const filterAll = document.getElementById("filterAll");
    const filterActive = document.getElementById("filterActive");
    const filterCompleted = document.getElementById("filterCompleted");

    loadTasks();

    addTaskButton.addEventListener("click", addTask);

    taskInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            addTask();
        }
    });

    filterAll.addEventListener("click", () => filterTasks("all"));
    filterActive.addEventListener("click", () => filterTasks("active"));
    filterCompleted.addEventListener("click", () => filterTasks("completed"));

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== "") {
            const li = createTaskElement(taskText, false);
            taskList.appendChild(li);
            saveTasks();
            taskInput.value = "";
        }
    }

    function createTaskElement(taskText, completed) {
        const li = document.createElement("li");
        if (completed) li.classList.add("completed");

        const span = document.createElement("span");
        span.textContent = taskText;

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("edit-button");
        editButton.addEventListener("click", () => editTask(li, span));

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delet";
        deleteButton.classList.add("delete-button");
        deleteButton.addEventListener("click", () => {
            li.remove();
            saveTasks();
        });

        li.appendChild(span);
        li.appendChild(editButton);
        li.appendChild(deleteButton);

        li.addEventListener("click", (e) => {
            if (e.target.tagName !== "BUTTON") {
                li.classList.toggle("completed");
                saveTasks();
            }
        });

        return li;
    }

    function editTask(li, span) {
        const input = document.createElement("input");
        input.type = "text";
        input.value = span.textContent;
        li.classList.add("editing");
        li.insertBefore(input, span);
        span.style.display = "none";

        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                span.textContent = input.value;
                span.style.display = "";
                li.classList.remove("editing");
                input.remove();
                saveTasks();
            }
        });

        input.addEventListener("blur", () => {
            span.style.display = "";
            li.classList.remove("editing");
            input.remove();
        });

        input.focus();
    }

    function filterTasks(filter) {
        const tasks = taskList.querySelectorAll("li");
        tasks.forEach(task => {
            switch (filter) {
                case "all":
                    task.style.display = "flex";
                    break;
                case "active":
                    task.style.display = task.classList.contains("completed") ? "none" : "flex";
                    break;
                case "completed":
                    task.style.display = task.classList.contains("completed") ? "flex" : "none";
                    break;
            }
        });
    }

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll("li").forEach(task => {
            tasks.push({
                text: task.querySelector("span").textContent,
                completed: task.classList.contains("completed")
            });
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(task => {
            const li = createTaskElement(task.text, task.completed);
            taskList.appendChild(li);
        });
    }
});