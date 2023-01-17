const Router = require('express');
const UserController = require('../controlers/user.controller')
const passport = require('passport')
const userController = new UserController;
const router = new Router();
router.post('/users', userController.createUser);
router.get('/users/:id', userController.getOneUser);
router.get('/users', passport.authenticate('jwt', {session: false}), userController.getUsers);
router.put('/users', passport.authenticate('jwt', {session: false}), userController.updateUser);
router.delete('/users/:id', passport.authenticate('jwt', {session: false}), userController.deleteUser);


module.exports = router;
