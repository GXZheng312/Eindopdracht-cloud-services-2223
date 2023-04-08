const mongoose = require('mongoose');

const authtokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },
    expiredata: {
        type: Date,
        validate: {
            validator: (value) => {
                return value > Date.now(); 
            },
            message: 'Expiration date must be in the future',
        },
        required: true,
    },
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
    }
});

module.exports = mongoose.model('Authtoken', authtokenSchema);