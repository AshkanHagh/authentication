const router = require('express').Router();
const { body } = require('express-validator');

const userControl = require('../controllers/user');


router.get('/:id', userControl.getSingleUser);

router.get('/', userControl.getAllUsers);

router.put('/', body('email').trim().isEmail().isLowercase().notEmpty(), userControl.updateUser);


module.exports = router;