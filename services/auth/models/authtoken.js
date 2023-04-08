const mongoose = require('mongoose');

const authtokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },
    expiredata: {
        type: Date,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    }
});

module.exports = mongoose.model('Authtoken', authtokenSchema);