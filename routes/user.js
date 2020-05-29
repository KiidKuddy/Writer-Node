const express = require('express');

const userController = require('../controllers/user');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/my-account', isAuth, userController.getMyAccount);

module.exports = router;