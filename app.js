const express = require('express')
const app = express()
require('dotenv/config')
const port = process.env.PORT || 5000
const bodyParser = require('body-parser')
const morgan = require('morgan')
const { default: mongoose } = require('mongoose')
const colors = require('colors');
const productRouter = require('./routers/product')
const catRouter = require('./routers/category')
const cors = require('cors')
mongoose.set('strictQuery', true)

// start of the code
app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(cors())
app.options('*', cors())

const api_url = process.env.API_URL


app.use(`${api_url}/products`, productRouter)
app.use(`${api_url}/categories`, catRouter)

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