const express = require('express'),
      mongoose = require('mongoose'),
      passport = require('passport'),
      session = require('express-session'),
      methodOvd = require('method-override'),
      sanitizer = require('express-sanitizer'),
      bodyParser = require('body-parser'),
      LocalStrategy = require('passport-local'),
      flash = require('connect-flash');

//models 
const User = require('./models/user')
// routes
const authRoute = require('./routes/auth'),
      homeRoute = require('./routes/playlist'),
      trackRoute = require('./routes/track'),
      landing = require('./routes/landing');

// api route
const apiRoute = require('./routes/api/api');

const app = express();
// mongoose.connect('mongodb://localhost/playlist', 
//     {useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true});

mongoose.connect('mongodb+srv://manakanz:manakanns@cluster0.hvt37.mongodb.net/playlist?retryWrites=true&w=majority', 
    {useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(sanitizer());
app.use(express.static('public'));
app.use(methodOvd('_method'));

app.use(session ({
    secret: '98765etdgcvbvgftr67ouilkm',
    resave: false,
    saveUninitialized:false,
    cookie: { maxAge: 60000 }
        })
    )

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate())); 

app.use(function (req,res,next) {
    res.locals.currentuser = req.user;
    next();
})

app.use('/', landing);
app.use('/playlist',homeRoute),
app.use('/playlist/:id/tracks', trackRoute),
app.use('/api', apiRoute),
app.use(authRoute);

app.listen(3000, ()=> {
    console.log('api server running on port 3000');
})