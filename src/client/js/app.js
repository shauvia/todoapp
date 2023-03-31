const url = ""; 
const users = "/users/"
const tasksApi = "/tasks/"
let user = "";
// const postTask = "/task"


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
    console.log("displayTaskList, task name: ", tasks[i].taskName)
    input.checked = tasks[i].checked; // is suposed to be setting checked status according to the list from server 
    console.log("displayTaskList, status z servera: ", tasks[i].checked)
    let taskId = tasks[i].taskId;
    console.log("displayTaskLis: taskId",taskId);
    let eventHandler = async (event) => {
      console.log("changeStatus, address: ", url+users+user+tasksApi+taskId+input.checked)
      await postStatusChange(url, users, user, tasksApi,taskId,input.checked);
    };
    input.addEventListener('click', eventHandler);
    let button = document.createElement("button");
    button.classList.add("btn-delete");
    let spanDeleteBtn = document.createElement("span");
    spanDeleteBtn.classList.add("mdi", "mdi-delete", "mdi-24px", "delete_button");
    let spanDeleteBtnHovered = document.createElement("span");
    spanDeleteBtnHovered.classList.add("mdi", "mdi-delete-empty", "mdi-24px", "delete_button_hovered")
    let deleteHandler = async (e) => {
      await removeTask(url, users, user, tasksApi, taskId);
      clearTaskList();
      let taskList = await getTasks(url, users, user, tasksApi)
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

async function removeTask(url, users, accName, tasksApi, taskNum){
  console.log("removeTask: url, tasks, taskId",url+users+accName+tasksApi+taskNum);
  let response = await fetch(url+users+accName+tasksApi+taskNum, { 
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

async function postStatusChange(url, users, accName, tasksApi, taskId, status){
  console.log ("postStatusChange, status: ", status)
  
  const  inputStatus  = {
    userInpStat: status
  }

  console.log("postStatusChange, address: ", url+users+accName+tasksApi+taskId) 
  
  let response = await fetch(url+users+accName+tasksApi+taskId, { 
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

// async function changeStatus(id, inputStatus){
//   await postStatusChange(url, users, user, tasksApi, id, inputStatus)
// }



function clearTaskList(){
  let ul = document.getElementById('taskList');
  while (ul.firstChild) { // code from https://developer.mozilla.org/en-US/docs/Web/API/Node/removeChild 
    ul.removeChild(ul.firstChild); 
  }
}

async function addTask(url, users, accName, tasksApi, uInput){
  console.log("addTask", users, accName, tasksApi, uInput)
  // console.log("app.js,addTask URL: ", url+postTask,)
  let response = await fetch(url+users+accName+tasksApi, { 
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

async function getTasks(url, users, accName, tasksApi){
  console.log('getTasks', users, accName, tasksApi);
  let response = await fetch(url+users+accName+tasksApi, {
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
  showHomePage()
  // clearUserInput()
  // let listOfTasks = await getTasks(url, users, user, tasksApi);
  // displayTaskList(listOfTasks);
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
  await addTask(url, users, user, tasksApi, userData);
  console.log("1");
  let listOfTasks = await getTasks(url, users, user, tasksApi);
  console.log("listOfTasks", listOfTasks)
  clearTaskList();
  displayTaskList(listOfTasks);
}

// function initializeForms() {
//   document.getElementById('addTaskBtn').addEventListener('click', addTaskHandler);
//   window.addEventListener('load', loadWindowHandler);
// }

//pamiętac aby skonczeniu wszystkiego zmienic wartość zmiennej user na "" 

// account creating and login

function clearDisplayMessages(){
  document.getElementById('displayMessage').innerHTML = '';
}

function cleanCreateAccInput(){
  document.getElementById('createAccount').value = "";
}

function showHomePage(){
  document.getElementById("homePage").style.display = "grid";
  document.getElementById("addTask").style.display='none';
  document.getElementById("logoutForm").style.display = 'none';
}

function cleanLogin(){
  document.getElementById('login').value = "";
}

async function showFormAndTasksOnLogin(){
  let taskList = await getTasks(url, users, user, tasksApi);
  clearTaskList();
  displayTaskList(taskList);
  document.getElementById("homePage").style.display = "none";
  document.getElementById("addTask").style.display='grid';
  document.getElementById("logoutForm").style.display = 'block';
}

function logOutAcc(){
  user = ""
  showHomePage();
  document.getElementById("logoutForm").style.display = 'none';
}

async function preventInputSendingHandler(event){
  if (event.key === "Enter") {
    event.preventDefault();
    // wsadzić tu funkcję która loguje albo tworzy konto? 
  }
}

async function createAcc(url, users, userAccName){
  let response = await fetch(url + users, {
    method: 'PUT',
    body: JSON.stringify(userAccName),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    let err = new Error('fetch failed, createAcc failed, response.status: ' +  response.status, ' response.statusText: ' +  response.statusText);
    throw err;
  }
  let answer = await response.json();
  return answer;
}

async function logToAcc(url, users, accId) {
  let response = await fetch(url + users + accId, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    let err = new Error('fetch failed, logToAcc failed, response.status: ' +  response.status, ' response.statusText: ' +  response.statusText);
    throw err;
  }
  let content = await response.json();
  return content;
}

async function createAccountHandler(event){ 
  let accName = document.getElementById('createAccount').value;
  console.log("userName: ", accName)
  if (!accName || accName ==""){
    clearDisplayMessages();
    document.getElementById('displayMessage').innerHTML = 'Account username cannot be empty.'
    return;
  }
  let account = await createAcc(url, users, accName);
  console.log("tripUrl, accUrl, userName: ", users, accName)
  console.log("account: ", account);
  cleanCreateAccInput()
  if (!account.alreadyCreated){
    clearDisplayMessages();
    showHomePage();
    document.getElementById('displayMessage').innerHTML = 'Your account ' + accName + ' has been set up.';
    
  } else {
    clearDisplayMessages();
    document.getElementById("displayMessage").innerHTML = "You have already created account: " + accName;
  }   
}

async function loginToAccHandler(event){
  let userId = document.getElementById('login').value;
  console.log( "Login user acc: ", userId)
  if (!userId || userId ==""){
    clearDisplayMessages();
    document.getElementById('displayMessage').innerHTML = 'Login cannot be empty.'
    return;
  }
  let accExists = await logToAcc(url, users, userId);
  console.log("login, account is created: ", accExists.isCreated)
  cleanLogin()
  if (!accExists.isCreated){
    clearDisplayMessages();
    document.getElementById('displayMessage').innerHTML = 'Account: ' + userId + " doesn't exist. Please create your account."
  } else {
    user = userId;
    console.log("logged to : ", user)
    clearDisplayMessages();
    // document.getElementById('jestesZalogowana').innerHTML = 'Jesteś zalogowana, a tu są twoje fajoskie wycieczki'
    showFormAndTasksOnLogin();
  }
  
}

// dopasować funkcję, do tej apkil
function logOutAndClearDispHandler(event){
  logOutAcc();
  console.log('userLogin logout', user);
  clearDisplayMessages();
    
}

function initializeForms() {
  
  window.addEventListener('load', loadWindowHandler);
  document.getElementById('createAccForm').addEventListener("keydown", preventInputSendingHandler)
  document.getElementById('loginForm').addEventListener("keydown", preventInputSendingHandler)
  document.getElementById('createAccBtn').addEventListener('click', createAccountHandler);
  document.getElementById('loginButton').addEventListener('click', loginToAccHandler);
  document.getElementById('addTaskBtn').addEventListener('click', addTaskHandler);
  document.getElementById('logoutButton').addEventListener('click', logOutAndClearDispHandler)
}


export {initializeForms};
