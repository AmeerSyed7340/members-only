const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema(
    {
        content: {
            type: String, 
            required: true
        }, 
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            require: true
        },
        createdAt:{
            type: Date,
            default: Date.now
        }
    }
);//Schema

// //Virtual for item's URL
PostSchema.virtual("url").get(function(){
    //Dont use arrow function as we will need to use this object
    return `/homepage/post/${this._id}`
});

module.exports = mongoose.model("Post", PostSchema);