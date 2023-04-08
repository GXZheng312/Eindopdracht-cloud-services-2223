const mongoose = require('mongoose');

const userInputImageSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    score: {
        type: String,
        required: true
    },
    imagename: {
        type: String,
        required: true
    },
    targetimage: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'TargetImage',
    }
});

module.exports = mongoose.model('userInputImage', userInputImageSchema);