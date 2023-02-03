const url = ""; 
const postTask = "/task"
const tasks = "/tasks"

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
    li.innerHTML = tasks[i].taskName;
    // let tripNum = trips[i].tripID;
    // let eventHandler = async (event) => {
    //   await fetchAndDisplayTrip(tripNum);
    // };
    // li.addEventListener('click', eventHandler);
    // li.setAttribute("id", trips[i].tripID);
    ul.appendChild(li);
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
    let err = new Error('fetch failed, addTrip and get forecast, response.status: ' +  response.status, ' response.statusText: ' +  response.statusText);
    throw err;
  }
  let content = await response.text(); // dobranie sie do tresci jest asynchroniczne, trzeba czekac; .json() oddżejsonowuje
  console.log("addTaskContent", content)
  return content;
}

async function getTask(url, taskList){
  console.log('getTask', url, taskList);
  let response = await fetch(url+taskList, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    let err = new Error('fetch failed, getTask, response.status: ' +  response.status, ' response.statusText: ' +  response.statusText);
    throw err;
  }
  let content = await response.json();
  console.log("getTaskContent", content)
  return content;
}

// async function getTrips(url, accountURL, accName, tripsApi){
//   console.log("url, accountURL, accName, tripsApi", url, accountURL, accName, tripsApi)
//   let response = await fetch(url + accountURL + accName + tripsApi, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   });
//   if (!response.ok) {
//     let err = new Error('fetch failed, getTrips, response.status: ' +  response.status, ' response.statusText: ' +  response.statusText);
//     throw err;
//   }
//   let content = await response.json();
//   return content;
// }

async function addTaskHandler(event){
  const userData = gatherUserInput();
  clearUserInput()
  await addTask(url, postTask, userData);
  console.log("1");
  let listOfTasks = await getTask(url, tasks);
  console.log("listOfTasks", listOfTasks)
  displayTaskList(listOfTasks);

  
}

function initializeForms() {
  document.getElementById('addTaskBtn').addEventListener('click', addTaskHandler);
}

export {initializeForms};