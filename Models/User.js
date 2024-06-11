const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {type: String, required: true},
    surname: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    profileImg: {type: Schema.Types.ObjectId, ref: "ProfilePicture", required: true},
    friends: [
        {user: {type: Schema.Types.ObjectId, ref: "Users"}}
    ],
    online: {type: Boolean, required: true, default: false}
});

module.exports = mongoose.model("Users", userSchema);