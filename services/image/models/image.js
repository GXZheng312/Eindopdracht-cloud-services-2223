const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    imagename: {
        unique: true,
        type: String,
        required: true,
        validate: {
            validator: (v) => {
                // Custom validation function to check if URL ends with a valid image file extension
                return /\.(jpe?g|png|gif|bmp)$/i.test(v);
            },
            message: props => `${props.value} is not a valid image URL`,
        },
    },
    uploadby: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Image', imageSchema);
