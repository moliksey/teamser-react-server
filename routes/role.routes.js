const Router=require('express');
const RoleController=require('../controlers/role.controller')
const roleController=new RoleController;
const router= new Router();

router.get('/role/:id', roleController.getOneRole);
router.get('/role', roleController.getRoles);



module.exports = router;