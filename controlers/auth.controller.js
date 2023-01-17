const passwordHash = require('password-hash');
const db = require("../db");
const jwt = require('jsonwebtoken');
const SECRET_WORD = require("../config");
const generateAccessToken = (id, username) => {
    const payload = {
        userId: id,
        username: username
    }
    return jwt.sign(payload, SECRET_WORD, {expiresIn: "1h"})
}

class AuthController {

    async login(req, res) {
        const {username, password} = req.body
        const userRecord = await db.query('SELECT * FROM t_user where username=$1', [username]);
        if (!userRecord) {
            throw new Error('User not found')
        } else {
            const correctPassword = await passwordHash.verify(password, userRecord.rows[0].password);
            if (!correctPassword) {
                throw new Error('Incorrect password')
            }
        }
        const data = {
            _id: userRecord.rows[0].id,
            name: userRecord.rows[0].username,
        };

        const token = generateAccessToken(data._id, data.name);
        res.json(
            {
                user: userRecord.rows[0].username,
                token: token
            }
        )


    }

}


module.exports = AuthController;