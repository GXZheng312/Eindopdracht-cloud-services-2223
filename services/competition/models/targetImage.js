const mongoose = require('mongoose');

const targetImageSchema = new mongoose.Schema({
    imageurl: {
        type: String,
        required: true,
        primary: true
    },
    thumbsup: {
        type: Number,
        required: true
    },
    placename: {
        type: String,
        required: true
    },
    radius: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
});

module.exports = mongoose.model('TargetImage', targetImageSchema);