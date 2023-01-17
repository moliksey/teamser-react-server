const db = require('../db')
const jwt = require('jsonwebtoken');
const SECRET_WORD = require('../config')

class GoalsController {
    async getGoals(req, res) {
        const game = await db.query('SELECT * FROM t_goals');
        res.json(game.rows);
    }

    async getOneGoal(req, res) {
        const id = req.params.id
        const game = await db.query('SELECT * FROM t_goals where id=$1', [id]);
        res.json(game.rows[0]);
    }


}

module.exports = GoalsController;