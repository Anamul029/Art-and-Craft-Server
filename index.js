const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


// midleWare
app.use(cors())
app.use(express.json());


console.log(process.env.user)
// database start

const uri = `mongodb+srv://${process.env.user}:${process.env.password}@cluster0.yl5czei.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // Connect the client to the server	(optional starting in v4.7)
        const craftCollection = client.db('craftDB').collection('craft');
        await client.connect();

        app.post('/craftItems', async (req, res) => {
            const newCraft = req.body;
            console.log(newCraft)
            const result = await craftCollection.insertOne(newCraft)
            res.send(result)

        })
        // print all data from database to client
        app.get('/craftItems', async (req, res) => {
            const cursor = craftCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        // get data from database to update data
        app.get('/craftItems/:_id', async (req, res) => {
            const id = req.params._id;
            const query = { _id: new ObjectId(id) };
            const result = await craftCollection.findOne(query);
            res.send(result);
        })



        // delete data from database
        app.delete('/craftItems/:_id', async (req, res) => {
            const id = req.params._id;
            console.log(id)
            const query = { _id: new ObjectId(id) }
            const result = await craftCollection.deleteOne(query)
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

// database end

app.get('/', (req, res) => {
    res.send('Art and craft server is running');
})

app.listen(port, () => {
    console.log(`art and Craft server is running in port:${port}`)
})