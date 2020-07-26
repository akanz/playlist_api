const Playlist = require('../models/playlist'),
      Track = require('../models/track');

const middleware = {};


middleware.isLoggedin = (req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

middleware.isOwner = (req,res,next)=>{
    if(req.isAuthenticated()){
        Playlist.findById(req.params.id, (err,list)=>{
            if(err){
                res.redirect('/playlist')
            }
            else{
                if(list.owner.id.equals(req.user._id)){
                    next()
                }
                else{
                    res.redirect('back')
                }
            }
        })
    }
    else{
        res.redirect('back')
    }
}


module.exports = middleware