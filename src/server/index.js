const util = require('util');


const dotenv = require('dotenv');
dotenv.config();



//poszukać co zrobić jak sie baza danych wykrzaczy. Gdzie wsadzić // await client.close(); ?????


const { MongoClient } = require("mongodb");
// Replace the uri string with your connection string.
const uri = process.env.DB_URI;
console.log("URI: ", uri);

// async function connectToCluster(uri) {
//   let mongoClient;

//   try {
//       mongoClient = new MongoClient(uri);
//       console.log('Connecting to MongoDB Atlas cluster...');
//       await mongoClient.connect();
//       console.log('Successfully connected to MongoDB Atlas!');

//       return mongoClient;
//   } catch (error) {
//       console.error('Connection to MongoDB Atlas failed!', error);
//       process.exit();
//   }
// }

const client = new MongoClient(uri);

// async function run() {
//   try {
//     const database = client.db('users');
//     const movies = database.collection('taskList');
//     // Query for a movie that has the title 'Back to the Future'

//     const query = { _id: '63f7faee662eecb1f803f543' };
//     const movie = await movies.findOne(query);
//     console.log("Movie"<, movie);
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

async function saveDataMongo(data) {
  // const client = new MongoClient(uri);
  console.log("index.js: I'm in")
  try {
    const database = client.db('users');
    const taskList = database.collection('taskList');

    // console.log(`Saving: ${(util.inspect(data, {depth: null}))}`);

    const id = data._id; 
    console.log('id', id)
    const filter = {_id : id};

    // console.log(`Deleting`);
    await taskList.deleteOne(filter);
    // console.log(`Inserting`);

    const result = await taskList.insertOne(data);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
    // await client.close();
  }
}

async function loadDatafromMongo(userId) {
  // const client = new MongoClient(uri);
  try {
    const database = client.db('users');
    const taskList = database.collection('taskList');
   
    const query = {_id : 'allTasks'};
    const allRecords = await taskList.findOne(query);
    // console.log(`Records has been read with _id: ${allRecords._id}`);
    return allRecords;

    
  } finally {
    // await client.close();
  }
}

let storage = {
  saveDataMongo: saveDataMongo,
  loadDatafromMongo: loadDatafromMongo,
};

module.exports = storage;