const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

//middlewares

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rwnir9j.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

app.get('/', (req, res) => {
    res.send('Our server is running');
});

async function run() {
    try {
        await client.connect();

        const db = client.db('freelanceDb');
        const jobsCollection = db.collection('jobs');

        app.get('/jobs', async (req, res) => {
            const jobs = await jobsCollection.find().toArray();
            res.send(jobs)
        })

        app.post('/jobs', async (req, res) => {
            const newJob = req.body;
            const result = await jobsCollection.insertOne(newJob);
            res.send(result);
        })

        app.get('/jobs/:id', async (req, res) => {
            try {
                const id = req.params.id;

                const job = await jobsCollection.findOne({ _id: new ObjectId(id) });

                if (!job) {
                    return res.status(404).json({ message: 'Job not found' });
                }

                res.send(job);

            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Server Error' });
            }
        });


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged!!!");
    }
    finally {

    }
}

run().catch(console.dir);

app.listen(port, () => {
    console.log('Server is running on port: ', port)
})