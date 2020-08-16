const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    title:String,
    artiste:String,
    song:Object,
    added:{type:Date, default:Date.now}
})

module.exports = mongoose.model('track', songSchema)