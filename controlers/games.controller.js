const db = require('../db')
const jwt = require('jsonwebtoken');

class GamesController {
    async getGames(req, res) {
        const game = await db.query('SELECT * FROM t_games');
        res.json(game.rows);
    }

    async getOneGame(req, res) {
        const id = req.params.id
        const game = await db.query('SELECT * FROM t_games where id=$1', [id]);
        res.json(game.rows[0]);
    }
}

module.exports = GamesController;