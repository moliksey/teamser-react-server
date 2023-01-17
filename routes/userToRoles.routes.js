const Router = require('express');
const UserToRolesController = require('../controlers/userToRoles.controller')
const passport = require('passport')
const userToRolesController = new UserToRolesController;
const router = new Router();
router.post('/userToRoles', passport.authenticate('jwt', {session: false}), userToRolesController.addRoleToUser);
router.get('/userToRoles/:id', passport.authenticate('jwt', {session: false}), userToRolesController.getUsersRoles);
router.delete('/userToRoles', passport.authenticate('jwt', {session: false}), userToRolesController.deleteUserRole);


module.exports = router;