const mongoose = require('mongoose');

const userInputImageSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true,
        validate: {
            validator: (score) => {
                return parseFloat(score) >= 0 && parseFloat(score) <= 100;
            },
            message: props => `${props.value} is not a valid score between 0 and 100!`
        }
    },
    imagename: {
        type: String,
        required: true,
        validate: [
            {
                validator: (v) => {
                    // Custom validation function to check if URL ends with a valid image file extension
                    return /\.(jpe?g|png|gif|bmp)$/i.test(v);
                },
                message: props => `${props.value} is not a valid image URL`,
            },
            // {
            //     validator: async (v) => {
            //       console.log('this:', this);
            //       const targetImage = await mongoose.model('TargetImage').findById(this.targetimage);
            //       console.log('targetImage:', targetImage);
            //       return targetImage.imagename !== v;
            //     },
            //     message: props => `'${props.value}' -> The image name cannot be the same as the target image name`,
            // }
              
        ],
    },
    targetimage: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'TargetImage',
        validate: {
            validator: async (v) => {
                try {
                    const targetImage = await mongoose.model('TargetImage').findById(v);
                    return targetImage !== null;
                } catch (err) {
                    return false;
                }
            },
            message: props => `Invalid TargetImage ID: ${props.value}`
        }
    }
}, { self: true });

module.exports = mongoose.model('userInputImage', userInputImageSchema);