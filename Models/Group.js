const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const groupSchema = new Schema({
    name: {type: String, required: true},
    creator: {type: Schema.Types.ObjectId, ref: "Users"},
    profileImg: {type: Schema.Types.ObjectId, ref: "ProfilePicture", required: true},
    members: [
        {user: {type: Schema.Types.ObjectId, ref: "Users"}}
    ],
});

module.exports = mongoose.model("Groups", groupSchema);