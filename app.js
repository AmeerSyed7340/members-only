var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require('./models/user');
const bcrypt = require("bcryptjs");

//require dotenv module
require('dotenv').config();

//handle DB connections
//import mongoose module
const mongoose = require('mongoose');

// Set `strictQuery: false` to globally opt into filtering by properties that aren't in the schema
// Included because it removes preparatory warnings for Mongoose 7.
// See: https://mongoosejs.com/docs/migrating_to_6.html#strictquery-is-removed-and-replaced-by-strict
mongoose.set("strictQuery", false);

const mongoDb = process.env.MONGODB_URL;

// Wait for database to connect, logging an error if there is a problem
async function connectDB() {
  try {
    await mongoose.connect(mongoDb);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Could not connect to MongoDB:', error);
  }
}
connectDB();

//Set up passport
passport.use(
  new LocalStrategy(async(username, password, done) => {
      try{
          const user = await User.findOne({username: username});
          if(!user){
              return done(null, false, {message: "Incorrect username"});
          };
          const match = await bcrypt.compare(password, user.password);
          if(!match){
            //passwords do not match!
            return done(null, false, {message: "Incorrect password"});
          }
          return done(null, user);
      }
      catch(err){
          return done(err);
      };
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
})

passport.deserializeUser(async(id, done) => {
  try{
      const user = await User.findById(id);
      done(null, user);
  }
  catch(err){
      done(err);
  }
})

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const homepageRouter = require("./routes/homepage");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(session({secret: "cats", resave: false, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

//middleware to ensure user is being serialized correctly
app.use((req, res, next) => {
  console.log('User in session:', req.user);
  next();
});

app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/homepage', homepageRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
