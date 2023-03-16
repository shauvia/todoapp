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


app.post('/task', async function(req, res){
  try {
  // let userId = req.params.accId;
  let allTasks = await loadDatafromMongo('allTasks');
  if (!allTasks) {
    allTasks = {
      _id: 'allTasks',
      tasks: [],
      nextTaskId: 0
    }
  }
  let nextTaskId = allTasks.nextTaskId;
  const singleTask = {
    taskName: "",
    checked: false,
    taskId: -1
  }
  singleTask.taskId = nextTaskId;
  nextTaskId = nextTaskId + 1;
  allTasks.nextTaskId = nextTaskId;
  console.log("nextTaskId", nextTaskId)
  singleTask.taskName = req.body.userTask;
  allTasks.tasks.push(singleTask);
  console.log("allTasks", allTasks);
  await saveDataMongo(allTasks);
  console.log("allTasks", allTasks);
  res.send("OK");
}catch(error){
  res.status(500).send();
  console.log('Error on the server, posting task failed: ', error);
  }  
})

app.get('/tasks', async function (req, res){
  try{
    let allTasks = await loadDatafromMongo('allTasks');
    let taskArr = allTasks.tasks
    console.log("Sending tasks", taskArr.length);
    res.send(taskArr);
  } catch(error){
    console.log('Error on the server, getting task list failed: ', error)
    res.status(500).send();
  }  
})

app.post('/tasks/:id', async function (req, res){
  try{
    let id = req.params.id; 
    console.log("taskID", id)
    let inputStatus = req.body.userInpStat;
    console.log("inputStatus", inputStatus);
    let allTasks = await loadDatafromMongo('allTasks'); 
    let arrOfTasks = allTasks.tasks;
    for (let i = 0; i < arrOfTasks.length; i++){
      if (arrOfTasks[i].taskId == id) {
        arrOfTasks[i].checked = inputStatus;
        console.log("for, status", arrOfTasks[i].checked)
        await saveDataMongo(allTasks);
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

app.delete('/tasks/:id', async function (req, res){
  try{
    let taskNum = req.params.id;
    let allTasks = await loadDatafromMongo('allTasks');
    let taskArr = allTasks.tasks
    for (let i = 0; i < taskArr.length; i++){
      if (taskNum == taskArr[i].taskId){
        taskArr.splice(i, 1);
        await 
        saveDataMongo(allTasks);
        res.send();
      }
    }
  }catch(error){
    res.status(500).send();
    console.log('Error on the server, deleting task failed: ', error);
  }  
})



const server = app.listen(port, listening);
