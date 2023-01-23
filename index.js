const Express = require('express');
const passport = require('passport');
const http = require("http");
const userRouter = require('./routes/user.routes')
const adRouter = require('./routes/ad.routes')
const avatarRouter = require('./routes/avatar.routes')
const dialogRouter = require('./routes/dialog.routes')
const gamesRouter = require('./routes/games.routes')
const goalsRouter = require('./routes/goals.routes')
const messagesRouter = require('./routes/messages.routes')
const roleRouter = require('./routes/role.routes')
const userInformationRouter = require('./routes/userInformation.routes')
const userToRolesRouter = require('./routes/userToRoles.routes')
const authRouter = require('./routes/auth.routes')
const { Server } = require("socket.io");
const onConnection=require ('./socket_io/onConnection.js')
const cors = require('cors')
const db = require("./db");
const jwt = require("jsonwebtoken");
const SECRET_WORD = require("./config");
const ALLOWED_ORIGIN = 'http://localhost:3000'
const app = new Express();

//app.use((ctx, next)=>{
//    ctx.body='hello world';
//});
app.use(cors())
app.use(Express.json())
app.use('/api', userRouter)
app.use('/api', adRouter)
app.use('/api', avatarRouter)
app.use('/api', dialogRouter)
app.use('/api', gamesRouter)
app.use('/api', goalsRouter)
app.use('/api', messagesRouter)
app.use('/api', roleRouter)
app.use('/api', userInformationRouter)
app.use('/api', userToRolesRouter)
app.use('/api', authRouter)
app.use(passport.initialize())
require('./middlewares/authJwtMiddleware')(passport)


/////////////////////////////////////////////////////////////////
const server = http.createServer(app)

const io = new Server(server,{
    cors: {
        origin: '*'
    }
})

io.on('connect',(socket) => {
    console.log('IO CONN')
    socket.on("get messages", async (data)=>{
        if(data.authorization.split(' ')[1]!=''){
        const decoded = jwt.verify(data.authorization.split(' ')[1], SECRET_WORD)
        let dialog = await db.query('SELECT * FROM t_dialogs where id=$1', [data.dialogId]);
        if(dialog.rows[0].user1_id==decoded.userId ||dialog.rows[0].user2_id==decoded.userId)
        {let messages = await db.query('SELECT * FROM t_messages where dialog_id=$1 order by date limit 100', [data.dialogId]);
            socket.join(data.dialogId);
        io.to(data.dialogId).emit("get messages",{user: decoded.userId, messages: messages.rows})}
        else{
            io.emit("get messages",{messages: null})
        }}
        else io.emit("get messages",{messages: null})
    })
    socket.on("addMessage", async (data)=>{
        const decoded = jwt.verify(data.authorization.split(' ')[1], SECRET_WORD)
        const newMessage = await db.query('INSERT INTO t_messages (date, is_read, text, user_id, dialog_id) values (now(), false, $1, $2, $3) returning *', [decoded.username + ": " + data.text, decoded.userId, data.dialogId]);
        let messages = await db.query('SELECT * FROM t_messages where dialog_id=$1 order by date limit 100', [data.dialogId]);
        io.to(data.dialogId).emit("addMessage", {user: decoded.userId, messages: messages.rows})
    })
    socket.on("delMessage", async (data)=>{
        const decoded = jwt.verify(data.authorization.split(' ')[1], SECRET_WORD)
        const message = await db.query('SELECT * FROM t_messages where id=$1 and user_id=$2', [data.id, decoded.userId]);
        let delMsg
        if (message.rows[0]!='')
             delMsg= await db.query('DELETE FROM t_messages where id=$1', [data.id]);
        let messages = await db.query('SELECT * FROM t_messages where dialog_id=$1 order by date limit 100', [data.dialogId]);
        io.to(data.dialogId).emit("delMessage", {user: decoded.userId,messages: messages.rows})
    })
    socket.on("updateMessage", async (data)=>{
        const decoded = jwt.verify(data.authorization.split(' ')[1], SECRET_WORD)
        const message = await db.query('SELECT * FROM t_messages where id=$1 and user_id=$2', [data.id, decoded.userId]);
        let delMsg
        if (message.rows[0])
            delMsg= await db.query('UPDATE t_messages SET text=$1 where id=$2 returning *', [decoded.username + ": "+data.text, data.id]);
        let messages = await db.query('SELECT * FROM t_messages where dialog_id=$1 order by date limit 100', [data.dialogId]);
        io.to(data.dialogId).emit("updateMessage", {user: decoded.userId,messages: messages.rows})
    })
})

const PORT = process.env.PORT || 3000

server.listen(PORT);