const router = require('express').Router();
const { body } = require('express-validator');

const userControl = require('../controllers/user');


router.get('/:userId', userControl.getSingleUser);

router.get('/', userControl.getAllUsers);

router.put('/:userId', userControl.updateUser);

router.delete('/:userId', userControl.deleteUser);


module.exports = router;