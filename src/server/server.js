const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const storage = require('./index.js');
const saveDataMongo = storage.saveDataMongo;
const loadDatafromMongo = storage.loadDatafromMongo;

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded( {extended: false} ));
// strict:false is needed to accept raw string
app.use(bodyParser.json({strict:false}));

app.use(express.static('dist'));

const port = process.env.PORT || 3000 // default is port 3000 (locally) but if there a different environment then use port that is default for the environment (np. strona serwowana z azurowego dysku bedzie miala domyslny port uzyty w srodowisku azura) 


function listening(){
  console.log('server runnning');
  console.log(`runnning on localhost ${port}`);
}

// let taskArr = [];
// let taskNum = 0;

// poprawić wszystko w oparciu o konto użytkownika
app.post('/users/:accId/tasks', async function(req, res){
  try {
  let userId = req.params.accId;
  console.log("account", userId);
  let user = await loadDatafromMongo(userId);
  let tasks = user.tasks;
  if (!user) {
    res.status(404).send("No such user");
    return;
  }
  let nextTaskId = user.nextTaskId;
  const singleTask = {
    taskName: "",
    checked: false,
    taskId: -1
  }
  singleTask.taskId = nextTaskId;
  nextTaskId = nextTaskId + 1;
  user.nextTaskId = nextTaskId;
  console.log("nextTaskId", nextTaskId)
  singleTask.taskName = req.body.userTask;
  user.tasks.push(singleTask);
  console.log("user", user);
  await saveDataMongo(user);
  // console.log("allTasks", allTasks);
  res.send("OK");
}catch(error){
  res.status(500).send();
  console.log('Error on the server, posting task failed: ', error);
  }  
})



app.get('/users/:accId/tasks', async function (req, res){
  try{
    let userId = req.params.accId;
    let user = await loadDatafromMongo(userId);
    if (!user) {
      res.status(404).send("No such user");
      return;
    }
    let taskArr = user.tasks
    console.log("Sending tasks", taskArr.length);
    res.send(taskArr);
  } catch(error){
    console.log('Error on the server, getting task list failed: ', error)
    res.status(500).send();
  }  
})

app.post('/users/:accId/tasks/:id', async function (req, res){
  try{
    let id = req.params.id; 
    console.log("taskID", id)
    let inputStatus = req.body.userInpStat;
    console.log("inputStatus", req.body.userInpStat);
    let userId = req.params.accId;
    let user = await loadDatafromMongo(userId);
    if (!user) {
      res.status(404).send("No such user");
      return;
    }
    let arrOfTasks = user.tasks;
    for (let i = 0; i < arrOfTasks.length; i++){
      if (arrOfTasks[i].taskId == id) {
        arrOfTasks[i].checked = inputStatus;
        console.log("for, status", arrOfTasks[i].checked)
        await saveDataMongo(user);
        res.send("OK");
        return;
      }
    }
    res.status(404).send("Task not found");  
  } catch(error){
    console.log('Error on the server, changing checked failed: ', error);
    res.status(500).send();
    
  }
})

app.delete('/users/:accId/tasks/:id', async function (req, res){
  try{
    let userId = req.params.accId;
    let taskNum = req.params.id;
    let user = await loadDatafromMongo(userId);
    if (!user) {
      res.status(404).send("No such user");
      return;
    }
    let taskArr = user.tasks
    for (let i = 0; i < taskArr.length; i++){
      if (taskNum == taskArr[i].taskId){
        taskArr.splice(i, 1);
        await 
        saveDataMongo(user);
        res.send();
      }
    }
  }catch(error){
    res.status(500).send();
    console.log('Error on the server, deleting task failed: ', error);
  }  
})

app.put('/users', async function (req, res){
  try{
    let userAccName = req.body;
    let userExists = await loadDatafromMongo(userAccName);
    console.log("Sprawdzam czy konto istnieje", userExists);
    let accCheck = {
      alreadyCreated : false
    };
    if (!userExists){
      let user = {
        _id : userAccName,
        tasks: [],
        nextTaskId: 0,

      }
      await saveDataMongo(user);
      res.send(accCheck);
    } else {
      accCheck.alreadyCreated = true;
      console.log('Konto już jest ', userAccName);
      res.send(accCheck);
    }
  }catch(error){
    res.status(500).send();
    console.log('Error on the server, account creating failed: ', error);
  }  
});

app.get('/users/:accId', async function(req, res){
  try{
    let userAcc = req.params.accId;
    console.log('Zczytalo', userAcc)
    let userExists = await loadDatafromMongo(userAcc); 
    console.log("Konto: ", userExists )
    let accCheck = {
      isCreated : true
    };
    if (!userExists){
      accCheck.isCreated = false;
      console.log('konto nie istnieje, accCheck: ', accCheck)
      res.send(accCheck);
    } else {
      accCheck.alreadyCreated = true;
      console.log('Juz jest ', userAcc);
      res.send(accCheck);
    }
  }catch(error){
    res.status(500).send();
    console.log('Error on the server, loggin to account failed: ', error);
  }    
});




const server = app.listen(port, listening);
