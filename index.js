const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
var cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// zG2zYX8WWfnzjvcC
// reviewSystem


const uri = `mongodb+srv://${process.env.REVIEW_USER}:${process.env.REVIEW_PASS}@cluster0.xdjfp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // await client.connect();
        // Send a ping to confirm a successful connection


        const db = client.db('Review-System')
        const serviceCollections = db.collection('services')
        const reviewCollections = db.collection('all-reviews')
        // Post services
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollections.insertOne(service)
            res.send(result)
            // console.log(service)
        })

        // get All Services
        app.get('/services', async (req, res) => {

            const email = req.query.email
            let query;
            if (email) {
                query = { email }
            }

            const result = await serviceCollections.find(query).toArray()
            res.send(result)
        })

        // get Limited Services
        app.get('/limitedServices', async (req, res) => {
            const result = await serviceCollections.find().limit(6).toArray()
            res.send(result)
            // console.log(service)
        })


        // get specific service
        app.get('/details/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const result = await serviceCollections.findOne(filter)
            res.send(result)
            console.log(id)
        })

        app.put('/serviceUpdate/:id', async (req, res) => {
            const id = req.params.id;
            const newService = req.body;
            const filter = { _id: new ObjectId(id) }
            const updateDoc = {
                $set: {
                    photo: newService.photo,
                    title: newService.title,
                    company: newService.company,
                    website: newService.website,
                    category: newService.category,
                    price: newService.price,
                    deadline: newService.deadline,
                    email: newService.email,
                    description: newService.description
                }
            }
            const result = await serviceCollections.updateOne(filter, updateDoc)
            res.send(result)
            // console.log(newService)
        })


        // post review
        app.post('/addReview', async (req, res) => {
            const review = req.body;
            const result = await reviewCollections.insertOne(review)
            res.send(result)
            console.log(review)
        })

        // get All Review
        app.get('/all-review', async (req, res) => {
            const email = req.query.email
            const filter = {email}
            const result = await reviewCollections.find(filter).toArray()
            res.send(result)
            // console.log(query)
        })

        // get reviews by id
        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id
            const filter = { service_id: id }
            const result = await reviewCollections.find(filter).toArray()
            res.send(result)
        })

        // delete service by id
        app.delete('/service/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const result = await serviceCollections.deleteOne(filter)
            res.send(result)
        })

        // delete specific review
        app.delete('/review/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const result = await reviewCollections.deleteOne(filter)
            res.send(result)
        })

        app.patch('/reviewUpdate/:id', async (req, res) => {
            const id = req.params.id
            const review = req.body

            const filter = {_id: new ObjectId(id)}
            const updateDoc = {
                $set: {
                    description: review.description,
                    reviewRating: review.reviewRating
                }
            }
            const result = await reviewCollections.updateOne(filter, updateDoc)
            res.send(result)

            console.log(id)
            console.log(review)
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})