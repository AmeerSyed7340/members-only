const asyncHandler = require("express-async-handler");
const {body, validationResult} = require("express-validator");

const Post = require("../models/post");
const user = require("../models/user");

exports.new_post = [
    //Validate and sanitize the fields
    body("message_content")
        .trim()
        .isLength({min: 1})
        .escape()
        .withMessage("Message cannot be empty"),

    //Process request after validation and sanitization
    asyncHandler(async(req, res, next) => {
        try{
            const post = new Post(
                {
                    content: req.body.message_content,
                    user: req.params.id
                }
            );
            //save post
            await post.save();
    
            //redirect back to userdetail page
            res.redirect(`/homepage/user/${req.params.id}`);
        }
        catch(err){
            return next(err);
        }
    })
]

exports.post_delete = asyncHandler(async(req, res, next) => {
    const postID = req.params.id;
    const user = req.user;
    const currentPost = await Post.findByIdAndDelete(postID).exec();

    res.redirect(`${user.url}`);
})