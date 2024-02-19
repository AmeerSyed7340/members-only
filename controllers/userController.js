const asyncHandler = require("express-async-handler");

//import models 
const User = require('../models/user');

exports.index = asyncHandler(async(req, res, next) => {
    res.render("index", {
        title: "Index"
    });
});

exports.user_create_get = asyncHandler(async(req, res, next) => {
    res.render("signup_form", {title: "Sign Up"});
})

exports.user_create_post = asyncHandler(async(req, res, next) => {
    res.redirect('/');
})

exports.user_login_get = asyncHandler(async(req, res, next) => {
    res.render("login_form", {})
})