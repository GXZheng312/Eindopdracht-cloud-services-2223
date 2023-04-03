const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    index: true,
    primary: true,
  },
  url: {
    type: String,
    required: true,
  },
  uploadby: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model('Image', imageSchema);
