const mongoose = require('mongoose');

const userInputImageSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        primary: true
    },
    score: {
        type: String,
        required: true
    },
    imageurl: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('userInputImage', userInputImageSchema);