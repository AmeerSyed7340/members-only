const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        first_name: {type: String, required: true, maxLength: 100},
        last_name: {type: String, required: true, maxLength: 100},
        username: {type: String, required: true, maxLength: 100},
        password: {type: String, required: true},
        membership_status: {type: Boolean, default: false}
    }
);

// //Virtual for item's URL
UserSchema.virtual("url").get(function(){
    //Dont use arrow function as we will need to use this object
    return `/homepage/user/${this._id}`
});

module.exports = mongoose.model("User", UserSchema);