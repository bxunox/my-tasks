document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');
    const list = document.getElementById('todo-list');
    const tabActive = document.getElementById('tab-active');
    const tabArchive = document.getElementById('tab-archive');
    const pageTitle = document.getElementById('page-title');
    
    let todos = JSON.parse(localStorage.getItem('ios_private_todos')) || [];
    let currentView = 'active'; 

    function saveTodos() {
        localStorage.setItem('ios_private_todos', JSON.stringify(todos));
    }

    function renderTodos() {
        list.innerHTML = '';
        
        todos.forEach((todo, index) => {
            const isCompleted = todo.completed;
            if ((currentView === 'active' && isCompleted) || (currentView === 'archive' && !isCompleted)) {
                return; 
            }

            const li = document.createElement('li');
            li.classList.add('animate-in'); 
            if (isCompleted) li.classList.add('completed');
            
            const checkbox = document.createElement('div');
            checkbox.className = 'checkbox';
            checkbox.onclick = () => handleAction(index, li, 'complete');

            const textSpan = document.createElement('span');
            textSpan.className = 'task-text';
            textSpan.textContent = todo.text;

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'delete-btn';
            deleteBtn.onclick = () => handleAction(index, li, 'delete');

            li.appendChild(checkbox);
            li.appendChild(textSpan);
            li.appendChild(deleteBtn); // Now appended unconditionally
            
            list.appendChild(li);
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (text) {
            todos.unshift({ text: text, completed: false });
            input.value = '';
            saveTodos();
            renderTodos();
        }
    });

    // Unified animation handler for both completing and deleting
    function handleAction(index, liElement, actionType) {
        liElement.classList.remove('animate-in');
        liElement.classList.add('animate-out');
        
        // Timer matches the CSS animation duration (300ms)
        setTimeout(() => {
            if (actionType === 'complete') {
                todos[index].completed = !todos[index].completed;
            } else if (actionType === 'delete') {
                todos.splice(index, 1);
            }
            saveTodos();
            renderTodos();
        }, 280); // Firing slightly before 300ms to guarantee no visual snap
    }

    tabActive.addEventListener('click', () => {
        currentView = 'active';
        tabActive.classList.add('active');
        tabArchive.classList.remove('active');
        pageTitle.textContent = 'Tasks';
        form.classList.remove('hidden'); 
        renderTodos();
    });

    tabArchive.addEventListener('click', () => {
        currentView = 'archive';
        tabArchive.classList.add('active');
        tabActive.classList.remove('active');
        pageTitle.textContent = 'Archive';
        form.classList.add('hidden'); 
        renderTodos();
    });

    renderTodos();

    if (navigator.storage && navigator.storage.persist) {
        navigator.storage.persist().then(granted => {
            if (granted) console.log("Storage will not be cleared by iOS.");
        });
    }

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js');
    }
});