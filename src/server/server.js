const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const storage = require('./index.js');
const saveDataMongo = storage.saveDataMongo;
const loadDatafromMongo = storage.loadDatafromMongo;


const bcrypt = require('bcrypt');
const saltRounds = 10;
const crypto = require("crypto-js");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded( {extended: false} ));
// strict:false is needed to accept raw string
app.use(bodyParser.json({strict:false}));

app.use(express.static('dist'));

const port = process.env.PORT || 3000 // default is port 3000 (locally) but if there a different environment then use port that is default for the environment (np. strona serwowana z azurowego dysku bedzie miala domyslny port uzyty w srodowisku azura) 
const key = process.env.enctyption_key

function listening(){
  console.log('server runnning');
  console.log(`runnning on localhost ${port}`);
}

async function getUserfromMongo(req){
  let credentials = JSON.parse(req.header("Authorization"));
  let userAcc = credentials.login;
  let encrypted = credentials.encrypted
  const decrypted = crypto.AES.decrypt(encrypted, key).toString(crypto.enc.Utf8)
  errorToThrow = new Error();
  if (userAcc != decrypted){
    errorToThrow.httpCode = 498;
    errorToThrow.httpMsg = "Invalid Token";
    throw  errorToThrow;
  } else {
    let user = await loadDatafromMongo(userAcc);
    if (!user) {
      errorToThrow.httpCode = 404;
      errorToThrow.httlMsg = "No such user";
      throw  errorToThrow;
    } else {
      return user
    }
  }
}

app.post('/users/tasks', async function(req, res){
  try {    
    let user = await getUserfromMongo(req);
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
    if (error.httpCode) {
      res.status(error.httpCode).send(error.httpMsg);
    } else {
      res.status(500).send();
      console.log('Error on the server, posting task failed: ', error);
    }
  }
})



app.get('/users/tasks', async function (req, res){
  try{
    let user = await getUserfromMongo(req);
    let taskArr = user.tasks
    console.log("Sending tasks", taskArr.length);
    res.send(taskArr);
  } catch(error){
    if (error.httpCode) {
      res.status(error.httpCode).send(error.httpMsg);
    } else {
      res.status(500).send();
      console.log('Error on the server, getting task list failed: ', error)
    } 
  }  
})


app.post('/users/tasks/:id', async function (req, res){
  try{
    let id = req.params.id; 
    console.log("taskID", id)
    let inputStatus = req.body.userInpStat;
    console.log("inputStatus", inputStatus);
    let user = await getUserfromMongo(req);
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
    if (error.httpCode) {
      res.status(error.httpCode).send(error.httpMsg);
    } else {
      console.log('Error on the server, changing checked failed: ', error);
      res.status(500).send();
    }
  }
})

app.delete('/users/tasks/:id', async function (req, res){
  try{
    let taskNum = req.params.id;
    let user = await getUserfromMongo(req);
    let taskArr = user.tasks
    for (let i = 0; i < taskArr.length; i++){
      if (taskNum == taskArr[i].taskId){
        taskArr.splice(i, 1);
        await saveDataMongo(user);
        res.send();
      }
    }
  }catch(error){
    if (error.httpCode) {
      res.status(error.httpCode).send(error.httpMsg);
    } else {
    res.status(500).send();
    console.log('Error on the server, deleting task failed: ', error);
    }
  }  
})

app.put('/users', async function (req, res){
  try{
    let userAccName = req.body.login;
    let password = req.body.password;
    console.log("creating account,login: ", userAccName, "pass: ", password)
    const hash = await bcrypt.hash(password, saltRounds);
    console.log("hash", hash);
    let userExists = await loadDatafromMongo(userAccName);
    console.log("Sprawdzam czy konto istnieje", userExists);
    let accCheck = {
      alreadyCreated : false
    };
    if (!userExists){
      let user = {
        _id : userAccName,
        passwordHash: hash,
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

app.get('/users', async function(req, res){
  try{
    let credentials = JSON.parse(req.header("Authorization"));
    let userAcc = credentials.login;
    let password = credentials.password;
    console.log('Zczytalo', userAcc)
    
    let accCheck = {
      isCreated : true,
    };
    let user = await loadDatafromMongo(userAcc);
    console.log("Konto: ", user)
    if (!user){
      accCheck.isCreated = false;
      console.log('konto nie istnieje, accCheck: ', accCheck)
      res.send(accCheck);
    } 

    const match = await bcrypt.compare(password, user.passwordHash)
    
    
    if (user._id === userAcc && match){
      console.log(" aes", crypto.AES);
      const encrypted = crypto.AES.encrypt(userAcc, key).toString();
      accCheck.token =  {
        login: userAcc,
        encrypted: encrypted
      };
      console.log('Juz jest ', userAcc);
      res.send(accCheck);
    } else {
      res.status(401).send("Invalid credentials");
    }
  }catch(error){
    res.status(500).send();
    console.log('Error on the server, loggin to account failed: ', error);
  }    
});




const server = app.listen(port, listening);
