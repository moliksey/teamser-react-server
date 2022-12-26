const db = require('../db')
class UserInformationController{
    async createUserInformation(req, res){
        const {user_id, age, discord, email, gender, name, steam, surname, vk}=req.body
        const newUserInformation= await db.query('INSERT INTO t_user_information (age, discord, email, gender,name, preview_avatar_id, steam, surname, vk, id) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) returning *',
            [age, discord, email, gender, name, null, steam, surname, vk, user_id]);
        const updatedUser = await db.query('UPDATE t_user SET userinformation_id=$1 where id=$2 returning *', [user_id, user_id ])

        res.json(newUserInformation.rows);
    }

    async getUsersUserInformation(req, res){
        const id=req.params.id
        const userInformation= await db.query('SELECT * FROM t_user_information where id=$1', [id]);
        res.json(userInformation.rows[0]);
    }
    async updateUserInformation(req, res){
        const {id, age, discord, email, gender, name, preview_avatar_id, steam, surname, vk}=req.body
        if(typeof(id) == "undefined")
            throw "You must give an id";
        const updatedUser= await db.query('UPDATE t_user_information SET age=$1, discord=$2, email=$3, gender=$4, name=$5, preview_avatar_id=$6, steam=$7, surname=$8, vk=$9 where id=$10 returning *',
            [age, discord, email, gender, name, preview_avatar_id, steam, surname, vk, id]);
        res.json(updatedUser);
    }
    async deleteUserInformation(req, res){
        const id=req.params.id
        const user= await db.query('DELETE FROM t_user_information where id=$1', [id]);
        res.json(user.rows[0]);
    }

}

module.exports = UserInformationController;