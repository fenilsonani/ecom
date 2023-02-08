const router = require('express').Router()
const Product = require('../models/product')

// api section 
router.get(`/`, (req, res) => {

    const productsList = Product.find().then((products) => {
        res.status(200).json(products)
    }).catch((err) => {
        res.status(500).json({
            error: err,
            success: false
        })

    })

})


router.post(`/`, (req, res) => {
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

module.exports = router