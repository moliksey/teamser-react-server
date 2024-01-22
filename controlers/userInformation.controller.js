const db = require('../db')
const jwt = require('jsonwebtoken');
const SECRET_WORD = require("../config");

class UserInformationController {
    async createUserInformation(req, res) {
        const {birthdate, discord, email, gender, name, steam, surname, vk} = req.body
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], SECRET_WORD)
        const newUserInformation = await db.query('INSERT INTO t_user_information (birthdate, discord, email, gender,name, preview_avatar_id, steam, surname, vk, id) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) returning *',
            [birthdate, discord, email, gender, name, null, steam, surname, vk, decoded.userId]);
        const updatedUser = await db.query('UPDATE t_user SET userinformation_id=$1 where id=$2 returning *', [decoded.userId, decoded.userId])

        res.json(newUserInformation.rows);
    }

    async getUsersUserInformation(req, res) {

        const id = req.params.id
        const userInformation = await db.query('SELECT * FROM t_user_information where id=$1', [id]);
        const user = await db.query('SELECT * FROM t_user where id=$1', [id]);
        res.json({userInfo:userInformation.rows[0],
        username:user.rows[0].username,
        userId:user.rows[0].id});
    }

    async getMyUsersUserInformation(req, res) {
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], SECRET_WORD)
        const userInformation = await db.query('SELECT * FROM t_user_information where id=$1', [decoded.userId]);
        res.json(userInformation.rows[0]);
    }

    async updateUserInformation(req, res) {

        let {birthdate, discord, email, gender, name, steam, surname, vk} = req.body
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], SECRET_WORD)
        const updatedUser = await db.query('UPDATE t_user_information SET birthdate=$1, discord=$2, email=$3, gender=$4, name=$5, steam=$6, surname=$7, vk=$8 where id=$9 returning *',
            [birthdate, discord, email, gender, name, steam, surname, vk, decoded.userId]);
        res.json(updatedUser.rows);

    }

    async deleteUserInformation(req, res) {
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], SECRET_WORD)
        const userInfo = await db.query('SELECT * FROM t_user_information where id=$1', [decoded.userId]);
        const avatar = await db.query('DELETE FROM t_avatars where id=$1', [userInfo.rows[0].preview_avatar_id]);
        const user = await db.query('DELETE FROM t_user_information where id=$1', [decoded.userId]);
        res.json(user.rows[0]);
    }

}

module.exports = UserInformationController;
