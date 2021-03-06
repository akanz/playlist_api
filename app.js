const express = require('express'),
      mongoose = require('mongoose'),
      passport = require('passport'),
      session = require('express-session'),
      methodOvd = require('method-override'),
      sanitizer = require('express-sanitizer'),
      bodyParser = require('body-parser'),
      LocalStrategy = require('passport-local'),
      flash = require('connect-flash'),
      dotenv = require('dotenv');
      
dotenv.config();

//models 
const User = require('./models/user')
// routes
const authRoute = require('./routes/auth'),
      homeRoute = require('./routes/playlist'),
      trackRoute = require('./routes/track'),
      pdfRoute = require('./routes/pdf'),
      landing = require('./routes/landing');

// api route
const apiRoute = require('./routes/api/api');

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true,
                                             useFindAndModify: false, 
                                             useUnifiedTopology: true});


console.log(process.env.DATABASEURL , typeof(process.env.DATABASEURL))

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

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate())); 

app.use(function (req,res,next) {
    res.locals.currentuser = req.user;
    res.locals.success = req.flash('success');
    res.locals.warning = req.flash('warning');
    res.locals.error = req.flash('error');
    next(); 
})

app.use('/', landing);
app.use('/playlist',homeRoute),
app.use('/playlist/:id/tracks', trackRoute),
app.use('/api', apiRoute),
app.use(authRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT , process.env.IP, ()=> {
    console.log('api server running on port ' + PORT);
})