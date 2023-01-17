const Router = require('express');
const DialogController = require('../controlers/dialog.controller')
const passport = require('passport')
const dialogController = new DialogController;
const router = new Router();
router.post('/dialog', passport.authenticate('jwt', {session: false}), dialogController.createDialog);
router.get('/dialog', passport.authenticate('jwt', {session: false}), dialogController.getUsersDialogs);
router.delete('/dialog/:id', passport.authenticate('jwt', {session: false}), dialogController.deleteDialog);


module.exports = router;