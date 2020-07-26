const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    title:String,
    image:{type:String,default:'https://images.theconversation.com/files/258026/original/file-20190208-174861-nms2kt.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=926&fit=clip'},
    owner:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        },
        name:String,
    },
    tracks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'track'
    }],
    created_at:{type:Date, default:Date.now}
});

module.exports = mongoose.model('playlist', playlistSchema)