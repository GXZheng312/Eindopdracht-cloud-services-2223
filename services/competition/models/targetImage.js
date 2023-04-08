const mongoose = require('mongoose');

const targetImageSchema = new mongoose.Schema({
    imagename: {
        type: String,
        required: true,
        primary: true,
        validate: {
            validator: (v) => {
                // Custom validation function to check if URL ends with a valid image file extension
                return /\.(jpe?g|png|gif|bmp)$/i.test(v);
            },
            message: props => `${props.value} is not a valid image URL`,
        },
    },
    thumbsup: {
        type: Number,
        required: true,
        default: 0
    },
    placename: {
        type: String,
        required: true,
        validate: {
            validator: (v) => {
                // Custom validation function to check if placename is at least 3 characters long
                return v.length >= 3;
            },
            message: props => `${props.value} must be at least 3 characters long`,
        },
    },
    radius: {
        type: String,
        required: true,
        validate: {
            validator: (v) => {
                // Custom validation function to check if radius is not an negative number
                return v >= 0;
            },
            message: props => `${props.value} is not a valid non-negative radius!`
        }
    },
    description: {
        type: String,
        validate: {
            validator: (v) => {
                // Custom validation function to check if description is at most 1000 characters long
                return v.length <= 1000;
            },
            message: props => `${props.value} is longer than 1000 characters!`
        }
    }
});

module.exports = mongoose.model('TargetImage', targetImageSchema);