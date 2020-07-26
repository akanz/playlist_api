const express = require('express'),
      passport = require('passport'),
      User = require('../../models/user'),
      Playlist = require('../../models/playlist'),
      Track = require('../../models/track'),
      middleware = require('../../middleware/auth'),
      router = express.Router();



// authentication route

router.get('/signup', (req,res)=>{
    res.send('GET API Sign up route')
});
router.post('/signup', (req,res)=>{
        var newuser = req.body.username,
            password = req.body.password,
            confirm = req.body.confirm;

        if (password !== confirm){
            console.log('Password do not match');
            res.render('register')
        }
        else{
            User.register(new User({ username:newuser}), password, (err,user)=>{
                if(err){
                    return res.json(err)
                }
                else{
                    passport.authenticate('local')(req,res,()=>{
                        res.json(user)
                    })
                }
            })
        }
        
});

// login routes
router.get('/login', (req,res)=> {
    res.send('GET API login route')
})

router.post('/login', passport.authenticate('local',{
    successRedirect: 'api/playlist',
    failureRedirect: 'api/login',
}), (req, res)=> {  
})
     
router.get('/logout', (req,res)=> {
    req.logout();
    res.redirect('/')
})



// playlist route

router.get('/playlist', (req,res)=> {
    Playlist.find({},null,{sort:'-created_at'}, (err,all)=>{
        if(err){
            res.json('Unable to get playlist')
        }
        else{
            res.json(all)
        }
    })
    
});

router.get('/playlist/new', (req,res)=> {
    res.send('GET API new playlist')
});

router.post('/playlist', middleware.isLoggedin, (req,res)=> {
    // const owner = {
    //         id:req.user._id,
    //         name:req.user.username
    //     }
       const newplaylist = {
            title:  req.body.title,
            image:  req.body.image,
            // owner: owner
        }
    Playlist.create(newplaylist, (err,latest)=>{
            if(err){
                res.json(err)
            }
            else{
                res.json(latest)
            }
        })
});

router.get('/playlist/:id',  (req,res)=> {
    Playlist.findById(req.params.id).populate('tracks').exec((err,info)=>{
        if(err){
            res.json(err)
            
        }
        else{
            res.json(info)
        }
    })
   
});

router.get('/playlist/:id/edit', middleware.isOwner,  (req,res)=> {
    Playlist.findById(req.params.id,(err, info)=>{
        if(err){
            res.json(err)
        }
        else{
            res.json(info)
        }
    })
   
});

router.put('/playlist/:id',  (req,res)=> {
    Playlist.findByIdAndUpdate(req.params.id, req.body.form, (err,info)=>{
        if(err){
            res.json(err)
        }
        else{
            res.json('successfully updated the playlist')
            console.log('successfully updated the playlist')
        }
    })  
});

router.delete('/playlist/:id',  (req,res)=> {
    Playlist.findByIdAndDelete(req.params.id, (err, info)=>{
        if(err){
            res.json(err)
        }
        else{
            res.json('successfully deleted playlist')
        }
    })
});


// tracks route
router.get('/playlist/:id/tracks/new', middleware.isLoggedin, (req,res)=>{
    Playlist.findById(req.params.id, (err,info)=>{
        if(err){
            console.log('Unable to add songs')
            res.json(err)
        }
        else{
            res.json(info)
        }
    })
});

router.post('/playlist/:id/tracks', middleware.isLoggedin, (req,res)=>{
    Playlist.findById(req.params.id, (err, playlist)=>{
        if(err){
            console.log('Unable to add songs')
            res.json(err)
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
                            res.json('successfully added track to ' + playlist.owner.name + ' playlist')
                        }
                    })
                }
            })
        }
    })
});

router.delete('playlist/:id/tracks/:track_id', middleware.isOwner, (req,res)=>{
    Track.findByIdAndRemove(req.params.track_id, (err,done)=>{
        if(err){
            console.log('Unable to delete track')
            res.json(err)
        }
        else{
            console.log('done')
            res.json('Successfully deleted track from the playlist')
        }
    })
})
module.exports = router;