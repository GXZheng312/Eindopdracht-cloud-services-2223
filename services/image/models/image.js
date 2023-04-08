const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    imagename: {
        type: String,
        required: true
    },
    uploadby: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Image', imageSchema);
