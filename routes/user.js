const router = require('express').Router();
const { body } = require('express-validator');

const userControl = require('../controllers/user');


router.get('/:userId', userControl.getSingleUser);

router.get('/', userControl.getAllUsers);

router.put('/:userId', body('email').trim().isEmail().isLowercase().notEmpty(), userControl.updateUser);

router.delete('/:userId', userControl.deleteUser);


module.exports = router;