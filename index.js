require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// const uri = 'mongodb://localhost:27017';
const uri = 'mongodb+srv://farhan:2023@cluster0.xwkxmg5.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const database = client.db('task');
    const TaskCollection = database.collection('task');

    app.get('/tasks', async (req, res) => {
      const tasks = await TaskCollection.find({
        completed: { $ne: true },
      }).toArray();
      res.json(tasks);
    });

    app.post('/tasks', async (req, res) => {
      const task = req.body;
      const result = await TaskCollection.insertOne(task);
      res.json(result);
    });

    app.patch('/tasks/:id', async (req, res) => {});

    app.get('/completed-tasks', async (req, res) => {
      const tasks = await TaskCollection.find({
        completed: true,
      }).toArray();
      res.json(tasks);
    });

    app.patch('/completed-tasks/:id', async (req, res) => {
      const id = req.params.id;
      const result = await TaskCollection.updateOne(
        { _id: ObjectId(id) },
        { $set: { completed: true } }
      );
      res.json(result);
    });

    app.patch('/uncompleted-tasks/:id', async (req, res) => {
      const id = req.params.id;
      const result = await TaskCollection.updateOne(
        { _id: ObjectId(id) },
        { $set: { completed: false } }
      );
      res.json(result);
    });

    app.delete('/tasks/:id', async (req, res) => {
      const id = req.params.id;
      const result = await TaskCollection.deleteOne({ _id: ObjectId(id) });
      res.json(result);
    });
  } finally {
  }
}

run().catch((err) => console.log(err));

app.get('/', (_req, res) => {
  res.send('Home Page');
});

app.listen(port, () => {
  console.log('server is listening on port', port);
});
