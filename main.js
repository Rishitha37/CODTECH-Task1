// State
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

// DOM Elements
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
const filterButtons = document.querySelectorAll('.filters .btn');
const progressStats = document.getElementById('progressStats');
const progressFill = document.getElementById('progressFill');

// Utils
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
  renderTodos();
  updateProgress();
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Todo Operations
function addTodo(text) {
  todos.unshift({
    id: generateId(),
    text: text.trim(),
    completed: false,
    createdAt: Date.now()
  });
  saveTodos();
}

function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    saveTodos();
  }
}

function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  saveTodos();
}

// Rendering
function updateProgress() {
  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const active = total - completed;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  progressStats.innerHTML = `
    <span>${active} active</span>
    <span>${completed} completed</span>
    <span>${percentage}% done</span>
  `;

  progressFill.style.width = `${percentage}%`;
}

function renderTodos() {
  const filteredTodos = todos.filter(todo => {
    if (currentFilter === 'active') return !todo.completed;
    if (currentFilter === 'completed') return todo.completed;
    return true;
  });

  todoList.innerHTML = filteredTodos.length === 0 
    ? '<li class="todo-item">No tasks found</li>'
    : filteredTodos.map(todo => `
      <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
        <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
        <span class="todo-text">${todo.text}</span>
        <button class="todo-delete">×</button>
      </li>
    `).join('');

  // Add event listeners
  todoList.querySelectorAll('.todo-item').forEach(item => {
    const id = item.dataset.id;
    const checkbox = item.querySelector('.todo-checkbox');
    const deleteBtn = item.querySelector('.todo-delete');

    if (checkbox) {
      checkbox.addEventListener('change', () => toggleTodo(id));
    }
    
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this task?')) {
          deleteTodo(id);
        }
      });
    }
  });
}

// Event Listeners
todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = todoInput.value;
  if (text.trim()) {
    addTodo(text);
    todoInput.value = '';
  }
});

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    currentFilter = button.dataset.filter;
    renderTodos();
  });
});

// Initial render
renderTodos();
updateProgress();
