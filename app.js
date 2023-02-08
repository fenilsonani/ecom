const express = require('express')
const app = express()
require('dotenv/config')
const port = process.env.PORT || 5000
const bodyParser = require('body-parser')
const morgan = require('morgan')
const { default: mongoose } = require('mongoose')

mongoose.set('strictQuery', true)

app.use(bodyParser.json())
app.use(morgan('tiny'))
const colors = require('colors');

const api_url = process.env.API_URL

console.log(process.env.API_URL);

app.get(`${api_url}/products`, (req, res) => {

    const products = [
        {
            id: 1,
            name: 'Product 1'
        },
        {
            id: 2,
            name: 'Product 2'
        },
        {
            id: 3,
            name: 'Product 3'
        }
    ]

    res.send(products)

})


app.post(`${api_url}/products`, (req, res) => {
    const myProduct = req.body
    console.log(myProduct)
    res.send(myProduct)
})

// mongoose code that will connect to the database with local mongodb

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

// what will be CONECTION_STRING
// mongodb://localhost:27017/eshop-database


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
    console.log(`API URL: ${api_url}`)
})