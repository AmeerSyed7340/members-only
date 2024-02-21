const asyncHandler = require("express-async-handler");

const bcrypt = require("bcryptjs");
const passport = require("passport")


//import models 
const User = require('../models/user');
const Post = require('../models/post');

const { body, validationResult } = require("express-validator");

//GET request for index
exports.index = asyncHandler(async (req, res, next) => {
    //fetch all posts in the database
    const posts = await Post.find().sort({createdAt: -1}).exec();

    res.render("index", {
        title: "Members only Project",
        posts: posts
    });
});

//GET request for sign up
exports.user_create_get = asyncHandler(async (req, res, next) => {
    res.render("signup_form", { title: "Sign Up" });
})

//POST request for sign up
exports.user_create_post =
    [
        //Validate and sanitize the fields
        body("first_name")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("First name must be specified.")
            .isAlphanumeric()
            .withMessage("First name has non-alphanumeric characters.:"),
        body("last_name")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("Last name must be specified.")
            .isAlphanumeric()
            .withMessage("Last name has non-alphanumeric characters.:"),
        body("username")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("Username must be specified.")
            .isAlphanumeric()
            .withMessage("username has non-alphanumeric characters.:"),
        body("password")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("Password must be specified.")
            .isAlphanumeric()
            .withMessage("Password has non-alphanumeric characters.:"),

        //Process request after validation and sanitization
        asyncHandler(async (req, res, next) => {
            //Extract validation errors from a request
            const errors = validationResult(req);

            //Create hashedpassword using bcrypt
            bcrypt.hash(req.body.password, 10, async (err, hashedpassword) => {
                //if error do something
                //else create user with hashed password
                try {
                    //Create user object with escaped and trimmed data
                    const user = new User(
                        {
                            first_name: req.body.first_name,
                            last_name: req.body.last_name,
                            username: req.body.username,
                            password: hashedpassword
                        }
                    );
                    //save user
                    await user.save();

                    //Redirect back to homepage 
                    res.redirect('/');
                }
                catch (err) {
                    return next(err);
                }
            })
        })
    ]

//GET request for login
exports.user_login_get = asyncHandler(async (req, res, next) => {
    res.render("login_form", {})
})

//POST for login
exports.user_login_post = function(req, res, next) {
    passport.authenticate('local', function(err, user, info, status) {
      if (err) { return next(err)}
      if (!user) { return res.redirect('/homepage/login') }
      res.redirect(user.url);
    })(req, res, next);
  };

//GET request for user detail
exports.user_detail = asyncHandler(async (req, res, next) => {
    const userID = req.params.id;
    const user = await User.findById(req.params.id);
    const posts = await Post.find({user: userID}).sort({createdAt: -1}).exec();

    //handle if user does not exist
    if (user === null) {
        //No results
        const err = new Error("User not found");
        err.status = 404;
        return next(err);
    }

    res.render("user_detail", {
        username: user.username,
        posts: posts,
        user: user
    })
})

//GET request for secret form
exports.secret_form_get = asyncHandler(async(req, res, next) =>{
    res.render('secret_form', {});
})

//POST request for secret form
exports.secret_form_post = asyncHandler(async(req, res, next) => {
    console.log(req.body.password);

    res.redirect('/');
})