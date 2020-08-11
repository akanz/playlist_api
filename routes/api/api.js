const express = require('express'),
      passport = require('passport'),
      User = require('../../models/user'),
      Playlist = require('../../models/playlist'),
      Track = require('../../models/track'),
      verifyToken = require('../../middleware/auth'),
      jwt = require('jsonwebtoken'),
      bcrypt = require('bcryptjs'),
      pdfDoc = require('pdfkit'),
      fs = require('fs'),
      router = express.Router();

const pdf = new pdfDoc(); 

// authentication route

router.get('/signup', (req,res)=>{
    res.send('GET API Sign up route')
});
router.post('/signup', (req,res)=>{
    var hashedPassword = bcrypt.hashSync(req.body.password, 8),
        name = req.body.username,
        password = req.body.password,
        confirm = req.body.confirm;

        User.findOne({ username:  name}).exec()
        .then( (user)=>{
            if(name == user.username){
                res.json('User already exists')
            }
            else if (confirm != password){
                res.json('Password do not match')
            }
            else{
                User.create({
                    username : req.body.username,
                    password : hashedPassword
                },
                function (err, user) {
                    if (err) return res.status(500).json("There was a problem registering the user.")
                    // create a token
                    var token = jwt.sign({ id: user._id }, '98765etdgcvbvgftr67ouilkm', {
                    expiresIn: 86400 // expires in 24 hours
                    });
                    res.status(200).json({ auth: true, token: token });
                }); 
            }  
        })
        .catch( (err)=>{
            if (confirm != password){
                res.json('Password do not match')
            }
            else{
                User.create({
                    username : req.body.username,
                    password : hashedPassword
                },
                function (err, user) {
                    if (err) return res.status(500).json("There was a problem registering the user.")
                    // create a token
                    var token = jwt.sign({ id: user._id }, '98765etdgcvbvgftr67ouilkm', {
                    expiresIn: 86400 // expires in 24 hours
                    });
                    res.status(200).json({ auth: true, token: token });
                }); 
            } 
        }) ;
});
       

// user route
router.get('/me', verifyToken , function(req, res) {
    User.findById(req.userId, { password: 0 }, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        
        res.status(200).send(user);
      });

    });

// login routes
router.get('/login', (req,res)=> {
    res.send('GET API login route')
})

router.post('/login', function(req, res) {

    User.findOne({ username: req.body.username }, function (err, user) {
      if (err) return res.status(500).json('Error on the server.');
      if (!user) return res.status(404).json('No user found.');
      
      var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
      if (!passwordIsValid) return res.status(401).json({ auth: false, token: null });
      
      var token = jwt.sign({ id: user._id }, '98765etdgcvbvgftr67ouilkm', {
        expiresIn: 86400 // expires in 24 hours
      });
      
      res.status(200).send({ auth: true, token: token });
    });
    
  });
     
  router.get('/logout', function(req, res) {
    res.status(200).json({ auth: false, token: null });
  });



// playlist route
router.get('/playlist/new', verifyToken, (req,res)=> {
    res.send('GET API new playlist')
});

router.get('/playlist',(req,res)=> {
    Playlist.find({},null,{sort:'-created_at'}, (err,all)=>{
        if(err){
            res.json('Unable to get playlist')
        }
        else{
            res.json(all)
        }
    })
    
});


router.post('/playlist', verifyToken, (req,res)=> {
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

router.get('/playlist/:id', verifyToken, (req,res)=> {
    Playlist.findById(req.params.id).populate('tracks').exec((err,info)=>{
        if(err){
            res.json(err)
            
        }
        else{
            res.json(info)
        }
    })
   
});

router.get('/playlist/:id/edit',verifyToken,  (req,res)=> {
    Playlist.findById(req.params.id,(err, info)=>{
        if(err){
            res.json(err)
        }
        else{
            res.json(info)
        }
    })
   
});

router.put('/playlist/:id',verifyToken,  (req,res)=> {
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

router.delete('/playlist/:id',verifyToken,  (req,res)=> {
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
router.get('/playlist/:id/tracks/new', verifyToken, (req,res)=>{
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

router.post('/playlist/:id/tracks', verifyToken, (req,res)=>{
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
                            res.json('successfully added track to ' + playlist.title + ' playlist')
                        }
                    })
                }
            })
        }
    })
});

router.delete('playlist/:id/tracks/:track_id', verifyToken, (req,res)=>{
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


    
router.get('/generatePdf', (req,res)=>{
    Playlist.find({}, (err, data)=>{
        if(err){
            console.log(err)
            res.json('Unable to get data')
        }
        else{
            data.forEach( (datum)=>{
                console.log(datum.title)
            })
            
            // Pipe its output somewhere, like to a file or HTTP response
            // See below for browser usage
            pdf.pipe(fs.createWriteStream('playlist.pdf'));
            
            // Embed a font, set the font size, and render some text
            pdf
            .fontSize(25)
            .text('this is a pdf', 100, 100);
            
            pdf.end();
            res.json('PDF created')
        }
       
    })
    
     
})

module.exports = router;