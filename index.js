import express from 'express'
import { MongoClient } from 'mongodb';
const app = express()
const PORT = process.env.PORT || 5000





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



app.get('/', (req, res) => {
    res.send({
        message: "Hello, World! " + PORT
    })
})

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})