const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const express = require("express");
const router = express.Router();

router.post("/auth/login", async (req, res) => {
    // #swagger.tags = ['auth']
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send({error: error.details[0].message});

        const user = await User.findOne({ nickname: req.body.nickname })
        .then(async user => {
            // todo
            if (!user) return res.status(400).send({error: "invalid username or password"});
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) return res.status(400).send({error: "invalid username or password"});
            const token = user.generateAuthToken();
            res.send({"token": token});
        })
        .catch(err => {
            return res.status(400).send({error: "invalid username or password"});
        }); 
    } catch (error) {
        res.send({error: "Bad request"});
    }
});

const validate = (user) => {
    const schema = Joi.object({
        nickname: Joi.string().required(),
        password: Joi.string().required(),
    });
    return schema.validate(user);
};

module.exports = router;