const { findOne } = require('../models/product');
const { User } = require('../models/user');
const bcrypt = require('bcryptjs');
const router = require('express').Router();
const jwt = require('jsonwebtoken');

// api section
router.post(`/`, async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
    });
    user = await user.save().then((createdUser) => {
        res.status(201).json(createdUser);
    }
    ).catch((err) => {
        res.status(500).json({
            error: err,
            success: false
        });
    }
    );
});

router.get(`/`, async (req, res) => {
    const userList = await User.find().select('-passwordHash').then((users) => {
        res.status(200).json(users);
    }
    ).catch((err) => {
        res.status(500).json({
            error: err,
            success: false
        });
    });
});

router.get('/:id', async (req, res) => {
    const userList = await User.findById(req.params.id).select('-passwordHash').then((user) => {
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ success: false, message: "user not found!" });
        }
    }
    ).catch((err) => {
        res.status(500).json({ success: false, error: err });
    });
});

router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        res.status(400).json({ success: false, message: "user not found!" });
    }
    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin
            },
            'secret',
        )

        res.status(200).send({ user: user.email, token: token });
    } else {
        res.status(400).json({ success: false, message: "password is wrong!" });
    }
});


// request url: http://localhost:3000/api/v1/users

module.exports = router;