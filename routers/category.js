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

router.get('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id).then((category) => {
        if (category) {
            res.status(200).json(category)
        } else {
            res.status(404).json({ success: false, message: "category not found!" })
        }
    }).catch((err) => {
        res.status(500).json({ success: false, error: err })
    })
})

router.put('/:id', async (req, res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color
        },
        { new: true }
    ).then((category) => {
        res.status(200).json(category)
    }).catch((err) => {
        res.status(500).json({ success: false, error: err })
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

router.delete('/:id', async (req, res) => {
    Category.findByIdAndRemove(req.params.id).then((category) => {
        if (category) {
            return res.status(200).json({ success: true, message: 'the category is deleted!' })
        } else {
            return res.status(404).json({ success: false, message: "category not found!" })
        }
    }).catch((err) => {
        return res.status(400).json({ success: false, error: err })
    })
})

module.exports = router