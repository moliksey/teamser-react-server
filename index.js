const Express = require('express');

const userRouter= require('./routes/user.routes')
const adRouter= require('./routes/ad.routes')
const avatarRouter= require('./routes/avatar.routes')
const dialogRouter= require('./routes/dialog.routes')
const gamesRouter= require('./routes/games.routes')
const goalsRouter= require('./routes/goals.routes')
const messagesRouter= require('./routes/messages.routes')
const roleRouter= require('./routes/role.routes')
const userInformationRouter= require('./routes/userInformation.routes')
const userToRolesRouter= require('./routes/userToRoles.routes')




const app = new Express();

//app.use((ctx, next)=>{
//    ctx.body='hello world';
//});
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


app.listen(3000);