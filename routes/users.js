const { User, validate } = require("../models/user");
const express = require("express");
const bcrypt = require("bcrypt");
//const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();


// Get all users
router.get("/users", async (req, res) => {
    // #swagger.tags = ['users']
    // #swagger.description = 'Retrieve all users.'
	const users = await User.find();
	res.send(users);
})

function getUserErrorsDetails(errors) {
    errorsObj = {}
    errors.forEach(err => {
        errorsObj[err.path[0]] = err.message
    })
    return errorsObj;
}

// Add new user
router.post("/users", async (req, res) => {
    // #swagger.tags = ['users']
    // #swagger.description = 'Add new user.'
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send({error: error.details[0].message}); //[0].message
        User.find({nickname: req.body.nickname}, async (err, users) => {
            if (err) res.status(500).send({error: err})
            if (users.length>0) res.status(400).send({error: "nickname already exist"})
        })
        User.find({email: req.body.email}, async (err, users) => {
            if (err) res.status(500).send({error: err})
            if (users.length>0) res.status(400).send({error: "email already exist"})
            const user = new User(req.body);
            const salt = await bcrypt.genSalt(Number(process.env.SALT));
            user.password = await bcrypt.hash(user.password, salt);
            await user.save();
            res.send(user);
        })
    } catch (error) {
        res.status(400).send({error: "invalid request body"});
    }
})


// Get user by id
router.get("/users/:id", async (req, res) => {
	// #swagger.tags = ['users']
    // #swagger.description = 'Get user by id.'
    await User.findById(req.params.id, (err, user) => {
        if (err) {
            res.status(404).send({error: "user not found"})
        } else {
            res.send(user);
        }
    });
})


// Update existing user
router.put("/users/:id", async (req, res) => {
    // #swagger.tags = ['users']
    // #swagger.description = 'Update user by id.'
    if (req.body.password) delete req.body.password;
    if (req.body.nickname) delete req.body.nickname;
    if (req.body.email) delete req.body.email;
    await User.findByIdAndUpdate(req.params.id, req.body, (err, user) => {
        if (err) res.status(404).send({error: "user not found"});
        //user.password = "";
        res.send(user);
    });
})


// Delete existing user
router.delete("/users/:id", async (req, res) => {
    // #swagger.tags = ['users']
    // #swagger.description = 'Delete user by id.'
    User.findByIdAndDelete({ _id: req.params.id }, (err, user) => {
        if (err) {
            res.status(404).send({error: "user not found"})
        } else {
            res.status(202).send("User deleted.")
        }
    });
})


module.exports = router