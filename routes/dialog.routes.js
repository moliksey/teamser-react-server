const Router=require('express');
const DialogController=require('../controlers/dialog.controller')
const dialogController=new DialogController;
const router= new Router();
router.post('/dialog', dialogController.createDialog);
router.get('/dialog/:id', dialogController.getUsersDialogs);
router.delete('/dialog/:id', dialogController.deleteDialog);


module.exports = router;