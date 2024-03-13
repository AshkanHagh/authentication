const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const User = require('../models/user');


exports.getSingleUser = async (req, res, next) => {

    try {
        const user = await User.findById(req.params.userId);
        if(!user) {

            const error = new Error('Nothing found please check userId');
            error.statusCode = 422;
            throw error;
        }

        const {password, ...others} = user._doc;

        res.status(200).json({message : 'User fetched...', user : others});

    } catch (error) {
        
        if(!error.statusCode) {

            error.statusCode = 500;
        }
        next(error);
    }

}

exports.getAllUsers = async (req, res, next) => {

    try {
        const user = await User.find();
        if(!user) {
            
            const error = new Error('Nothing found...!!');
            error.statusCode = 422;
            throw error;
        }

        res.status(200).json({message : 'Users fetched...', user : user});

    } catch (error) {
        
        if(!error.statusCode) {

            error.statusCode = 500;
        }
        next(error);
    }

}

exports.updateUser = async (req, res, next) => {

    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {

            const error = new Error('invalid data from your data, please check your value');
            error.statusCode = 422;
            throw error;
        }

        const user = await User.findById(req.params.userId);
        if(!user) {
            
            const error = new Error('Nothing found check userId');
            error.statusCode = 422;
            throw error;
        }

        const confirmPass = await bcrypt.compare(req.body.confirmPass, user.password);
        if(!confirmPass) {

            const error = new Error('Wrong password please confirm your old password');
            error.statusCode = 422;
            throw error;
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const updatedUser = await user.updateOne({
            $set : {

                username : req.body.username,
                email : req.body.email,
                password : hashedPass
            }
        });

        res.status(201).json({message : 'user has been updated', userid : user._id});

    } catch (error) {
        
        if(!error.statusCode) {

            error.statusCode = 500;
        }
        next(error);
    }

}

exports.deleteUser = async (req, res, next) => {

    try {
        const user = await User.findById(req.params.userId);
        if(!user) {
            
            const error = new Error('Nothing found check userId');
            error.statusCode = 422;
            throw error;
        }

        await user.deleteOne();

        res.status(200).json({message : 'user has been delete', userId : user._id});

    } catch (error) {
        
        if(!error.statusCode) {

            error.statusCode = 500;
        }
        next(error);
    }

}