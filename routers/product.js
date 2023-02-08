const router = require('express').Router()
const { Category } = require('../models/category')
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

router.get(`/search`, (req, res) => {
    const productList = Product.find().select('name image -_id').then((products) => {
        res.status(200).json(products)
    }).catch((err) => {
        res.status(500).json({
            error: err,
            success: false
        })
    })
})


router.post(`/`, async (req, res) => {

    const category = await Category.findById(req.body.category)
    if (!category) return res.status(400).send('Invalid Category')

    const product = new Product({
        name: req.body.name,
        image: req.body.image,
        description: req.body.description,
        richDescription: req.body.richDescription,
        images: req.body.images,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    })

    product.save().then((createdProduct) => {
        res.status(201).json(createdProduct)
    }
    ).catch((err) => {
        res.status(500).json({
            error: err,
            success: false
        })
    }
    )

})

router.get('/id/:id', (req, res) => {
    const product = Product.findById(req.params.id).then((product) => {
        if (product) {
            res.status(200).json(product)
        } else {
            res.status(404).json({ success: false, message: "product not found!" })
        }
    }).catch((err) => {
        res.status(500).json({ success: false, error: err })
    })
})

router.get('/name/:name', (req, res) => {

    const product = Product.findOne({ name: req.params.name }).then((product) => {
        if (product) {
            res.status(200).json(product)
        } else {
            res.status(404).json({ success: false, message: "product not found!" })
        }
    }).catch((err) => {
        res.status(500).json({ success: false, error: err })
    })
})



module.exports = router