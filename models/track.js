const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    title:String,
    artiste:String,
    image:{type:String, default:''},
    added:{type:Date, default:Date.now}
})

module.exports = mongoose.model('track', songSchema)