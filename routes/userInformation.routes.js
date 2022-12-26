const Router=require('express');
const UserInformationController=require('../controlers/userInformation.controller')
const userInformationController=new UserInformationController;
const router= new Router();
router.post('/userInformation', userInformationController.createUserInformation);
router.get('/userInformation/:id', userInformationController.getUsersUserInformation);
router.put('/userInformation', userInformationController.updateUserInformation);
router.delete('/userInformation/:id', userInformationController.deleteUserInformation);


module.exports = router;