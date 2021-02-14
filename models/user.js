var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const passportlocalmongoose = require('passport-local-mongoose');

var User = new Schema({
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    admin: {
        type: Boolean,
        default: false
    }
});

User.plugin(passportlocalmongoose); //support username and password (encrypted) to user schema

module.exports = mongoose.model('User', User);