const router = require('express').Router();
const { body } = require('express-validator');

const authControl = require('../controllers/auth');


router.post('/signup', body('email').trim().isEmail().isLowercase().notEmpty(), authControl.signup);

router.post('/login', body('email').trim().isEmail().isLowercase().notEmpty(), authControl.login);


module.exports = router;