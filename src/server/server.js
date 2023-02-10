const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

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

let taskArr = [];
let taskNum = 0;


app.post('/task', async function(req, res){
  try{
    const singleTask = {
      taskName: "",
      checked: false,
      taskId: -1
    }
    singleTask.taskName = req.body.userTask;
    singleTask.taskId = taskNum;
    taskNum = taskNum + 1;
    taskArr.push(singleTask);
    console.log("taskArr", taskArr);
    res.send("OK");
  }catch(error){
    res.status(500).send();
    console.log('Error on the server, posting task failed: ', error);
  }  
})

app.get('/tasks', async function (req, res){
  try{
    console.log("Sending tasks", taskArr.length);
    res.send(taskArr);
  } catch(error){
    console.log('Error on the server, getting trip list failed: ', error)
    res.status(500).send();
  }  
})

app.post('/tasks/:id', async function (req, res){
  try{
    let id = req.params.id; 
    console.log("taskID", id)
    let inputStatus = req.body.userInpStat;
    console.log("inputStatus", inputStatus);
    // let oneTrip = await loadOneTrip(userId, tripID);
    // console.log("Loading one trip: ", oneTrip)
    let arrOfTasks = taskArr;
    for (let i = 0; i < arrOfTasks.length; i++){
      if (arrOfTasks[i].taskId == id) {
        arrOfTasks[i].checked = inputStatus;
        console.log("for, status", arrOfTasks[i].checked)
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



const server = app.listen(port, listening);
