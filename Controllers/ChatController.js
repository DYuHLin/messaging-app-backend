const asyncHandler = require('express-async-handler');
const {body, validationResult} = require('express-validator');
const chats = require('../Models/Chat');
const mongoose = require('mongoose');
const messages = require('../Models/Message');

exports.get_chats = asyncHandler(async(req, res, next) => {
    const chat = await chats.find( {'members.user': req.params.id} ).populate('message').populate('members.user').populate([
            {
                path: 'members.user',
                populate: [{path: 'profileImg'}]
            }
        ]).exec();

    return res.json(chat);
});

exports.post_chat = asyncHandler(async (req, res, next) => {
    try{
        const errors = validationResult(req);

        const chat = new chats({});
        chat.members.push({user: req.body.user1});
        chat.members.push({user: req.body.user2});
        if(!errors.isEmpty()){
            return console.log(errors);
        } else {       
            await chat.save();
            return res.json('OK');
        };
        
    }catch(err){
        res.status(409).json({mesg: err.message});
    }
});

exports.delete_chat = asyncHandler(async (req, res, next) => {
    await chats.findByIdAndDelete(req.params.id);
    await messages.deleteMany({reply: req.params.id});
    return res.json('OK');
});