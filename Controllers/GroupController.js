const asyncHandler = require('express-async-handler');
const {body, validationResult} = require('express-validator');
const groups = require('../Models/Group');
const messages = require('../Models/Message');

exports.create_group = asyncHandler(async (req, res, next) => {
    try{
        const errors = validationResult(req);

        const group = new groups({
            name: req.body.name,
            creator: req.body.id,
            profileImg: req.body.image,
            members: [],
        });

        if(!errors.isEmpty()){
            return console.log(errors);
        } else {       
            await group.save();
            return res.json(group);
        };
        
    }catch(err){
        res.status(409).json({mesg: err.message});
    }
});

exports.fetch_groups = asyncHandler(async (req, res, next) => {
    const fetchGroups = await groups.find({$or: [{creator: req.params.id}, {'members.user': req.params.id}]}).populate('creator').populate('profileImg');

    return res.json(fetchGroups);
});

exports.group_detail = asyncHandler(async (req, res, next) => {
    const group = await groups.findById(req.params.id).populate('creator').populate('profileImg').populate('members.user').populate([
        {
            path: 'members.user',
            populate: [{path: 'profileImg'}]
        }
    ]).exec();

    return res.json(group);
});

exports.add_members = asyncHandler(async (req, res, next) => {
    const findMember = await groups.findOne({_id: req.params.id, 'members.user': req.body.userId});
    if(findMember){
        return res.json('error');
    } else{
        await groups.updateOne({_id: req.params.id}, {
            $push: {
                members: {user: req.body.userId}
            }
        });
        return res.json('ok');
    };
});

exports.delete_group = asyncHandler(async (req, res, next) => {
    await groups.updateOne({_id: req.params.id}, {
        $pull: {
            members: {user: req.body.userId}
        }
    });

    return res.json('OK');
});

exports.delete_group_admin = asyncHandler(async (req, res, next) => {
    await groups.findByIdAndDelete(req.params.id);
    await messages.findOneAndDelete({reply: req.params.id});
    return res.json('OK');
});