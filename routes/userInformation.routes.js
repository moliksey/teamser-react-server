const Router = require('express');
const UserInformationController = require('../controlers/userInformation.controller')
const passport = require('passport')
const userInformationController = new UserInformationController;
const router = new Router();
router.post('/userInformation', passport.authenticate('jwt', {session: false}), userInformationController.createUserInformation);
router.get('/userInformation/:id', passport.authenticate('jwt', {session: false}), userInformationController.getUsersUserInformation);
router.put('/userInformation', passport.authenticate('jwt', {session: false}), userInformationController.updateUserInformation);
router.delete('/userInformation/:id', passport.authenticate('jwt', {session: false}), userInformationController.deleteUserInformation);
router.get('/MyUserInformation',passport.authenticate('jwt', {session: false}), userInformationController.getMyUsersUserInformation);

module.exports = router;