const db = require('../db')
const jwt = require('jsonwebtoken');
const SECRET_WORD = require("../config");

class DialogController {
    async createDialog(req, res) {
        const {user2_id} = req.body
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], SECRET_WORD)
        const dialog = await db.query('SELECT * FROM t_dialogs where (user1_id=$1 and user2_id=$2) or (user1_id=$2 and user2_id=$1)', [decoded.userId, user2_id]);
        if(dialog.rows.length>0)
            res.json(dialog.rows[0])
        else{
        const newDialog = await db.query('INSERT INTO t_dialogs (user1_id, user2_id) values ($1, $2) returning *', [decoded.userId, user2_id]);
        res.json(newDialog.rows[0]);}
    }

    async getUsersDialogs(req, res) {
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], SECRET_WORD)
        const dialog = await db.query('SELECT * FROM t_dialogs where user1_id=$1 or user2_id=$1', [decoded.userId]);
        let index=0;
        let ans=[];
        for (index = 0; index < dialog.rows.length; ++index) {
            let op;
            if(dialog.rows[index].user1_id==decoded.userId)
                op= await db.query('SELECT * FROM t_user where id=$1', [dialog.rows[index].user2_id]);
            else
                op = await db.query('SELECT * FROM t_user where id=$1', [dialog.rows[index].user1_id]);
            let lastMessage=await db.query('SELECT * FROM t_messages where dialog_id=$1 order by date DESC', [dialog.rows[index].id]);
            let ansStruct={
                id:dialog.rows[index].id,
                opname:op.rows[0].username,
                date: lastMessage.rows[0].date,
                text: lastMessage.rows[0].text
            }
            ans.push(ansStruct);
        }
        res.json(ans);
    }

    async deleteDialog(req, res) {
        const id = req.params.id
        //const message= await db.query('DELETE FROM t_messages where dialog_id=$1', [id]);
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], SECRET_WORD)
        const dialog = await db.query('DELETE FROM t_dialogs where id=$1 and (user1_id=$2 or user2_id=$2)', [id, decoded.userId]);
        res.json({"deletedDialogs": dialog.rows});
    }
}

module.exports = DialogController;