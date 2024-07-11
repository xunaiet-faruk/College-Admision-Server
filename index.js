const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${encodeURIComponent(process.env.DB_USER)}:${encodeURIComponent(process.env.DB_PASS)}@cluster0.ot66xwb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();

        const CollegeDetailsCollection = client.db("CollegFacilityDB").collection("collegeView");
        const CollegadmisionCollection = client.db("CollegadmisionDB").collection("collegeadmision");
        const CollegfeedbackCollection = client.db("CollegfeedbackDB").collection("collegefeedback");

        app.get('/collegeView', async (req, res) => {
            const result = await CollegeDetailsCollection.find().toArray();
            res.send(result);
        });

        app.post('/collegeadmision', async (req, res) => {
            const query = req.body;
            const result = await CollegadmisionCollection.insertOne(query);
            res.send(result);
        });

        app.get('/collegeadmision', async (req, res) => {
            const result = await CollegadmisionCollection.find().toArray();
            res.send(result);
        });

        app.post('/feedback', async (req, res) => {
            const query = req.body;
            const result = await CollegfeedbackCollection.insertOne(query);
            res.send(result);
        });

        app.get('/feedback', async (req, res) => {
            const result = await CollegfeedbackCollection.find().toArray();
            res.send(result);
        });

        app.put('/collegeadmision/:id', async (req, res) => {
            const id = req.params.id;
            const updatedData = req.body;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: updatedData,
            };
            const result = await CollegadmisionCollection.updateOne(filter, updateDoc);
            res.send(result);
        });

        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close(); // Commented out to keep the connection open
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('College is running in Own port');
});

app.listen(port, () => {
    console.log(`College server running on port ${port}`);
});
