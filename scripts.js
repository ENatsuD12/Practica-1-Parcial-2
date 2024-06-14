document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');

    loadTasks();

    taskForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const nuevaTarea = document.getElementById('nueva_tarea').value;
        const fechaInicio = document.getElementById('fecha_inicio').value;
        const fechaFin = document.getElementById('fecha_fin').value;
        const responsable = document.getElementById('responsable').value;

        if (fechaFin < fechaInicio) {
            alert('La fecha de fin no puede ser menor a la fecha de inicio');
            return;
        }

        const task = {
            id: Date.now(),
            nuevaTarea,
            fechaInicio,
            fechaFin,
            responsable,
            completed: false
        };

        saveTask(task);
        addTaskToList(task);
        taskForm.reset();
    });

    function saveTask(task) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => addTaskToList(task));
    }

    function addTaskToList(task) {
        const li = document.createElement('li');
        li.className = `list-group-item d-flex justify-content-between align-items-center ${task.completed ? 'task-completed' : 'task-pending'}`;
        li.dataset.id = task.id;

        const now = new Date().toISOString().split('T')[0];
        const expired = now > task.fechaFin;

        if (expired && !task.completed) {
            li.classList.remove('task-pending');
            li.classList.add('task-expired');
        }

        li.innerHTML = `
            <div>
                <h5>${task.nuevaTarea}</h5>
                <p><strong>Inicio:</strong> ${task.fechaInicio}</p>
                <p><strong>Fin:</strong> ${task.fechaFin}</p>
                <p><strong>Responsable:</strong> ${task.responsable}</p>
            </div>
            <div>
                ${!task.completed && !expired ? `<button class="btn btn-success btn-sm complete-task">Completar</button>` : ''}
                ${task.completed ? `<button class="btn btn-warning btn-sm uncomplete-task">Desmarcar</button>` : ''}
                <button class="btn btn-danger btn-sm delete-task">Eliminar</button>
            </div>
        `;

        taskList.appendChild(li);
    }

    taskList.addEventListener('click', function(event) {
        if (event.target.classList.contains('complete-task')) {
            const taskId = event.target.closest('li').dataset.id;
            toggleTaskCompletion(taskId, true);
        } else if (event.target.classList.contains('uncomplete-task')) {
            const taskId = event.target.closest('li').dataset.id;
            toggleTaskCompletion(taskId, false);
        } else if (event.target.classList.contains('delete-task')) {
            const taskId = event.target.closest('li').dataset.id;
            deleteTask(taskId);
        }
    });

    function toggleTaskCompletion(taskId, completed) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.map(task => {
            if (task.id == taskId) {
                task.completed = completed;
            }
            return task;
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        taskList.innerHTML = '';
        loadTasks();
    }

    function deleteTask(taskId) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(task => task.id != taskId);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        taskList.innerHTML = '';
        loadTasks();
    }
});
