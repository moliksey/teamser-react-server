const Router = require('express');
const AvatarController = require('../controlers/avatar.controller')
const passport = require('passport')
const avatarController = new AvatarController;
const router = new Router();
router.post('/avatar', passport.authenticate('jwt', {session: false}), avatarController.createAvatar);
router.get('/avatar/:id', avatarController.getUsersAvatar);
router.put('/avatar', passport.authenticate('jwt', {session: false}), avatarController.updateAvatar);
router.delete('/avatar', passport.authenticate('jwt', {session: false}), avatarController.deleteUsersAvatar);


module.exports = router;