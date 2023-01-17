const db = require('../db')
const jwt = require('jsonwebtoken');
const SECRET_WORD = require("../config");

class UserToRolesController {
    async addRoleToUser(req, res) {
        const {user_id, roles_id} = req.body
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], SECRET_WORD)
        const userRoles = await db.query('SELECT * FROM t_user_roles where user_id=$1', [decoded.userId]);
        if (userRoles.rows.length > 1 && (userRoles.rows[0].roles_id == 1 || userRoles.rows[1].roles_id == 1)) {
            const newUser = await db.query('INSERT INTO t_user_roles (user_id, roles_id) values ($1, $2) returning *', [user_id, roles_id]);
            res.json(newUser);
        } else res.json("You\'re not admin");
    }

    async getUsersRoles(req, res) {
        const id = req.params.id
        const userRoles = await db.query('SELECT * FROM t_user_roles where user_id=$1', [id]);
        res.json(userRoles.rows);
    }

    async deleteUserRole(req, res) {
        const {user_id, roles_id} = req.body
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], SECRET_WORD)
        const userRoles = await db.query('SELECT * FROM t_user_roles where user_id=$1', [decoded.userId]);
        if (userRoles.rows.length > 1 && (userRoles.rows[0].roles_id == 1 || userRoles.rows[1].roles_id == 1)) {
            const user = await db.query('DELETE FROM t_user_roles where user_id=$1 and roles_id=$2', [user_id, roles_id]);
            res.json(user.rows[0]);
        } else res.json("You\'re not admin");
    }


}

module.exports = UserToRolesController;