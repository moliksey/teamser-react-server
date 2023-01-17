const db = require('../db')
const jwt = require('jsonwebtoken');
const SECRET_WORD = require("../config");

class RoleController {
    async getRoles(req, res) {
        const role = await db.query('SELECT * FROM t_role');
        res.json(role.rows);
    }

    async getOneRole(req, res) {
        const id = req.params.id
        const role = await db.query('SELECT * FROM t_role where id=$1', [id]);
        res.json(role.rows[0]);
    }
}

module.exports = RoleController;