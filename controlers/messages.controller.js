const db = require('../db')
const jwt = require('jsonwebtoken');
const SECRET_WORD = require("../config");

class MessagesController {
    async createMessage(req, res) {
        const {text, dialog_id} = req.body
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], SECRET_WORD)
        const dialog = await db.query('SELECT * FROM t_dialogs where id=$1', [dialog_id]);
        if (decoded.userId == dialog.rows[0].user1_id || decoded.userId == dialog.rows[0].user2_id) {
            const newMessage = await db.query('INSERT INTO t_messages (date, is_read, text, user_id, dialog_id) values (now(), false, $1, $2, $3) returning *', [decoded.username + ": " + text, decoded.userId, dialog_id]);
            res.json(newMessage.rows);
        } else res.json("It\'s not your dialog")
    }

    async getMessagesFromDialog(req, res) {
        const id = req.params.id
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], SECRET_WORD)
        const dialog = await db.query('SELECT * FROM t_dialogs where id=$1', [id]);
        if (decoded.userId == dialog.rows[0].user1_id || decoded.userId == dialog.rows[0].user2_id) {
            const users = await db.query('SELECT * FROM t_messages where dialog_id=$1 order by date limit 100', [id]);
            res.json(users.rows);
        } else res.json('It\'s not your dialog')
    }

    async getLastMessageFromDialogs(req, res) {
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], SECRET_WORD)
        const dialogs = await db.query('SELECT * FROM t_dialogs where user1_id=$1 or user2_id=$1', [decoded.userId]);
        let lastMassages = []
        for (let i in dialogs.rows) {
            let a = await db.query('SELECT * FROM t_messages where dialog_id=$1 order by date DESC', [dialogs.rows[i].id]);
            lastMassages.push(a.rows[0]);
        }
        res.json(lastMassages);
    }

    async updateMessage(req, res) {
        const {id, is_read, text} = req.body
        if (typeof (text) == "undefined")
            throw "You must give text, user_id, dialog_id";
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], SECRET_WORD)
        const message = await db.query('DELETE FROM t_messages where id=$1 and user_id=$2', [id, decoded.userId]);
        if (message.rows[0]) {
            let updatedMessage;
            if (typeof (is_read) != "undefined") {
                updatedMessage = await db.query('UPDATE t_messages SET is_read=$1, text=$2 where id=$3 returning *', [is_read, text, id]);
            } else {
                updatedMessage = await db.query('UPDATE t_messages SET is_read=false, text=$1 where id=$2 returning *', [text, id]);
            }
            res.json(updatedMessage.rows);
        } else res.json("It\'s not your message")
    }

    async deleteMessage(req, res) {
        const id = req.params.id
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], SECRET_WORD)
        const message = await db.query('DELETE FROM t_messages where id=$1 and user_id=$2', [id, decoded.userId]);
        if (message.rows[0]) {
            const message = await db.query('DELETE FROM t_messages where id=$1', [id]);
            res.json(message.rows[0]);
        } else res.json("It\'s not your message")
    }

}

module.exports = MessagesController;