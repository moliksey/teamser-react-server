const Router=require('express');
const AdController=require('../controlers/ad.controller')
const adController=new AdController;
const router= new Router();
router.post('/ad', adController.createAd);
router.get('/ad/:id', adController.getOneAd);
router.get('/ad', adController.getAd);
router.put('/ad', adController.updateAd);
router.delete('/ad/:id', adController.deleteAd);


module.exports = router;