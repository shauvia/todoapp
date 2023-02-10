const url = ""; 
const postTask = "/task"
const tasks = "/tasks/"

function gatherUserInput(){
  const task = document.getElementById("task").value;
  const userInput = {
    userTask: task
  }
  return userInput;
}

function clearUserInput(){
  document.getElementById("task").value = "";
}

function displayTaskList(tasks){
  let ul = document.getElementById('taskList');
  for( let i = 0; i < tasks.length; i++){
    let li = document.createElement("li");
    let input = document.createElement("input");
    input.setAttribute("type", "checkbox");
    let label = document.createElement("label")
    label.innerHTML = tasks[i].taskName;
    let taskId = tasks[i].taskId;
    let eventHandler = async (event) => {
      await changeStatus(taskId, input.checked);
    };
    input.addEventListener('click', eventHandler);
    li.appendChild(input)
    li.appendChild(label)
    // li.innerHTML = tasks[i].taskName;
    // let tripNum = trips[i].tripID;
    // let eventHandler = async (event) => {
    //   await fetchAndDisplayTrip(tripNum);
    // };
    // li.addEventListener('click', eventHandler);
    // li.setAttribute("id", trips[i].tripID);
    ul.appendChild(li);
  }
}

async function postStatusChange(url, tasks, taskId, status){
  const  inputStatus  = {
    userInpStat: status
  }

  console.log("address", url+tasks+taskId, "inputStatusObject", inputStatus)
  let response = await fetch(url+tasks+taskId, { 
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
  await postStatusChange(url, tasks, id, inputStatus)
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


async function addTaskHandler(event){
  const userData = gatherUserInput();
  clearUserInput()
  await addTask(url, postTask, userData);
  console.log("1");
  let listOfTasks = await getTasks(url, tasks);
  console.log("listOfTasks", listOfTasks)
  clearTaskList();
  displayTaskList(listOfTasks);

  
}

function initializeForms() {
  document.getElementById('addTaskBtn').addEventListener('click', addTaskHandler);
}

export {initializeForms};