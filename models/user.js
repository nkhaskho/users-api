
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken");
const countries = require('./countries')
const Joi = require("joi");


const userSchema = mongoose.Schema({

	nickname: {
        type: String,
        unique: true,
        required: [true, 'nickname_required']
    },

    email: {
        type: String,
        unique: true,
        required: [true, 'email_required']
    },
    
    password: {
        type: String,
        required: [true, 'password_required']
    },

    phone: {
        type: Number,
        required: [true, 'phone_required']
    },

    country: {
        type: String,
        enum: countries.countryList
    },

})

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({
            _id: this._id,
            nikname: this.nickname,
            email: this.email 
        }, 
        process.env.JWT_PRIVATE_KEY
    );
    return token;
};

const User = mongoose.model("User", userSchema);

const validate = (user) => {
    const schema = Joi.object({
        nickname: Joi.string().required(),
        password: Joi.string().required(), // .allow('')
        email: Joi.string().email().required(),
        country: Joi.string().required(),
        phone: Joi.number().required()
    });
    return schema.validate(user);
};

module.exports = { User, validate };