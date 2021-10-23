const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = 5000;

//middleware
app.use(cors());
app.use(express.json());

//user: mongodb1
//password: 8dhw2jfMk87cTUif

const uri = "mongodb+srv://mongodb1:8dhw2jfMk87cTUif@cluster0.y1dxx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("FoodMaster");
        const usersCollection = database.collection("users");

        //GET API
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        });


        // POST API
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);
            console.log("got New User", req.body);
            console.log("added User", result);
            res.json(result);
        });

        //GET Single USER API
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await usersCollection.findOne(query);
            console.log('load user with id: ', id);

            res.send(user);
        });

        //DELETE API
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(query);
            console.log("deleting user with id ", result);
            res.json(result);

        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Running my CRUD server")
});

app.listen(port, () => {
    console.log("Running server on port: ", port);
})