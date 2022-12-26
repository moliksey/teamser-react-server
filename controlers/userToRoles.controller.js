const db = require('../db')
class UserToRolesController{
    async addRoleToUser(req, res){
        const {user_id, roles_id}=req.body
        const newUser= await db.query('INSERT INTO t_user_roles (user_id, roles_id) values ($1, $2) returning *', [user_id, roles_id]);
        res.json(newUser);
    }
    async getUsersRoles(req, res){
        const id=req.params.id
        const userRoles= await db.query('SELECT * FROM t_user_roles where user_id=$1', [id]);
        res.json(userRoles.rows);
    }
    async deleteUserRole(req, res){
        const {user_id, roles_id}=req.body
        const user= await db.query('DELETE FROM t_user_roles where user_id=$1 and roles_id=$2', [user_id, roles_id]);
        res.json(user.rows[0]);
    }

}

module.exports = UserToRolesController;