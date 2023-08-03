const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;


// middleware
const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
  }
  app.use(cors(corsOptions))
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3rhi256.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    const taskCollection = client.db('task-manager').collection('tasks');

    // Post Added Task
    app.post('/allTasks', async (req, res) => {
      const body = req.body;
      body.createdAt = new Date();
      if(!body){
        return res.status(404).send({message: "Data not found, Not Valid Request."})
      }
      const result = await taskCollection.insertOne(body);
      res.send(result)
    })

    // Get all Task
    app.get('/allTasks', async(req, res) => {
        const cursor = taskCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    // Delete Task
    app.delete('/allTasks/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await taskCollection.deleteOne(query);
        res.send(result);
      })

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Task is Running")
});

app.listen(port, () => {
    console.log(`Task is running on ${port}`);
})