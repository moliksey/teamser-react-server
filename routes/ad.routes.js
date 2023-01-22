const Router = require('express');
const AdController = require('../controlers/ad.controller')
const passport = require('passport')
const adController = new AdController;
const router = new Router();
router.post('/ad', passport.authenticate('jwt', {session: false}), adController.createAd);
router.get('/ad/:id', passport.authenticate('jwt', {session: false}), adController.getOneAd);
router.get('/ad', adController.getAd);
router.put('/ad', passport.authenticate('jwt', {session: false}), adController.updateAd);
router.delete('/ad/:id', passport.authenticate('jwt', {session: false}), adController.deleteAd);
router.get('/myAd', passport.authenticate('jwt', {session: false}), adController.getMyAd);

module.exports = router;