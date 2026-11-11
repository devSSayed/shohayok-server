import express from 'express'
import { MongoClient } from 'mongodb';
import 'dotenv/config'
import cors from 'cors'


const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())



const client = new MongoClient(process.env.MONGODB_URI);

export async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("You successfully connected to MongoDB!");
        return client;
    } catch (err) {
        console.dir(err);
    }
}

const mongoClient = await connectToMongoDB();

const db = mongoClient.db('shohayok_users')

const upComingEvents = db.collection('upcoming_events')


app.post('/create-event', (req, res) => {
    const data = req.body

    const result = upComingEvents.insertOne(data)

    console.log(result);
    res.send(result)
})

app.get('/', (req, res) => {
    res.send({
        message: "Hello, World! " + PORT
    })
})

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})