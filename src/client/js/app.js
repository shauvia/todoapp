const url = ""; 
const postTask = "/task"
const tasksApi = "/tasks/"

function gatherUserInput(task){
  const userInput = {
    userTask: task
  }
  return userInput;
}

function clearUserInput(){
  document.getElementById("task").value = "";
}

function displayErrorMessage(){
  document.getElementById('errorMsg').innerHTML = "Task is empty";
}

function displayTaskList(tasks){
  let ul = document.getElementById('taskList');
  for( let i = 0; i < tasks.length; i++){
    let li = document.createElement("li");
    let input = document.createElement("input");
    input.setAttribute("type", "checkbox");
    let label = document.createElement("label")
    label.innerHTML = tasks[i].taskName;
    input.checked = tasks[i].checked; // is suposed to be setting checked status according to the list from server 
    let taskId = tasks[i].taskId;
    console.log("displayTaskLis: taskId",taskId)
    let eventHandler = async (event) => {
      await changeStatus(taskId, input.checked);
    };
    input.addEventListener('click', eventHandler);
    let button = document.createElement("button");
    button.classList.add("btn-delete");
    let spanDeleteBtn = document.createElement("span");
    spanDeleteBtn.classList.add("mdi", "mdi-delete", "mdi-24px", "delete_button");
    let spanDeleteBtnHovered = document.createElement("span");
    spanDeleteBtnHovered.classList.add("mdi", "mdi-delete-empty", "mdi-24px", "delete_button_hovered")
    let deleteHandler = async (e) => {
      await removeTask(url, tasksApi, taskId);
      clearTaskList();
      let taskList = await getTasks(url, tasksApi)
      displayTaskList(taskList);
    }
    button.addEventListener('click',  deleteHandler);
    li.appendChild(input);
    li.appendChild(label);
    button.appendChild(spanDeleteBtn);
    button.appendChild(spanDeleteBtnHovered);
    li.appendChild(button);
    ul.appendChild(li);
  }
}

async function removeTask(url, tasksApi, taskNum){
  console.log("removeTask: url, tasks, taskId", url, tasksApi, taskNum);
  let response = await fetch(url + tasksApi + taskNum, { 
    method: 'DELETE', 
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    const err = new Error('fetch failed, removeTask, response.status: ' +  response.status, ' response.statusText: ' +  response.statusText); 
    throw err;
  }
}

async function postStatusChange(url, tasksApi, taskId, status){
  const  inputStatus  = {
    userInpStat: status
  }

  console.log("address", url+tasksApi+taskId, "inputStatusObject", inputStatus)
  let response = await fetch(url+tasksApi+taskId, { 
    method: 'POST' , 
    body: JSON.stringify(inputStatus),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    let err = new Error('fetch failed, postStatusChange, response.status: ' +  response.status, ' response.statusText: ' +  response.statusText);
    throw err;
  }
  let content = await response.text(); // dobranie sie do tresci jest asynchroniczne, trzeba czekac; .json() oddżejsonowuje
  console.log("postStatusChange", content)
  return content;
}

async function changeStatus(id, inputStatus){
  await postStatusChange(url, tasksApi, id, inputStatus)
}




function clearTaskList(){
  let ul = document.getElementById('taskList');
  while (ul.firstChild) { // code from https://developer.mozilla.org/en-US/docs/Web/API/Node/removeChild 
    ul.removeChild(ul.firstChild); 
  }
}

async function addTask(url, postTask, uInput){
  console.log("addTask", url, postTask, uInput)
  console.log("app.js,addTask URL: ", url+postTask,)
  let response = await fetch(url+postTask, { 
    method: 'POST' , 
    body: JSON.stringify(uInput),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    let err = new Error('fetch failed, addTask, response.status: ' +  response.status, ' response.statusText: ' +  response.statusText);
    throw err;
  }
  let content = await response.text(); // dobranie sie do tresci jest asynchroniczne, trzeba czekac; .json() oddżejsonowuje
  console.log("addTaskContent", content)
  return content;
}

async function getTasks(url, taskList){
  console.log('getTasks', url, taskList);
  let response = await fetch(url+taskList, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    let err = new Error('fetch failed, getTasks, response.status: ' +  response.status, ' response.statusText: ' +  response.statusText);
    throw err;
  }
  let content = await response.json();
  console.log("getTaskContent", content)
  return content;
}
 
async function loadWindowHandler(event){
  clearUserInput()
  let listOfTasks = await getTasks(url, tasksApi);
  displayTaskList(listOfTasks);
}


async function addTaskHandler(event){
  const userInput = document.getElementById("task").value;
  console.log("task", userInput);
  if (!userInput || userInput ==""){
    displayErrorMessage()
    return;
  }
  const userData = gatherUserInput(userInput);
  clearUserInput()
  await addTask(url, postTask, userData);
  console.log("1");
  let listOfTasks = await getTasks(url, tasksApi);
  console.log("listOfTasks", listOfTasks)
  clearTaskList();
  displayTaskList(listOfTasks);
}

function initializeForms() {
  document.getElementById('addTaskBtn').addEventListener('click', addTaskHandler);
  window.addEventListener('load', loadWindowHandler);
}

export {initializeForms};