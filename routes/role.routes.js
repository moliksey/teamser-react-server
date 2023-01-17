const Router = require('express');
const RoleController = require('../controlers/role.controller')
const passport = require('passport')
const roleController = new RoleController;
const router = new Router();

router.get('/role/:id', roleController.getOneRole);
router.get('/role', roleController.getRoles);


module.exports = router;