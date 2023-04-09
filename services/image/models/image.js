const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  imagename: {
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

imageSchema.query.byPage = function (pageIndex, pageSize) {
    pageIndex = pageIndex || 0;
    pageSize = pageSize || 10;
    return this.find().skip(pageIndex * pageSize).limit(pageSize);
};

imageSchema.query.byImageName = function (imageName) {
    if (imageName) {
        return this.find({ imagename: imageName });
    } else {
        return this.find();
    }
};

imageSchema.query.byUpload = function (uploadBy) {
    if (uploadBy) {
        return this.find({ uploadby: uploadBy });
    } else {
        return this.find();
    }
};
module.exports = mongoose.model('Image', imageSchema);
