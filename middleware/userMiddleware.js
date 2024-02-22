const asyncHandler = require("express-async-handler");

exports.checkAuth = asyncHandler(async(req, res, next)=> {
    if(req.user === undefined){
        res.redirect('/')
    }
    else next();
})