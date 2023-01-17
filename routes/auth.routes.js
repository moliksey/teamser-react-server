const Router = require('express');
const AuthController = require('../controlers/auth.controller')
const authController = new AuthController;
const router = new Router();
router.post('/login', authController.login);


module.exports = router;