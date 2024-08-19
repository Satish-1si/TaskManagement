const express = require('express');
const { registerUser, loginUser, logoutUser } = require('../controllers/userController');
const { isAuth } = require('../middlewares/auth');
const router = express.Router()

router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/check-login',isAuth);
router.get('/logout',logoutUser)

module.exports = router