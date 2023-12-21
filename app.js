const express = require('express')

const app = express();
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const energyRouter = require('./routes/energy');

app.set('port', process.env.PORT || 4000);

// app.get('/', (req,res) => {
//     res.send("Nodejs Server is Running");
// });

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/user/energy", energyRouter.router);
app.use((req, res, next) => { // 기본경로나 /user말고 다른곳 진입했을경우 실행
    res.status(404).send('Not Found!!');
});

function initializeServer(){
    energyRouter.EnergyInitialize();
}

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
    initializeServer();
})