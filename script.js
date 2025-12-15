const inputBox = document.querySelector(".inputField input");
const addBtn = document.querySelector(".inputField button");
const todoList = document.querySelector(".todoList");
const deleteAllBtn = document.querySelector(".footer button");
const tabs = document.querySelectorAll(".tab");

let todos = JSON.parse(localStorage.getItem("Todos")) || [];

inputBox.addEventListener("keyup", (e) => {
  let value = inputBox.value.trim();
  addBtn.disabled = !value;
  if (e.key === "Enter" && value) {
    addBtn.click();
  }
});

addBtn.onclick = () => {
  let value = inputBox.value.trim();
  if (value) {
    todos.push({ task: value, status: "pending" });
    localStorage.setItem("Todos", JSON.stringify(todos));
    inputBox.value = "";
    renderTasks("pending");
  }
};

deleteAllBtn.onclick = () => {
  todos = [];
  localStorage.setItem("Todos", JSON.stringify(todos));
  renderTasks();
};

tabs.forEach(tab => {
  tab.onclick = () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    renderTasks(tab.dataset.tab);
  };
});

function renderTasks(filter = "pending") {
  todoList.innerHTML = "";
  let filteredTodos;

  if (filter === "all") {
    todos.sort((a, b) => (a.status > b.status ? 1 : -1));
    filteredTodos = todos;
  } else {
    filteredTodos = filter === "completed" ? 
      todos.filter(t => t.status === "completed") :
      todos.filter(t => t.status === "pending");
  }

  filteredTodos.forEach((todo, index) => {
    const li = document.createElement("li");
    li.textContent = todo.task;
    li.className = todo.status === "completed" ? "done" : "";

    const actions = document.createElement("div");
    actions.className = "actions";

    const completeBtn = document.createElement("button");
    completeBtn.textContent = "Complete";
    completeBtn.className = "complete-btn";
    completeBtn.onclick = () => markCompleted(index);

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.className = "delete-btn";
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      deleteTask(index);
    };

    if (todo.status === "pending") {
      actions.appendChild(completeBtn);
    }
    actions.appendChild(deleteBtn);

    li.appendChild(actions);
    todoList.appendChild(li);
  });

  const pendingCount = todos.filter(t => t.status === "pending").length;
  document.querySelector(".pendingTasks").textContent = pendingCount;

  deleteAllBtn.disabled = todos.length === 0;

}

function markCompleted(filteredIndex) {
  const activeTab = document.querySelector(".tab.active").dataset.tab;
  const filteredTodos = activeTab === "completed"
    ? todos.filter(t => t.status === "completed")
    : todos.filter(t => t.status === "pending");

  const actualIndex = todos.indexOf(filteredTodos[filteredIndex]);

  todos[actualIndex].status = "completed";
  localStorage.setItem("Todos", JSON.stringify(todos));

  const pendingAfter = todos.filter(t => t.status === "pending").length;
  if (pendingAfter === 0) {
    setTimeout(() => {
      alert("🎉 Congratulations on completing all your tasks! You've had such a productive time! Keep up the amazing work! 🌟");
    }, 500);
  }

  renderTasks(activeTab);
}

function deleteTask(index) {
  todos.splice(index, 1);
  localStorage.setItem("Todos", JSON.stringify(todos));
  renderTasks(document.querySelector(".tab.active").dataset.tab);
}

renderTasks();
