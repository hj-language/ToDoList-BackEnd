const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

const api = require('./api');
	
router.get('/', (ctx)=> {
    ctx.body = "Hello";
})

router.use('/api', api.routes());

app.use(router.routes()).use(router.allowedMethods());
app.listen(process.env.PORT || 3000, () => {
    console.log('server is listening to port 3000');
});