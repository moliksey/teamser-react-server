const db = require('../db')
const jwt = require('jsonwebtoken');
const passwordHash = require('password-hash');
const SECRET_WORD = require("../config");

class UserController {
    async createUser(req, res) {
        const {username, password} = req.body
        const passwordHashed = await passwordHash.generate(password);
        const users = await db.query('SELECT username FROM t_user WHERE username=$1', [username]);
        if(!users.rows[0]) {
            const newUser = await db.query('INSERT INTO t_user (password, username) values ($1, $2) returning *', [passwordHashed, username]);
            const newUserInformation = await db.query('INSERT INTO t_user_information (id) values ($1) returning *', [newUser.rows[0].id]);
            const updateUser = await db.query('UPDATE t_user SET userinformation_id=$1 where id=$2 returning *', [newUser.rows[0].id, newUser.rows[0].id]);

            res.json(true);
        } else {
            res.json(false);
        }
    }

    async getUsers(req, res) {
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], SECRET_WORD)
        const userRoles = await db.query('SELECT * FROM t_user_roles where user_id=$1', [decoded.userId]);
        if (userRoles.rows.length > 1 && (userRoles.rows[0].roles_id == 1 || userRoles.rows[1].roles_id == 1)) {
            const users = await db.query('SELECT * FROM t_user');
            res.json(users.rows);
        } else res.json("You\'re not admin");

    }

    async getOneUser(req, res) {
        const id = req.params.id
        const user = await db.query('SELECT * FROM t_user where id=$1', [id]);
        res.json(user.rows[0].username);
    }

    async getMyInformation(req, res) {

        if (req.headers.authorization.split(' ')[1] === 'null') {
            res.json({isLoggedIn: false})
        } else {
            const decoded = jwt.verify(req.headers.authorization.split(' ')[1], SECRET_WORD);

            const ans = {
                isLoggedIn: true,
                id: decoded.userId,
                username: decoded.username,
            }
            res.json(ans)
        }
    }

    async updateUser(req, res) {
        const {username, password} = req.body
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], SECRET_WORD)
        if (typeof (username) == "undefined" || typeof (password) == "undefined")
            throw "You must give username and password";
        const passwordHashed = await passwordHash.generate(password);
        const updatedUser = await db.query('UPDATE t_user SET username=$1, password=$2 where id=$3 returning *', [username, passwordHashed, decoded.userId]);
        res.json(updatedUser);
    }

    async deleteUser(req, res) {
        const id = req.params.id
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], SECRET_WORD)
        const userRoles = await db.query('SELECT * FROM t_user_roles where user_id=$1', [decoded.userId]);
        if (id == decoded.userId || (userRoles.rows.length > 1 && (userRoles.rows[0].roles_id == 1 || userRoles.rows[1].roles_id == 1))) {
            const userInfo = await db.query('SELECT * FROM t_user_information where id=$1', [id]);
            const avatar = await db.query('DELETE FROM t_avatars where id=$1', [userInfo.rows[0].preview_avatar_id]);
            const deletedUser = await db.query('DELETE FROM t_user where id=$1', [id]);
            const deletedUserInformation = await db.query('DELETE FROM t_user_information where id=$1', [id]);
            res.json(deletedUser.rows[0]);
        } else res.json("You can\'t delete this user");
    }

}

module.exports = UserController;
