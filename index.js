const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
var cors = require('cors')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

const app = express()
const port = process.env.PORT || 5000

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://reviewsystem-dfd5c.web.app',
        'https://reviewsystem-dfd5c.firebaseapp.com',
        'https://reviewsystem-zeta.vercel.app'
        ],
    credentials: true,
    optionsSuccessStatus: 200
}))
app.use(express.json())
app.use(cookieParser())

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

const verifyToken = (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).send({ message: 'unauthorized access' })
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'unauthorized access' })
        }

        req.user = decoded
        next()
    })
    // console.log(token)


}

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection


        const db = client.db('Review-System')
        const serviceCollections = db.collection('services')
        const reviewCollections = db.collection('all-reviews')

        // Generate Token
        app.post('/jwt', async (req, res) => {
            const email = req.body;
            const token = jwt.sign(email, process.env.SECRET_KEY, { expiresIn: '5h' })
            // console.log(token)
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
            })
                .send({ success: true })
        })

        // logout || remove cookies from browser
        app.get('/logout', async (req, res) => {
            res.clearCookie('token', {
                maxAge: 0,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
            })
                .send({ success: true })
        })

        // Post services
        app.post('/services',verifyToken, async (req, res) => {
            const service = req.body;
            const result = await serviceCollections.insertOne(service)
            res.send(result)
            // console.log(service)
        })

        // get all services
        app.get('/all-services', async (req, res) => {
            const filter = req.query.filter;
            let query = {};

            if (filter === 'Filter By Category') {
                query = {};
            }

            if (filter && filter !== 'Filter By Category') {
                query.category = filter
            }
            const result = await serviceCollections.find(query).toArray()
            res.send(result)
        })

        // get My Services by Email
        app.get('/services', verifyToken, async (req, res) => {
            const search = req.query.search
            const email = req.query.email

            const decodedEmail = req.user.email

            if (decodedEmail !== email) {
                return res.status(401).send({ message: 'unauthorized access' })
            }

            let query = {
                title: {
                    $regex: search,
                    $options: 'i',
                }
            }


            if (email) {
                query.email = email
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

        app.put('/serviceUpdate/:id', verifyToken, async (req, res) => {
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
        })

        // get All Review by email
        app.get('/all-review',verifyToken, async (req, res) => {
            const email = req.query.email

            const decodedEmail = req.user.email

            if (decodedEmail !== email) {
                return res.status(401).send({ message: 'unauthorized access' })
            }
            const filter = { email }
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
        app.delete('/service/:id', verifyToken, async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const result = await serviceCollections.deleteOne(filter)
            res.send(result)
        })

        // delete specific review
        app.delete('/review/:id', verifyToken, async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const result = await reviewCollections.deleteOne(filter)
            res.send(result)
        })

        app.patch('/reviewUpdate/:id', verifyToken, async (req, res) => {
            const id = req.params.id
            const review = req.body

            const filter = { _id: new ObjectId(id) }
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



        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('server is running')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})