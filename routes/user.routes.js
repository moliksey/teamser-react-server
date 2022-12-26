const Router=require('express');
const UserController=require('../controlers/user.controller')
const userController=new UserController;
const router= new Router();
router.post('/users', userController.createUser);
router.get('/users/:id', userController.getOneUser);
router.get('/users', userController.getUsers);
router.put('/users', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);


module.exports = router;
