const express = require('express');
const router = express();
const User = require('../models/User')
const {body,validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const JWT_SECRET= "dallabadmaashbada"

// ROUTE 1: Create a user using: POST "/api/auth/createuser" . Doesn't require auhentication

router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 5 }),
    body('username', 'Enter a valid username').isLength({ min: 5 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {
    // If there are no errors, create user else return Bad Request and the errors
    const errors = validationResult(req);
    if (errors.isEmpty()) {

        try {
        // Check whether the user with same email already exists already
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "User with email already exists" })
        }
        // Create a new user
        const salt = await bcrypt.genSalt();
        const secPass = await bcrypt.hash(req.body.password, salt);
        user = new User({
            ...req.body,
            password:secPass
        });
        await user.save();
        const data = {
            user : {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data,JWT_SECRET);

        return res.json({ authtoken });

        }

        catch(e) {
          console.log(e.message)
          return  res.status(500).send("Internal server error");
        }

    }

    res.status(400).json({ "errors": errors.array() });


})

// ROUTE 2: Login a user using: POST "/api/auth/login" . Doesn't require auhentication

router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {
    // If there are errors, return Bad Request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       return res.status(400).json({ "errors": errors.array() });
    }

    const {email,password} = req.body;
    try {
        let user = await User.findOne({email});
        if(!user) {
           return res.status(400).json({error: "Please try to login with correct credentials"});
        }
        const passwordCompare = await bcrypt.compare(password,user.password);
        if(!passwordCompare) {
            return res.status(400).json({error: "Please try to login with correct credentials"});
        }

        const payLoad = {
            user : {
                id: user.id
            }
        }
        const authtoken = jwt.sign(payLoad,JWT_SECRET);
        return res.json({ authtoken });

    }
    catch(e) {
        console.log(e.message)
        return  res.status(500).send("Internal server error");
    }
});

module.exports = router