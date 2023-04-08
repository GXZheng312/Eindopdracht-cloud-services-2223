const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    url: {
        unique: true,
        type: String,
        required: true
    },
    uploadby: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Image', imageSchema);
