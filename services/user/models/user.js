const mongoose = require('mongoose');
const roleSchema = require('./role');
const Joi = require('joi');

const addressSchema = Joi.object({
    street: Joi.string().min(2),
    city: Joi.string().min(2),
    zip: Joi.string().regex(/^[1-9][0-9]{3} ?[a-zA-Z]{2}$/),
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (value) => {
                return value.length >= 4;
            },
            message: 'Username must be at least 4 characters long',
        },
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: (value) => {
                return value.length >= 4;
            },
            message: 'password must be at least 4 characters long',
        }
    },
    address: {
        type: addressSchema,
        validate: {
            validator: (value) => {
                const result = addressSchema.validate(value);
                return !result.error;
            },
            message: 'Address is invalid',
        },
        street: {
            type: String,
        },
        city: {
            type: String,
        },
        zip: {
            type: String,
        },
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Roles',
        validate: {
            validator: async function(value) {
                const role = await roleSchema.findById(value);
                return role !== null;
            },
            message: 'Role does not exist',
        },
    }
});

module.exports = mongoose.model('Users', userSchema);