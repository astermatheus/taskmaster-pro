// Selecionando elementos
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const tagInput = document.getElementById('tagInput');
const taskDate = document.getElementById('taskDate'); // Novo campo de data
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const taskProgressBar = document.getElementById('taskProgressBar');
const filterAll = document.getElementById('filterAll');
const filterPending = document.getElementById('filterPending');
const filterCompleted = document.getElementById('filterCompleted');
const themeToggle = document.getElementById('themeToggle');
const deleteModal = document.getElementById('deleteModal');
const confirmDelete = document.getElementById('confirmDelete');
const cancelDelete = document.getElementById('cancelDelete');
const toast = document.getElementById('toast');

let tasks = [];
let filter = 'all';
let taskToDelete = null;

// Função para alternar o tema
themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
});

// Carregar tema preferido
function loadTheme() {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
        document.documentElement.classList.add('dark');
    }
}
loadTheme();

// Função para renderizar a lista de tarefas
function renderTasks() {
    taskList.innerHTML = '';

    const filteredTasks = tasks.filter(task => {
        if (filter === 'pending') return !task.completed;
        if (filter === 'completed') return task.completed;
        return true;
    });

    filteredTasks.forEach((task, index) => {
        const taskItem = document.createElement('li');
        taskItem.className = `flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-md transition-colors duration-300 ease-in-out ${task.completed ? 'opacity-50' : ''}`;
        
        const formattedDate = task.date ? new Date(task.date).toLocaleDateString('pt-BR') : 'Sem data';

        taskItem.innerHTML = `
            <div class="flex items-center">
                <input type="checkbox" class="mr-4" ${task.completed ? 'checked' : ''} onchange="toggleTaskCompletion(${index})">
                <div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">${task.name}</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Prioridade: ${task.priority} | Data: ${formattedDate} | Tags: ${task.tags}</p>
                </div>
            </div>
            <button class="text-error hover:underline" onclick="openDeleteModal(${index})">Excluir</button>
        `;

        taskList.appendChild(taskItem);
    });

    updateTaskCount();
    updateProgressBar();
    saveTasks();
}

// Função para atualizar contagem de tarefas
function updateTaskCount() {
    const pendingTasks = tasks.filter(task => !task.completed).length;
    taskCount.textContent = `${pendingTasks} tarefa(s) pendente(s)`;
}

// Função para atualizar a barra de progresso
function updateProgressBar() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    taskProgressBar.style.width = `${progressPercentage}%`;
}

// Função para adicionar tarefa
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newTask = {
        name: taskInput.value.trim(),
        priority: prioritySelect.value,
        tags: tagInput.value.trim(),
        date: taskDate.value,  // Adicionando a data à tarefa
        completed: false
    };

    if (newTask.name) {
        tasks.push(newTask);
        taskInput.value = '';
        tagInput.value = '';
        taskDate.value = ''; // Limpa o campo de data
        renderTasks();
        showToast('Tarefa adicionada com sucesso!');
    } else {
        showToast('Por favor, insira o nome da tarefa!', 'error');
    }
});

// Função para alternar status de conclusão da tarefa
window.toggleTaskCompletion = function (index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
};

// Função para abrir modal de exclusão
window.openDeleteModal = function (index) {
    taskToDelete = index;
    deleteModal.classList.remove('hidden');
};

// Função para confirmar exclusão
confirmDelete.addEventListener('click', () => {
    if (taskToDelete !== null) {
        tasks.splice(taskToDelete, 1);
        renderTasks();
        closeDeleteModal();
    }
});

// Função para fechar modal de exclusão
cancelDelete.addEventListener('click', closeDeleteModal);

function closeDeleteModal() {
    deleteModal.classList.add('hidden');
    taskToDelete = null;
}

// Função para salvar tarefas no LocalStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Função para carregar tarefas do LocalStorage
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        renderTasks();
    }
}
loadTasks();

// Filtros de visualização
filterAll.addEventListener('click', () => {
    filter = 'all';
    renderTasks();
});

filterPending.addEventListener('click', () => {
    filter = 'pending';
    renderTasks();
});

filterCompleted.addEventListener('click', () => {
    filter = 'completed';
    renderTasks();
});

// Função para mostrar notificações (toast)
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.classList.remove('hidden', 'bg-red-500', 'bg-green-500');
    toast.classList.add(type === 'error' ? 'bg-red-500' : 'bg-green-500');
    setTimeout(() => toast.classList.add('hidden'), 3000);
}

// Carregar estado inicial
renderTasks();
