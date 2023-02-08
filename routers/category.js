const { Category } = require('../models/category');
const router = require('express').Router();

// api section
router.get(`/`, async (req, res) => {
    // res.send("Hello World")
    const categoryList = await Category.find().then((categories) => {
        res.status(200).json(categories)
    }
    ).catch((err) => {
        res.status(500).json({
            error: err,
            success: false
        })
    })
})

router.post(`/`, async (req, res) => {
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    })
    category = await category.save().then((createdCategory) => {
        res.status(201).json(createdCategory)
    }
    ).catch((err) => {
        res.status(500).json({
            error: err,
            success: false
        })
    }
    )
})

module.exports = router