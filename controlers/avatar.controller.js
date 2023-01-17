const db = require('../db')
const jwt = require('jsonwebtoken');
const SECRET_WORD = require("../config");

class AvatarController {
    async createAvatar(req, res) {
        const {bytes, content_type, is_preview_image, nameAvatar, original_file_name, size} = req.body
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], SECRET_WORD)
        const userInformation = await db.query('select * from t_user_information where id=$1', [decoded.userId])
        if (userInformation.rows[0] == null) {
            res.json("There are no user information with id " + decoded.userId);
        } else {
            const avatar = await db.query('INSERT INTO t_avatars (bytes, content_type, is_preview_image, name, original_file_name, size) values ($1, $2, $3, $4, $5, $6) returning *',
                [bytes, content_type, is_preview_image, nameAvatar, original_file_name, size]);
            const updatedUserInformation = await db.query('UPDATE t_user_information SET preview_avatar_id=$1 where id=$2 returning *', [avatar.rows[0].id, decoded.userId])
            res.json(avatar);
        }
    }

    async getUsersAvatar(req, res) {
        const id = req.params.id
        const userInfo = await db.query('SELECT * FROM t_user_information where id=$1', [id]);
        const avatar = await db.query('SELECT * FROM t_avatars where id=$1', [userInfo.rows[0].preview_avatar_id]);
        res.json(avatar.rows[0]);
    }

    async updateAvatar(req, res) {
        const {bytes, content_type, is_preview_image, nameAvatar, original_file_name, size} = req.body
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], SECRET_WORD)
        const userInfo = await db.query('SELECT * FROM t_user_information where id=$1', [decoded.userId]);
        const updatedAvatar = await db.query('update t_avatars set bytes=$1, content_type=$2, is_preview_image=$3, name=$4, original_file_name=$5, size=$6 where id=$7  returning *',
            [bytes, content_type, is_preview_image, nameAvatar, original_file_name, size, userInfo.rows[0].preview_avatar_id]);
        res.json(updatedAvatar.rows[0]);
    }

    async deleteUsersAvatar(req, res) {
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], SECRET_WORD)
        const userInfo = await db.query('SELECT * FROM t_user_information where id=$1', [decoded.userId]);
        const user = await db.query('DELETE FROM t_avatars where id=$1', [userInfo.rows[0].preview_avatar_id]);
        res.json(user.rows[0]);
    }

}

module.exports = AvatarController;