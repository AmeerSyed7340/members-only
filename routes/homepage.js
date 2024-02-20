const express = require("express")
const router = express.Router();
const passport = require('passport')
const user_controller = require("../controllers/userController");

//TEST "/" route
router.get("/", user_controller.index);

//GET request for sign up
router.get('/signup', user_controller.user_create_get);

//POST request for sign up
router.post('/signup', user_controller.user_create_post);

//GET requeset for login
router.get('/login', user_controller.user_login_get);

//GET request for user detail
router.get('/user/:id', user_controller.user_detail);

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }));
  
module.exports = router;