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


app.post('/tasks', async function(req, res){
  try{
    const singleTask = {
      taskName: ""
    }
    singleTask.taskName = req.body.userTask;
    taskArr.push(singleTask);
    console.log("taskArr", taskArr);
  }catch(error){
    res.status(500).send();
    console.log('Error on the server, posting task failed: ', error);
  }  
})

const server = app.listen(port, listening);
