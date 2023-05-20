const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();


const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



// -------------------------------------------------

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s1vjhzt.mongodb.net/?retryWrites=true&w=majority`;

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
         client.connect();


        const toyCollection = client.db('toyTeddy').collection('teddys');

        // POST
        app.post('/teddys', async (req, res) => {
            const newTeddy = req.body;
            console.log(newTeddy);
            const result = await toyCollection.insertOne(newTeddy);
            res.send(result);
        })
        // READ
        app.get('/teddys', async(req, res) => {
            const result = await toyCollection.find({}).limit(20).toArray();
            res.send(result);
        })
        // READ2
        app.get('/viewDetailsTeddy/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await toyCollection.findOne(query);
            res.send(result);
        })

        app.get('/teddy', async(req, res) => {
            let query = {};
            if(req.query?.email){
               query = {email:req.query.email}
               console.log(query)
            }
            const result = await toyCollection.find(query).toArray();
            res.send(result);

        })
        
        // UPDATE
        app.get('/teddys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await toyCollection.findOne(query);
            res.send(result);
        })

        // UPDATE
        app.put('/teddys/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateTeddy = req.body;
            const teddy = {
                $set:{
                    quantity: updateTeddy.quantity,
                    price : updateTeddy.price ,
                    description: updateTeddy.description,
                }
            }
            const result = await toyCollection.updateOne(filter, teddy, options);
            res.send(result)
        })

         // DELETE
         app.delete('/teddys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await toyCollection.deleteOne(query);
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


// -------------------------------------------------

// routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Kindle Teddy Running on PORT : ${port}`);
});
