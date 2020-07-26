const express = require('express'),
      Playlist = require('../models/playlist'),
      Track = require('../models/track'),
      middleware = require('../middleware'),
      router = express.Router({mergeParams: true});

router.get('/new', middleware.isOwner, (req,res)=>{
    Playlist.findById(req.params.id, (err,info)=>{
        if(err){
            console.log('Unable to add songs')
        }
        else{
            res.render('newtrack', {info: info})
        }
    })
});

router.post('/', middleware.isOwner, (req,res)=>{
    Playlist.findById(req.params.id, (err, playlist)=>{
        if(err){
            console.log('Unable to add songs')
            res.redirect('/playlist/' + req.params.id)
        }
        else{
            Track.create(req.body.info, (err,newsong)=>{
                if(err){
                    console.log('Error occurred when adding a song')
                }
                else{
                    playlist.tracks.push(newsong)
                    playlist.save( ()=>{
                        if(err){
                            console.log('cannot add song')
                        }
                        else{
                            console.log('works fine')
                            res.redirect('/playlist/' + req.params.id)
                        }
                    })
                }
            })
        }
    })
});

router.delete('/:track_id', middleware.isOwner, (req,res)=>{
    Track.findByIdAndRemove(req.params.track_id, (err,done)=>{
        if(err){
            console.log('Unable to delete track')
        }
        else{
            console.log('done')
            res.redirect('/playlist/' + req.params.id)
        }
    })
})
module.exports = router;