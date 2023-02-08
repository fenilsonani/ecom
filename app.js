const express = require('express')
const app = express()
require('dotenv/config')
const port = process.env.PORT || 5000
const bodyParser = require('body-parser')
const morgan = require('morgan')
const { default: mongoose } = require('mongoose')
const colors = require('colors');


// start of the code
mongoose.set('strictQuery', true)
app.use(bodyParser.json())
app.use(morgan('tiny'))
const api_url = process.env.API_URL

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        // unique: true
    },
    image: String,
    countInStock: Number,
})

const Product = mongoose.model('Product', productSchema)

// api section 
app.get(`${api_url}/products`, (req, res) => {

    const productsList = Product.find().then((products) => {
        res.status(200).json(products)
    }).catch((err) => {
        res.status(500).json({
            error: err,
            success: false
        })

    })

})


app.post(`${api_url}/products`, (req, res) => {
    const product = new Product({
        name: req.body.name,
        image: req.body.image,
        countInStock: req.body.countInStock
    })

    product.save().then((createdProduct) => {
        res.status(201).json(createdProduct)
    }).catch((err) => {
        res.status(500).json({
            error: err,
            success: false
        })

        // res.send(product)
    })
})

// database connection
mongoose.connect("mongodb+srv://fenil:kb3ndTiaM9JJImmX@cluster0.tleykye.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'eshop-database'
})
    .then(() => {
        console.log('Database connection is ready...'.green)
    })
    .catch((err) => {
        console.log(err)
    })





// server start
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
    console.log(`API URL: ${api_url}`)
})