const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const User = new Schema({
    user_name: { type: String, unique: true, default: 'Default' },
    password: {type: String, minlength: 8, maxlength: 100},
    fullname: {type: String, minlength: 8, maxlength: 100},
    role: { type: String, default: 'Default',  enum: ['user', 'admin'] },
    
}, {
    timestamps: true,
});


module.exports = mongoose.model('User', User);