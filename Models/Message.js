const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: "Users"},
    reply: {type: Schema.Types.ObjectId, ref: "Chats"},
    content: {type: String},
    image: {type: String},
    video: {type: String},
    date: {type: Date, required: true, default: Date.now}
});

module.exports = mongoose.model("Messages", MessageSchema);