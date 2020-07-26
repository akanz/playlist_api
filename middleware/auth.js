const Playlist = require('../models/playlist')
const apiMiddleware = {};

apiMiddleware.isLoggedin = (req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    res.json('You need to be authenticated')
}

apiMiddleware.isOwner = (req,res,next)=>{
    if(req.isAuthenticated()){
        Playlist.findById(req.params.id, (err,list)=>{
            if(err){
                res.json(err)
            }
            else{
                if(list.owner.id.equals(req.user._id)){
                    next()
                }
                else{
                    res.json('You need to be authenticated')
                }
            }
        })
    }
    else{
        res.json('You need to be authenticated')
    }
}

module.exports = apiMiddleware