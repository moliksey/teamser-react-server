const Router = require('express');
const GamesController = require('../controlers/games.controller')
const passport = require('passport')
const gamesController = new GamesController;
const router = new Router();

router.get('/games/:id', gamesController.getOneGame);
router.get('/games', gamesController.getGames);


module.exports = router;