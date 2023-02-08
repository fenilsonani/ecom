const router = require('express').Router()
const e = require('express');
const { Category } = require('../models/category')
const Product = require('../models/product')

// api section 
router.get(`/`, async (req, res) => {

    let filter = {};
    if (req.query.categories) {
        filter = { category: req.query.categories.split(',') }
        const productList = await Product.find(filter).populate('category');

        if (!productList) {
            res.status(500).json({ success: false })
        }
        res.send(productList);
    }
    if (req.query.price) {
        // code that will filter the products based on price

        filter = {
            price: {
                $gte: req.query.price[0],
                $lte: req.query.price[1]
            }
        }

        const productList = await Product.find(filter).populate('category');
        if (!productList) {
            res.status(500).json({ success: false })
        }
        res.send(productList);

        // what will be the url for this?
        // http://localhost:3000/api/v1/products?price[0]=10&price[1]=20
    } else {
        const productList = await Product.find().populate('category');

        if (!productList) {
            res.status(500).json({ success: false })
        }
        res.send(productList);
    }

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

router.put('/id/:id', async (req, res) => {

    const category = await Category.findById(req.body.category)
    if (!category) return res.status(400).send('Invalid Category')


    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
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
        },
        { new: true }
    ).then((product) => {
        if (product) {
            res.status(200).json(product)
        } else {
            res.status(404).json({ success: false, message: "product not found!" })
        }
    }).catch((err) => {
        res.status(500).json({ success: false, error: err })
    })
})


router.get('/id/:id', (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid Product Id')
    }
    const product = Product.findById(req.params.id).populate('category').then((product) => {
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

router.delete('/id/:id', (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid Product Id')
    }
    Product.findByIdAndRemove(req.params.id).then((product) => {
        if (product) {
            return res.status(200).json({ success: true, message: "the product is deleted!" })
        } else {
            return res.status(404).json({ success: false, message: "product not found!" })
        }
    }).catch((err) => {
        return res.status(400).json({ success: false, error: err })
    })
})

router.get('/get/fetured/:count', async (req, res) => {
    const productCount = await Product.find({ isFeatured: true }).limit(+req.params.count)
    if (!productCount) {
        res.status(500).json({ success: false })
    }
    res.send({
        productCount,
        success: true,
        count: productCount.length
    })
    console.log(productCount);
})


module.exports = router