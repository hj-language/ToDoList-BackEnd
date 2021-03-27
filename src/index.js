const Koa = require('koa');
const Router = require('koa-router');
const mysql = require('mysql');
const dbInfo = require('./secret.js');
const app = new Koa();
const router = new Router();

const api = require('./api');

const conn = mysql.createConnection({
    host: dbInfo.host,
    user: dbInfo.user,
    password: dbInfo.password,
    database: dbInfo.database,
    port: dbInfo.port
});

conn.connect((err)=>{
    if(err){
        console.log(err);
    }else{
        console.log('connect success');
    }
})

router.use('/api', api.routes());

app.use(router.routes()).use(router.allowedMethods());
app.listen(process.env.PORT || 3000, () => {
    console.log('server is listening to port 3000');
});