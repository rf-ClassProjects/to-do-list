const pendingList = document.getElementById("pending-list");
const completedList = document.getElementById("complete-list");
const taskTemplate = document.getElementById("task-template");

const headerTitle = document.getElementById("header-title");
const headerAlt = document.getElementById("header-alt");

const noPendingMessage = document.getElementById("no-pending");
const noCompletedMessage = document.getElementById("no-completed");

const headerContent = headerTitle.querySelector("h1");

let taskEditCancelled = false;

// function OnInput() {
//   this.style.height = 0;
//   this.style.height = this.scrollHeight + "px";
// }

function editTodoName() {
  headerTitle.classList.add("hide");
  headerAlt.classList.remove("hide");

  headerAlt.querySelector("form").addEventListener("submit", finishEditTodoName);

  const input = headerAlt.querySelector("input");
  input.value = headerContent.textContent;
  input.focus();
  input.setSelectionRange(input.value.length, input.value.length);
}

function finishEditTodoName(event) {
  event.preventDefault();

  headerAlt.classList.add("hide");
  headerTitle.classList.remove("hide");

  headerAlt.querySelector("form").removeEventListener("submit", finishEditTodoName);

  headerContent.textContent = headerAlt.querySelector("input").value;
}

function addTask(taskDesc, list) {
  const task = taskTemplate.content.firstElementChild.cloneNode(true);
  const taskButtons = task.querySelectorAll("i");
  const taskDescContainer = task.querySelector("p");
  const input = task.querySelector("input");

  taskButtons[0].addEventListener("click", deleteTask);
  taskButtons[1].addEventListener("click", completeTask);

  taskDescContainer.addEventListener("dblclick", editTask);

  input.setAttribute("style", "height:" + input.scrollHeight + "px;overflow-y:hidden;");
  input.textContent = taskDesc;
  // input.addEventListener("input", OnInput, false);
  input.addEventListener("focusout", finishTaskEdit);
  input.addEventListener("keydown", keyFinishTaskEdit);

  list.appendChild(task);
  taskEditCancelled = false;
  input.focus();
  input.setSelectionRange(input.value.length, input.value.length);
}

function editTask(event) {
  taskEditCancelled = false;
  event.target.classList.add("hide");

  const task = event.target.parentNode;
  const editDesc = task.querySelector("#edit-desc");
  const input = task.querySelector("input");

  editDesc.classList.remove("hide");

  input.value = event.target.textContent;
  input.focus();
  input.setSelectionRange(input.value.length, input.value.length);
}

function finishTaskEdit(event) {
  if (taskEditCancelled) return;
  const input = event.target;
  input.parentNode.classList.add("hide");

  const task = input.parentNode.parentNode;
  const taskDesc = task.querySelector("p");

  taskDesc.classList.remove("hide");

  taskDesc.textContent = input.value;
}

function keyFinishTaskEdit(event) {
  if (event.key === "Escape") {
    taskEditCancelled = true;
    const input = event.target;
    input.parentNode.classList.add("hide");

    const task = input.parentNode.parentNode;
    const taskDesc = task.querySelector("p");

    taskDesc.classList.remove("hide");
  } else if (event.key === "Enter") {
    const input = event.target;
    input.parentNode.classList.add("hide");

    const task = input.parentNode.parentNode;
    const taskDesc = task.querySelector("p");

    taskDesc.classList.remove("hide");

    taskDesc.textContent = input.value;
  }
}

function deleteTask(event) {
  const task = event.target.parentNode;

  pendingList.removeChild(task);

  const taskButtons = task.querySelectorAll("i");

  taskButtons[0].removeEventListener("click", deleteTask);
  taskButtons[1].removeEventListener("click", completeTask);

  const taskDescContainer = task.querySelector("input");

  taskDescContainer.removeEventListener("click", editTask);

  const input = task.querySelector("input");

  // input.removeEventListener("input", OnInput, false);
  input.removeEventListener("focusout", finishTaskEdit);
  input.removeEventListener("keydown", keyFinishTaskEdit);

  if (pendingList.childElementCount <= 1) {
    noPendingMessage.classList.remove("hide");
  }
}

function deleteCompletedTask(event) {
  const task = event.target.parentNode;

  completedList.removeChild(task);

  const taskButtons = task.querySelectorAll("i");

  taskButtons[0].removeEventListener("click", deleteCompletedTask);
  taskButtons[1].removeEventListener("click", reverseCompleteTask);

  const taskDescContainer = task.querySelector("input");

  taskDescContainer.removeEventListener("click", editTask);

  const input = task.querySelector("input");

  // input.removeEventListener("input", OnInput, false);
  input.removeEventListener("focusout", finishTaskEdit);
  input.removeEventListener("keydown", keyFinishTaskEdit);

  if (completedList.childElementCount <= 1) {
    noCompletedMessage.classList.remove("hide");
  }
}

function completeTask(event) {
  const task = event.target.parentNode;

  pendingList.removeChild(task);
  completedList.appendChild(task);

  const taskButtons = task.querySelectorAll("i");

  taskButtons[0].removeEventListener("click", deleteTask);
  taskButtons[1].removeEventListener("click", completeTask);

  taskButtons[0].addEventListener("click", deleteCompletedTask);
  taskButtons[1].addEventListener("click", reverseCompleteTask);
  taskButtons[1].style.color = "#7cd18c";

  if (pendingList.childElementCount <= 1) {
    noPendingMessage.classList.remove("hide");
  }
  noCompletedMessage.classList.add("hide");
}

function reverseCompleteTask(event) {
  const task = event.target.parentNode;

  completedList.removeChild(task);
  pendingList.appendChild(task);

  const taskButtons = task.querySelectorAll("i");

  taskButtons[0].removeEventListener("click", deleteCompletedTask);
  taskButtons[1].removeEventListener("click", reverseCompleteTask);

  taskButtons[0].addEventListener("click", deleteTask);
  taskButtons[1].addEventListener("click", completeTask);
  taskButtons[1].style.removeProperty("color");

  if (completedList.childElementCount <= 1) {
    noCompletedMessage.classList.remove("hide");
  }
  noPendingMessage.classList.add("hide");
}

function addPendingTask() {
  addTask("", pendingList);
  noPendingMessage.classList.add("hide");
}
