const Router = require('express');
const MessagesController = require('../controlers/messages.controller')
const passport = require('passport')
const messagesController = new MessagesController;
const router = new Router();
router.post('/messages', passport.authenticate('jwt', {session: false}), messagesController.createMessage);
router.get('/messages/:id', passport.authenticate('jwt', {session: false}), messagesController.getMessagesFromDialog);
router.get('/messages', passport.authenticate('jwt', {session: false}), messagesController.getLastMessageFromDialogs);
router.put('/messages', passport.authenticate('jwt', {session: false}), messagesController.updateMessage);
router.delete('/messages/:id', passport.authenticate('jwt', {session: false}), messagesController.deleteMessage);


module.exports = router;