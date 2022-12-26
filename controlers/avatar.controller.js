const db = require('../db')
class AvatarController{
    async createAvatar(req, res) {
        const {userInformation_id, bytes, content_type, is_preview_image, nameAvatar, original_file_name, size}=req.body
        const avatar = await db.query('INSERT INTO t_avatars (bytes, content_type, is_preview_image, name, original_file_name, size, userinformation_id) values ($1, $2, $3, $4, $5, $6, $7) returning *',
            [bytes, content_type, is_preview_image, nameAvatar, original_file_name, size, userInformation_id]);
        const updatedUserInformation = await db.query('UPDATE t_user_information SET preview_avatar_id=$1 where id=$2 returning *', [userInformation_id, avatar.id ])
        res.json(avatar);
    }
    async getUsersAvatar(req, res){
        const id=req.params.id
        const avatar= await db.query('SELECT * FROM t_avatars where id=$1', [id]);
        res.json(avatar.rows[0]);
    }
    async updateAvatar(req, res){
        const {id, bytes, content_type, is_preview_image, nameAvatar, original_file_name, size}=req.body
        if(typeof(id) == "undefined")
            throw "You must give an id";
        const updatedAvatar= await db.query('update t_avatars set bytes=$1, content_type=$2, is_preview_image=$3, nameAvatar=$4, original_file_name=$5, size=$6 where id=$7  returning *',
            [bytes, content_type, is_preview_image, nameAvatar, original_file_name, size, id]);
        res.json(updatedAvatar);
    }
    async deleteUsersAvatar(req, res){
        const id=req.params.id
        const user= await db.query('DELETE FROM t_avatars where id=$1', [id]);
        res.json(user.rows[0]);
    }

}

module.exports = AvatarController;