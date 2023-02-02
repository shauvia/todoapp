const url = ""; 
const toDoApi = "/tasks"

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

async function addTask(url, toDoApi, uInput){
  console.log("addTask", url, toDoApi, uInput)
  console.log("app.js,addTask URL: ", url+toDoApi,)
  let response = await fetch(url+toDoApi, { 
    method: 'POST' , 
    body: JSON.stringify(uInput),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    let err = new Error('fetch failed, addTrip and get forecast, response.status: ' +  response.status, ' response.statusText: ' +  response.statusText);
    throw err;
  }
  let content = await response.json(); // dobranie sie do tresci jest asynchroniczne, trzeba czekac; .json() oddżejsonowuje
  return content;
}

async function getTask()


async function addTaskHandler(event){
  const userData = gatherUserInput();
  clearUserInput()
  await addTask(url, toDoApi, userData);
  
}

function initializeForms() {
  document.getElementById('addTaskBtn').addEventListener('click', addTaskHandler);
}

export {initializeForms};