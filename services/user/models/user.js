const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 4
    },
    password: {
        type: String,
        required: true,
        minlength: 4
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Roles'
    }
});

module.exports = mongoose.model('Users', userSchema);