const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const users = require('../Models/User');
const messages = require('../Models/Message');
const images = require('../Models/ProfileImage');

exports.post_register = asyncHandler(async (req, res, next) => {
    try{
        const user = await users.findOne({email: req.body.email});
        if(user){
            console.log("email taken");
            return res.json("failed");
        };

        if(!user){
            bcrypt.hash(req.body.password, 10, async(err, hashedPassword) => {
                if(err){
                    return next(err);
                } else if(req.body.password !== req.body.confirmedPassword){
                    return res.json("match"); 
                } else {
                    const user = new users({
                        name: req.body.name,
                        surname: req.body.surname,
                        email: req.body.email,
                        password: hashedPassword,
                        profileImg: req.body.image,
                        friends: [],
                        online: false
                    });
                    await user.save();
                    return res.json("ok");
                };
            });
        }  
    }catch(err){
        next(err);
    };
});

exports.update_acc = asyncHandler(async (req, res, next) => {
    try{
        const user = await users.findOne({email: req.body.email});
        if(user){
            console.log("email taken");
            return res.json("failed");
        };

        if(!user){
            await users.updateOne({_id: req.params.id}, {$set: {
                name: req.body.name,
                surname: req.body.surname,
                email: req.body.email}});

            return res.json("ok");
        } else {
            return res.json('exist');
        }
         
    }catch(err){
        next(err);
    };
});

exports.profile_image = asyncHandler(async (req, res, next) => {
    try{
        const image = new images({
            image: req.body.image
        });

        await image.save();
        return res.json(image);

    } catch(err){
        res.status(409).json({message: err.message});
    }
});

exports.update_image = asyncHandler(async (req, res, next) => {
    await users.updateOne({_id: req.params.id}, {$set: {profileImg: req.body.imageId}});
    return res.json('ok');
    
});

exports.add_friend = asyncHandler(async (req, res, next) => {
    const findFriend = await users.findOne({_id: req.params.id, 'friends.user': req.body.friendId});
    if(findFriend){
        return res.json('added');
    } else{
        await users.updateOne({_id: req.params.id}, {$push: {friends: {user: req.body.friendId}}});
        return res.json('ok');
    }
});

exports.delete_friend = asyncHandler(async (req, res, next) => {
    await users.findOneAndUpdate({_id: req.params.id}, {
        $pull: {
            friends: {user: req.body.friendId}
        }
    });
    return res.json('ok');
});

exports.get_users = asyncHandler(async (req, res, next) => {
    const usersList = await users.find().populate('profileImg').populate('friends.user').populate([
        {
            path: 'friends.user',
            populate: [{path: 'profileImg'}]
        }
    ]).exec();

    return res.json(usersList);
});

exports.get_user = asyncHandler(async (req, res, next) => {
    const user = await users.findById(req.params.id).populate('profileImg').populate('friends.user').populate([
        {
            path: 'friends.user',
            populate: [{path: 'profileImg'}]
        }
    ]).exec();

    return res.json(user);
});

exports.post_delete = asyncHandler(async (req, res, next) => {
    await users.findByIdAndDelete(req.params.id);
    await messages.deleteMany({user: req.params.id});
   const updated = await users.updateMany({'friends.user': req.params.id}, {$pull: {friends: {user: req.params.id}}});
   return res.json(updated);
});