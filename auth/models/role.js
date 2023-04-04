const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  rolename: {
    primary: true,
    type: String,
    unique: true,
  },
});

module.exports = mongoose.model('Role', roleSchema);
