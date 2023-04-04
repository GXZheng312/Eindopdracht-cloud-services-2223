const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    primary: true,
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 4,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
  },
});

module.exports = mongoose.model('User', userSchema);
