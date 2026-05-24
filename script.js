document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');
    const list = document.getElementById('todo-list');
    const tabActive = document.getElementById('tab-active');
    const tabArchive = document.getElementById('tab-archive');
    const pageTitle = document.getElementById('page-title');
    
    let todos = JSON.parse(localStorage.getItem('ios_private_todos')) || [];
    let currentView = 'active'; // Tracks which tab is open ('active' or 'archive')

    function saveTodos() {
        localStorage.setItem('ios_private_todos', JSON.stringify(todos));
    }

    function renderTodos() {
        list.innerHTML = '';
        
        todos.forEach((todo, index) => {
            // Only render items that match the current view
            const isCompleted = todo.completed;
            if ((currentView === 'active' && isCompleted) || (currentView === 'archive' && !isCompleted)) {
                return; // Skip rendering this item
            }

            const li = document.createElement('li');
            li.classList.add('animate-in'); // Add spawn animation
            if (isCompleted) li.classList.add('completed');
            
            // Custom Checkbox
            const checkbox = document.createElement('div');
            checkbox.className = 'checkbox';
            checkbox.onclick = () => handleComplete(index, li);

            const textSpan = document.createElement('span');
            textSpan.className = 'task-text';
            textSpan.textContent = todo.text;

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'delete-btn';
            deleteBtn.onclick = () => handleDelete(index, li);

            li.appendChild(checkbox);
            li.appendChild(textSpan);
            
            // Only show delete button in Archive to keep Active view clean (optional)
            if (currentView === 'archive') {
                li.appendChild(deleteBtn);
            }
            
            list.appendChild(li);
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (text) {
            // Add new task to the beginning of the array so it appears at the top
            todos.unshift({ text: text, completed: false });
            input.value = '';
            saveTodos();
            renderTodos();
        }
    });

    // Handle checkmark with animation
    function handleComplete(index, liElement) {
        // Swap out the spawn animation for the exit animation
        liElement.classList.remove('animate-in');
        liElement.classList.add('animate-out');
        
        // Wait 300ms for CSS animation to finish before moving data
        setTimeout(() => {
            todos[index].completed = !todos[index].completed;
            saveTodos();
            renderTodos();
        }, 300); 
    }

    // Handle delete with animation
    function handleDelete(index, liElement) {
        liElement.classList.remove('animate-in');
        liElement.classList.add('animate-out');
        
        setTimeout(() => {
            todos.splice(index, 1);
            saveTodos();
            renderTodos();
        }, 300);
    }

    // --- Tab Switching Logic ---
    tabActive.addEventListener('click', () => {
        currentView = 'active';
        tabActive.classList.add('active');
        tabArchive.classList.remove('active');
        pageTitle.textContent = 'Tasks';
        form.classList.remove('hidden'); // Show the input form
        renderTodos();
    });

    tabArchive.addEventListener('click', () => {
        currentView = 'archive';
        tabArchive.classList.add('active');
        tabActive.classList.remove('active');
        pageTitle.textContent = 'Archive';
        form.classList.add('hidden'); // Hide the input form
        renderTodos();
    });

    // Initial Render
    renderTodos();

    // PWA Offline Logic
    if (navigator.storage && navigator.storage.persist) {
        navigator.storage.persist().then(granted => {
            if (granted) console.log("Storage will not be cleared by iOS.");
        });
    }

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js');
    }
});