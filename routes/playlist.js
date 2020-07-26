const express = require('express'),
      User = require('../models/user'),
      Playlist = require('../models/playlist'),
      middleware = require('../middleware'),
      router = express.Router();


router.get('/', (req,res)=> {
    Playlist.find({},null,{sort:'-created_at'}, (err,all)=>{
        if(err){
            console.log('Unable to get all playlist')
        }
        else{
            res.render('home', {playlist:   all})
        }
    })
    
});

router.get('/new',  middleware.isLoggedin, (req,res)=> {
    res.render('newplaylist')
});

router.post('/', middleware.isLoggedin, (req,res)=> {
    const owner = {
            id:req.user._id,
            name:req.user.username
        }
       const newplaylist = {
            title:  req.body.title,
            image:  req.body.image,
            owner: owner
        }
    Playlist.create(newplaylist, (err,latest)=>{
            if(err){
                console.log('Unable to create playlist');
                res.render('newplaylist')
            }
            else{
                res.redirect('/playlist');
                console.log('Playlist created')
            }
        })
});

router.get('/:id',  (req,res)=> {
    Playlist.findById(req.params.id).populate('tracks').exec((err,info)=>{
        if(err){
            console.log(err)
            console.log('Unable to get Playlist')
            
        }
        else{
            res.render('tracks', {playlist: info} )
        }
    })
   
});

router.get('/:id/edit', middleware.isOwner,  (req,res)=> {
    Playlist.findById(req.params.id,(err, info)=>{
        if(err){
            console.log('Unable to retrieve playlist')
        }
        else{
            res.render('editplaylist', {playlist:   info});
        }
    })
   
});

router.put('/:id', middleware.isOwner,  (req,res)=> {
    Playlist.findByIdAndUpdate(req.params.id, req.body.form, (err,info)=>{
        if(err){
            console.log('Unable to Edit playist')
            res.render('/playlist/' + info._id)
        }
        else{
            res.redirect('/playlist')
        }
    })
   
});

router.delete('/:id', middleware.isOwner,   (req,res)=> {
    Playlist.findByIdAndDelete(req.params.id, (err, info)=>{
        if(err){
            console.log('Unable to delete playlist')
            res.redirect('/playlist' + req.params.id)
        }
        else{
            res.redirect('/playlist')
        }
    })
});



module.exports = router;