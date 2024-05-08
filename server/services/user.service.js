const { User } = require("../models/user");
const httpStatus = require('http-status');
const { ApiError } = require('../middleware/apiError');

const findUserByEmail = async(email) => {
    return await User.findOne({email})
}

const findUserById = async(_id) => {
    return await User.findById(_id);
}

const updateUserProfile = async(req) => {
    try {

        // make sure to validate what you want to patch !!!111111111111123123
        

        const user = await User.findOneAndUpdate(
            { _id: req.user._id },
            {
                $set: {
                    ...req.body.data
                }
            },
            { new: true}
        );

        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
        }

        return user;

    }catch(error) {
        throw error;
    }
}

module.exports = {
    findUserByEmail,
    findUserById,
    updateUserProfile
}