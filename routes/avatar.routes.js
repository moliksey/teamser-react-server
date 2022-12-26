const Router=require('express');
const AvatarController=require('../controlers/avatar.controller')
const avatarController=new AvatarController;
const router= new Router();
router.post('/avatar', avatarController.createAvatar);
router.get('/avatar/:id', avatarController.getUsersAvatar);
router.put('/avatar', avatarController.updateAvatar);
router.delete('/avatar/:id', avatarController.deleteUsersAvatar);


module.exports = router;