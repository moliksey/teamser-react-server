const db = require('../db')
class AvatarController{
    async createAvatar(req, res) {
        const {userInformation_id, bytes, content_type, is_preview_image, nameAvatar, original_file_name, size}=req.body
        const userInformation = await db.query('select * from t_user_information where id=$1', [ userInformation_id ])
        if(userInformation.rows[0]==null)
        {    res.json("There are no user information with id "+userInformation_id);}
        else{
        const avatar = await db.query('INSERT INTO t_avatars (bytes, content_type, is_preview_image, name, original_file_name, size) values ($1, $2, $3, $4, $5, $6) returning *',
        [bytes, content_type, is_preview_image, nameAvatar, original_file_name, size]);
        const updatedUserInformation = await db.query('UPDATE t_user_information SET preview_avatar_id=$1 where id=$2 returning *', [ avatar.rows[0].id, userInformation_id ])
        res.json(avatar);}
    }
    async getUsersAvatar(req, res){
        const id=req.params.id
        const userInfo= await db.query('SELECT * FROM t_user_information where id=$1', [id]);
        const avatar= await db.query('SELECT * FROM t_avatars where id=$1', [userInfo.rows[0].preview_avatar_id]);
        res.json(avatar.rows[0]);
    }
    async updateAvatar(req, res){
        const {id, bytes, content_type, is_preview_image, nameAvatar, original_file_name, size}=req.body
        if(typeof(id) == "undefined")
        { res.json("You must give an id");}
        else
        {const updatedAvatar= await db.query('update t_avatars set bytes=$1, content_type=$2, is_preview_image=$3, name=$4, original_file_name=$5, size=$6 where id=$7  returning *',
            [bytes, content_type, is_preview_image, nameAvatar, original_file_name, size, id]);
        res.json(updatedAvatar.rows[0]);}
    }
    async deleteUsersAvatar(req, res){
        const id=req.params.id
        const userInfo= await db.query('SELECT * FROM t_user_information where id=$1', [id]);
        const user= await db.query('DELETE FROM t_avatars where id=$1', [userInfo.rows[0].preview_avatar_id]);
        res.json(user.rows[0]);
    }

}

module.exports = AvatarController;