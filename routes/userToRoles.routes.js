const Router=require('express');
const UserToRolesController=require('../controlers/userToRoles.controller')
const userToRolesController=new UserToRolesController;
const router= new Router();
router.post('/userToRoles', userToRolesController.addRoleToUser);
router.get('/userToRoles/:id', userToRolesController.getUsersRoles);
router.delete('/userToRoles', userToRolesController.deleteUserRole);


module.exports = router;