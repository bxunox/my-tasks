// Wait for the HTML to fully load before running the script
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');
    const list = document.getElementById('todo-list');

    // Load tasks from local storage
    let todos = JSON.parse(localStorage.getItem('ios_private_todos')) || [];

    function saveTodos() {
        localStorage.setItem('ios_private_todos', JSON.stringify(todos));
    }

    function renderTodos() {
        list.innerHTML = '';
        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            if (todo.completed) li.classList.add('completed');
            
            const textSpan = document.createElement('span');
            textSpan.className = 'task-text';
            textSpan.textContent = todo.text;
            textSpan.onclick = () => toggleTodo(index);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'delete-btn';
            deleteBtn.onclick = () => deleteTodo(index);

            li.appendChild(textSpan);
            li.appendChild(deleteBtn);
            list.appendChild(li);
        });
    }

    // THE FIX: This specific block stops the page refresh
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // <-- Stops the page from reloading
        const text = input.value.trim();
        if (text) {
            todos.push({ text: text, completed: false });
            input.value = '';
            saveTodos();
            renderTodos();
        }
    });

    function toggleTodo(index) {
        todos[index].completed = !todos[index].completed;
        saveTodos();
        renderTodos();
    }

    function deleteTodo(index) {
        todos.splice(index, 1);
        saveTodos();
        renderTodos();
    }

    // Initial Render
    renderTodos();

    // --- PWA & OFFLINE LOGIC ---
    if (navigator.storage && navigator.storage.persist) {
        navigator.storage.persist().then(granted => {
            if (granted) console.log("Storage will not be cleared by iOS.");
        });
    }

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker registered!', reg))
            .catch(err => console.error('Service Worker failed.', err));
    }
});