const Router = require('express');
const GoalsController = require('../controlers/goals.controller')
const goalsController = new GoalsController;
const router = new Router();

router.get('/goals/:id', goalsController.getOneGoal);
router.get('/goals', goalsController.getGoals);


module.exports = router;