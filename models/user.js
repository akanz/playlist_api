const mongoose = require('mongoose'),
      passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username:String,
    password:String,
    created_at:{type:   Date, default: Date.now}
})

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('user', userSchema);