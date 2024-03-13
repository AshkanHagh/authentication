const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');


exports.signup = async (req, res, next) => {

    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {

            const error = new Error('invalid data from your data, please check your value');
            error.statusCode = 422;
            throw error;
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const user = new User({
            
            username : req.body.username,
            email : req.body.email,
            password : hashedPass
        });

        const result = await user.save();

        const {password, ...others} = user._doc;

        res.status(201).json({message : 'User has been created...', user : others})

    } catch (error) {
        
        if(!error.statusCode) {

            error.statusCode = 500;
        }
        next(error)
    }

}

exports.login = async (req, res, next) => {

    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {

            const error = new Error('invalid data from your data, please check your value');
            error.statusCode = 422;
            throw error;
        }

        const user = await User.findOne({email : req.body.email});
        if(!user) {

            const error = new Error('Nothing found please check your email');
            error.statusCode = 422;
            throw error;
        }

        const password = await bcrypt.compare(req.body.password, user.password);
        if(!password) {

            const error = new Error('Wrong password');
            error.statusCode = 422;
            throw error;
        }

        const token = jwt.sign({email : user.email, userId : user._id}, 'Authentication', {expiresIn : '1h'});

        res.status(200).json({message : 'Wolcome', token : token, userId : user._id});

    } catch (error) {
        
        if(!error.statusCode) {
            
            error.statusCode = 500;
        }
        next(error);
    }

}