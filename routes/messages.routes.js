const Router=require('express');
const MessagesController=require('../controlers/messages.controller')
const messagesController=new MessagesController;
const router= new Router();
router.post('/messages', messagesController.createMessage);
router.get('/messages/:id', messagesController.getMessagesFromDialog);
router.get('/messages', messagesController.getLastMessageFromDialogs);
router.put('/messages', messagesController.updateMessage);
router.delete('/messages/:id', messagesController.deleteMessage);


module.exports = router;