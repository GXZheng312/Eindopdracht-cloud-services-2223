const mongoose = require('mongoose');

const targetImageSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    index: true,
    primary: true,
  },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Image",
    required: true,
  },
  thumbsup: {
    type: Number,
    default: 0,
    required: true,
  },
  placename: {
    type: String,
    required: true,
  },
  radius: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  }
});

module.exports = mongoose.model('TargetImage', targetImageSchema);
