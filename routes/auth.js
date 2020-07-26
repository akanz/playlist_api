const express = require('express'),
      User = require('../models/user'),
      passport = require('passport'),
    //   middleware = require('../middleware'),
      router = express.Router();

const{check, validationResult} = require('express-validator');

router.get('/signup', (req,res)=>{
    res.render('register')
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
                    console.log('Unable to create new user')
                    return res.render('register')
                }
                else{
                    passport.authenticate('local')(req,res,()=>{
                        console.log('User created')
                        res.redirect('/login')
                    })
                }
            })
        }
        
});

// login routes
router.get('/login', (req,res)=> {
    res.render('login')
})

router.post('/login', passport.authenticate('local',{
    successRedirect: '/playlist',
    failureRedirect: '/login',
}), (req, res)=> {  
})
     
router.get('/logout', (req,res)=> {
    req.logout();
    res.redirect('/')
})
module.exports = router;