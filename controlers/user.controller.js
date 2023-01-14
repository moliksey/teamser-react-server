const db = require('../db')
class UserController{
    async createUser(req, res){
        const {username, password}=req.body
        const newUser= await db.query('INSERT INTO t_user (password, username) values ($1, $2) returning *', [password, username]);
        res.json(newUser);
    }
    async getUsers(req, res){
        const users= await db.query('SELECT * FROM t_user');
        res.json(users.rows);
    }
    async getOneUser(req, res){
        const id=req.params.id
        const user= await db.query('SELECT * FROM t_user where id=$1', [id]);
        res.json(user.rows[0]);
    }
    async updateUser(req, res){
        const {id, username, password}=req.body
        if(typeof(username) == "undefined" || typeof(password) == "undefined")
            throw "You must give username and password";
        const updatedUser= await db.query('UPDATE t_user SET username=$1, password=$2 where id=$3 returning *', [username, password, id]);
        res.json(updatedUser);
    }
    async deleteUser(req, res){
        const id=req.params.id
        const userInfo= await db.query('SELECT * FROM t_user_information where id=$1', [id]);
        const avatar= await db.query('DELETE FROM t_avatars where id=$1', [userInfo.rows[0].preview_avatar_id]);
        const deletedUser=  await db.query('DELETE FROM t_user where id=$1', [id]);
        const deletedUserInformation= await db.query('DELETE FROM t_user_information where id=$1', [id]);
        res.json(deletedUser.rows[0]);
    }

}

module.exports = UserController;