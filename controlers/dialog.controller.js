const db = require('../db')
const jwt = require('jsonwebtoken');
const SECRET_WORD = require("../config");

class DialogController {
    async createDialog(req, res) {
        const {user2_id} = req.body
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], SECRET_WORD)
        const newDialog = await db.query('INSERT INTO t_dialogs (user1_id, user2_id) values ($1, $2) returning *', [decoded.userId, user2_id]);
        res.json(newDialog);
    }

    async getUsersDialogs(req, res) {
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], SECRET_WORD)
        const user = await db.query('SELECT * FROM t_dialogs where user1_id=$1 or user2_id=$1', [decoded.userId]);
        res.json(user.rows);
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