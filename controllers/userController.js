const asyncHandler = require("express-async-handler");

//import models 
const User = require('../models/user');
const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async(req, res, next) => {
    res.render("index", {
        title: "Index"
    });
});

exports.user_create_get = asyncHandler(async(req, res, next) => {
    res.render("signup_form", {title: "Sign Up"});
})

exports.user_create_post = 
[
    //Validate and sanitize the fields
    body("first_name")
        .trim()
        .isLength({min: 1})
        .escape()
        .withMessage("First name must be specified.")
        .isAlphanumeric()
        .withMessage("First name has non-alphanumeric characters.:"),
    body("last_name")
        .trim()
        .isLength({min: 1})
        .escape()
        .withMessage("Last name must be specified.")
        .isAlphanumeric()
        .withMessage("Last name has non-alphanumeric characters.:"),
    body("username")
        .trim()
        .isLength({min: 1})
        .escape()
        .withMessage("Username must be specified.")
        .isAlphanumeric()
        .withMessage("username has non-alphanumeric characters.:"),
    body("password")
        .trim()
        .isLength({min: 1})
        .escape()
        .withMessage("Password must be specified.")
        .isAlphanumeric()
        .withMessage("Password has non-alphanumeric characters.:"),

    //Process request after validation and sanitization
    asyncHandler(async(req, res, next) => {
        //Extract validation errors from a request
        const errors = validationResult(req);

        //Create user object with escaped and trimmed data
        const user = new User(
            {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                username: req.body.username,
                password: req.body.password
            }
        );

        if(!errors.isEmpty()){
            //There are errors. render the form again with sanitizes values
            res.render("signup_form", {
                title: "Sign up",
                user: user,
                errors: errors.array(),
            });
            return;
        }//end if
        else{
            //Data from the form is valid
            //save user
            await user.save();

            //Redirect back to homepage for now
            res.redirect('/');
        }//end else
    })
]

exports.user_login_get = asyncHandler(async(req, res, next) => {
    res.render("login_form", {})
})