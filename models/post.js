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

module.exports = mongoose.model("Post", PostSchema);