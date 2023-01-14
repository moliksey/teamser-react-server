const db = require('../db')
class MessagesController{
    async createMessage(req, res){
        const { text, user_id, dialog_id}=req.body
        const newMessage= await db.query('INSERT INTO t_messages (date, is_read, text, user_id, dialog_id) values (now(), false, $1, $2, $3) returning *', [ text, user_id, dialog_id]);
        res.json(newMessage.rows);
    }
    async getMessagesFromDialog(req, res){
        const id=req.params.id
        const users= await db.query('SELECT * FROM t_messages where dialog_id=$1 order by date limit 100', [id]);
        res.json(users.rows);
    }
    async getLastMessageFromDialogs(req, res){
        const dialog_id=req.body.dialog_id
        let lastMassages=[]
        for (let i in dialog_id){
            let a= await db.query('SELECT * FROM t_messages where dialog_id=$1 order by date DESC', [dialog_id[i]]);
            lastMassages.push(a.rows[0]);
        }
        res.json(lastMassages);
    }
    async updateMessage(req, res){
        const {id, is_read, text}=req.body
        if(typeof(text) == "undefined" )
            throw "You must give text, user_id, dialog_id";
        let updatedMessage;
        if(typeof(is_read) != "undefined" ) {
            updatedMessage = await db.query('UPDATE t_messages SET is_read=$1, text=$2 where id=$3 returning *', [is_read, text, id]);
        }else {
            updatedMessage = await db.query('UPDATE t_messages SET is_read=false, text=$1 where id=$2 returning *', [text, id]);
        }
        res.json(updatedMessage.rows);
    }
    async deleteMessage(req, res){
        const id=req.params.id
        const message= await db.query('DELETE FROM t_messages where id=$1', [id]);
        res.json(message.rows[0]);
    }

}
module.exports = MessagesController;