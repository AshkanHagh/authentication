const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const jwt = require('jsonwebtoken');


exports.getSingleUser = async (req, res, next) => {

    try {
        const user = await User.findById(req.params.id).select('-password');
        if(!user) {

            const error = new Error('Sorry, the requested user could not be found.');
            error.statusCode = 422;
            throw error;
        }

        res.status(200).json({message : 'Posts are ready', user});

    } catch (error) {
        
        if(!error.statusCode) {

            error.statusCode = 500;
        }
        next(error);
    }

}

exports.getAllUsers = async (req, res, next) => {

    try {
        const user = await User.find().select('-password');
        if(!user) {
            
            const error = new Error('Sorry, the requested users could not be found.');
            error.statusCode = 422;
            throw error;
        }

        res.status(200).json({message : 'Users fetched...', users : user});

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

        const { username, email, password } = req.body;

        const user = await User.findById(req.userId);
        if(!user) {
            
            const error = new Error('Sorry, the requested user could not be found.');
            error.statusCode = 422;
            throw error;
        }

        if(user._id.toString() != req.userId) {

            const error = new Error('Access denied. You are not authorized to access this resource.');
            error.statusCode = 422;
            throw error;
        }

        const confirmPass = await bcrypt.compare(password, user.password);
        if(!confirmPass) {

            const error = new Error('Wrong password please confirm your old password');
            error.statusCode = 422;
            throw error;
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPass = await bcrypt.hash(password, salt);

        const updatedUser = await user.updateOne({
            $set : {

                username : req.body.username,
                email : req.body.email,
                password : hashedPass
            }
        });

        res.status(201).json({message : 'User has been updated', userId : user._id});

    } catch (error) {
        
        if(!error.statusCode) {

            error.statusCode = 500;
        }
        next(error);
    }

}