const db = require('../db')
class DialogController{
    async createDialog(req, res){
        const {user1_id, user2_id}=req.body
        const newDialog= await db.query('INSERT INTO t_dialogs (user1_id, user2_id) values ($1, $2) returning *', [user1_id, user2_id]);
        res.json(newDialog);
    }
    async getUsersDialogs(req, res){
        const id=req.params.id
        const user= await db.query('SELECT * FROM t_dialogs where user1_id=$1 or user2_id=$1', [id]);
        res.json(user.rows);
    }
    async deleteDialog(req, res){
        const id=req.params.id
        const message= await db.query('DELETE FROM t_messages where message_id=$1', [id]);
        const dialog= await db.query('DELETE FROM t_dialogs where id=$1', [id]);
        res.json({"deletedMessages":message.rows,"deletedDialogs":dialog.rows});
    }
}
module.exports = DialogController;