const express = require('express');
const { check } = require('express-validator/check');

const router = express.Router();

const authController = require('../controllers/auth');


router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.post('/register', check('email').isEmail(), authController.postRegister);

router.post('/logout', authController.postLogout);

module.exports = router;