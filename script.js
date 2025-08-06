let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

const input = document.getElementById('task-input');
const dateInput = document.getElementById('task-date');
const tagInput = document.getElementById('task-tag');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('task-list');
const filters = document.querySelectorAll('.filter');
const themeToggle = document.getElementById('theme-toggle');
const emptyState = document.getElementById('empty-state');

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks(filter = 'all') {
  list.innerHTML = '';
  const filtered = tasks.filter(task => {
    return (
      filter === 'all' ||
      (filter === 'active' && !task.completed) ||
      (filter === 'completed' && task.completed)
    );
  });

  if (filtered.length === 0) {
    emptyState.style.display = 'block';
    return;
  } else {
    emptyState.style.display = 'none';
  }

  filtered.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = 'task-item';
    if (task.completed) li.classList.add('completed');

    const title = document.createElement('span');
    title.className = 'task-title';
    title.textContent = task.text;
    title.contentEditable = true;
    title.onblur = () => {
      tasks[index].text = title.textContent;
      saveTasks();
    };

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const info = document.createElement('small');
    info.textContent = `Tag: ${task.tag} | Due: ${task.date || 'None'}`;

    const completeBtn = document.createElement('button');
    completeBtn.textContent = task.completed ? 'Mark Incomplete' : 'Mark Complete';
    completeBtn.onclick = () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks(filter);
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks(filter);
    };

    actions.append(info, completeBtn, deleteBtn);
    li.append(title, actions);
    list.appendChild(li);
  });
}

addBtn.onclick = () => {
  const text = input.value.trim();
  const date = dateInput.value;
  const tag = tagInput.value;

  if (!text) return;

  tasks.push({ text, date, tag, completed: false });
  input.value = '';
  renderTasks();
  saveTasks();
};

filters.forEach(button => {
  button.onclick = () => {
    const filter = button.dataset.filter;
    renderTasks(filter);
  };
});

themeToggle.onclick = () => {
  document.body.classList.toggle('light');
  const mode = document.body.classList.contains('light') ? 'Light Mode' : 'Dark Mode';
  themeToggle.textContent = mode;
  localStorage.setItem('theme', mode);
};

document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'Light Mode') {
    document.body.classList.add('light');
    themeToggle.textContent = 'Light Mode';
  }
  renderTasks();
});
