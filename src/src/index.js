const Koa = require('koa');
const KoaRouter = require('koa-router');
const bodyParser = require('koa-bodyparser');
const mysql = require('mysql');
const dbInfo = require('./secret.js');
const app = new Koa();
const router = new KoaRouter();

const api = require('./api/index.js');

router.get('/', (ctx)=> {
    ctx.body = "Hello";
});

router.use('/api', api.routes());

app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => console.log('Server Started...'));