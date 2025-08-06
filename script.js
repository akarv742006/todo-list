const taskInput = document.getElementById("task-input");
const taskDate = document.getElementById("task-date");
const taskTag = document.getElementById("task-tag");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const filters = document.querySelectorAll(".filter");
const themeToggle = document.getElementById("theme-toggle");
const emptyState = document.getElementById("empty-state");

let tasks = [];

function renderTasks(filter = "all") {
  taskList.innerHTML = "";

  const filtered = tasks.filter(task => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  if (filtered.length === 0) {
    emptyState.style.display = "block";
    return;
  } else {
    emptyState.style.display = "none";
  }

  filtered.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = `task ${task.completed ? "completed" : ""}`;

    const details = document.createElement("div");
    details.className = "task-details";
    details.innerHTML = `
      <strong>${task.text}</strong> <br/>
      <small>${task.date} | ${task.tag}</small>
    `;

    const actions = document.createElement("div");
    actions.className = "task-actions";
    const completeBtn = document.createElement("button");
    completeBtn.textContent = task.completed ? "Undo" : "Done";
    completeBtn.onclick = () => toggleComplete(index);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => deleteTask(index);

    actions.appendChild(completeBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(details);
    li.appendChild(actions);

    taskList.appendChild(li);
  });
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

addBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  const date = taskDate.value;
  const tag = taskTag.value;

  if (!text || !date) return alert("Please enter task and date");

  tasks.push({ text, date, tag, completed: false });
  taskInput.value = "";
  taskDate.value = "";
  taskTag.value = "Work";
  renderTasks();
});

filters.forEach(btn => {
  btn.addEventListener("click", () => {
    filters.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderTasks(btn.dataset.filter);
  });
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  themeToggle.textContent = document.body.classList.contains("dark-mode") ? "Light" : "Dark";
});

renderTasks();
