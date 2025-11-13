const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

const admin = require("firebase-admin");

// index.js
const decoded = Buffer.from(process.env.FIRE_SERVICE_KEY, "base64").toString("utf8");
const serviceAccount = JSON.parse(decoded);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

//middlewares

app.use(cors());
app.use(express.json());

const verifyFirebaseToken = async (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).send({ message: 'Unauthorized access' });
    };
    const token = authorization.split(' ')[1];
    try {
        const decoded = await admin.auth().verifyIdToken(token);
        console.log('token', decoded);
        req.token_email = decoded.email;
        next();
    } catch (error) {
        return res.status(401).send({ message: 'Unauthorized access' });
    }
}


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
        const addedJobsCollection = db.collection('addedJobs');

        app.get('/jobs', async (req, res) => {
            const jobs = await jobsCollection.find().toArray();
            res.send(jobs)
        });

        app.post('/jobs', verifyFirebaseToken, async (req, res) => {
            const newJob = req.body;
            const result = await jobsCollection.insertOne(newJob);
            res.send(result);
        });

        app.get('/my-jobs', verifyFirebaseToken, async (req, res) => {

            try {
                const email = req.query.email;
                const query = {}
                if (email) {
                    query.userEmail = email;
                    if (email !== req.token_email) {
                        return res.status(403).send({ message: 'Forbidden access' });
                    }
                }

                const cursor = jobsCollection.find(query);
                const result = await cursor.toArray();
                res.send(result);
            } catch (err) {
                res.status(500).send({ message: "Server Error" });
            }
        });

        app.get('/jobs/:id', verifyFirebaseToken, async (req, res) => {
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

        app.patch('/jobs/:id', verifyFirebaseToken, async (req, res) => {
            const id = req.params.id;
            const updatedJob = req.body;
            const query = { _id: new ObjectId(id) }
            const update = {
                $set: {
                    title: updatedJob.title,
                    category: updatedJob.category,
                    summary: updatedJob.summary,
                    coverImage: updatedJob.coverImage,
                }
            };

            const result = await jobsCollection.updateOne(query, update);
            res.send(result);
        });

        app.delete('/jobs/:id', verifyFirebaseToken, async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await jobsCollection.deleteOne(query);
            res.send(result);
        });


        app.post('/accepted-jobs', verifyFirebaseToken, async (req, res) => {
            const newJob = req.body;
            const result = await addedJobsCollection.insertOne(newJob);
            res.send(result);
        });

        app.get('/my-accepted-jobs', verifyFirebaseToken, async (req, res) => {

            try {
                const email = req.query.email;
                const query = {}
                if (email) {
                    query.email = email;
                    if (email !== req.token_email) {
                        return res.status(403).send({ message: 'Forbidden access' });
                    }
                }

                const cursor = addedJobsCollection.find(query);
                const result = await cursor.toArray();
                res.send(result);
            } catch (err) {
                res.status(500).send({ message: "Server Error" });
            }
        });

        app.delete('/accepted-jobs/:id', verifyFirebaseToken, async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await addedJobsCollection.deleteOne(query);
            res.send(result);
        });


        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged!!!");
    }
    finally {

    }
}

run().catch(console.dir);

app.listen(port, () => {
    console.log('Server is running on port: ', port)
})