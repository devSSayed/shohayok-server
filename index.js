import express from 'express'
import { MongoClient, ObjectId } from 'mongodb';
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

const joinedEvents = db.collection('joined-events')


app.post('/create-event', async (req, res) => {
    const data = req.body

    const result = await upComingEvents.insertOne(data)

    console.log(result);
    res.send(result)
})

app.get('/allEvents', async (req, res) => {
    const result = await upComingEvents.find().toArray()
    res.send(result)
})

app.get('/event/:id', async (req, res) => {
    const { id } = req.params

    const result = await upComingEvents.findOne({ _id: new ObjectId(id) })

    res.send(result)
})

app.get('/myEvents/:email', async (req, res) => {
    const { email } = req.params

    const result = await upComingEvents.find({ 'createdBy.email': email }).toArray()

    res.send(result)
})

app.patch('/event/:id', async (req, res) => {
    const { id } = req.params
    const updatedData = req.body

    const result = await upComingEvents.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
    )

    res.send(result)
})

app.delete('/event/:id', async (req, res) => {
    const { id } = req.params

    const result = await upComingEvents.deleteOne({ _id: new ObjectId(id) })

    res.send(result)

})

app.get('/recentEvents', async (req, res) => {

    const today = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Dhaka'
    }).format(new Date());

    const result = await upComingEvents.find({ date: { $gte: today } }).sort({ date: 1 }).limit(6).toArray()
    res.send(result)
})


app.post('/join-event', async (req, res) => {
    const data = req.body

    const result = await joinedEvents.insertOne(data)

    console.log(result);
    res.send(result)
})

app.get('/join-event/:email', async (req, res) => {
    const { email } = req.params

    const result = await joinedEvents.find({ 'joinedBy.email': email }).toArray()

    res.send(result)
})

app.delete('/join-event/:id', async (req, res) => {
    const { id } = req.params

    const result = await joinedEvents.deleteOne({ _id: new ObjectId(id) })
    if (result.deletedCount === 0) {
        return res.status(404).send({ message: 'Join record not found' })
    }

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