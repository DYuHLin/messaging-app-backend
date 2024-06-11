const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const {body, ValidationResult} = require('express-validator');
const users = require('../Models/User');
const messages = require('../Models/Message');
const bcrypt = require('bcryptjs');

let refreshTokens = [];

const getAccessToken = (user) => {
    return jwt.sign({user}, 'secretkey', {expiresIn: '10h'});
};

const getRefreshToken = (user) => {
    return jwt.sign({user}, 'refreshsecretkey');
};

exports.post_login = asyncHandler(async (req, res, next) => {
    try{
        const eMail = await users.findOne({email: req.body.email}).populate('profileImg').populate('friends.user').populate([
            {
                path: 'friends.user',
                populate: [{path: 'profileImg'}]
            }
        ]).exec();

        if(!eMail){
            console.log("Incorrect email");
            return res.json("email");
        };

        const match = await bcrypt.compare(req.body.password, eMail.password);
        if(!match){
            console.log("Incorrect Password");
            return res.json("password");
        };

        const accessToken = getAccessToken(eMail);
        const refreshToken = getRefreshToken(eMail);

        refreshTokens.push(refreshToken);

        await users.updateOne({email: req.body.email}, {$set: {
            online: true
        }});

        return res.json({
            accessToken: accessToken,
            refreshToken: refreshToken
        });
    }catch(err){
        console.log(err);
    };
});

exports.post_delete = asyncHandler(async (req, res, next) => {
    const user = await users.findById(req.body.id).exec();

    await users.findByIdAndDelete(req.params.id);
    await messages.deleteMany({user: req.params.id});
    // await comments.deleteMany({user: req.params.id});
});

exports.refresh_token = asyncHandler(async (req, res, next) => {
    //token from user
    const refreshToken = req.body.token;
    //send error if there is no token or invalid
    if(!refreshToken) return res.status(403).json("You are not authenticated");
    if(refreshTokens.includes(refreshToken)){
        return res.status(403).json("refresh token is not valid");
    };
    jwt.verify(refreshToken, "refreshsecretkey", (err, user) => {
        err && console.log(err);
        refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

        const newAccessToken = getAccessToken(user);
        const newRefreshToken = getRefreshToken(user);

        refreshTokens.push(newRefreshToken);

        res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        });
    });
});

exports.post_logout = asyncHandler(async (req, res, next) => {
    const refreshToken = req.body.token;
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    await users.updateOne({email: req.body.email}, {$set: {
        online: false
    }});
    res.status(200).json("You have logged out.");
});

exports.verifyToken = (req, res, next) =>{
    const bearerHeader = req.headers['authorization'];
    //check if bearer is undefined
    if(typeof bearerHeader !== "undefined"){
        //split the space in token
        const bearer = bearerHeader.split(" ");
        //get token from array
        const bearerToken = bearer[1];
        //set token
        req.token = bearerToken;
        //next middleware
        next();
    } else {
        res.sendStatus(403);
    };
};