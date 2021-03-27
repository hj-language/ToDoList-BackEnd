const Router = require('koa-router');
const router = new Router();
const account = require('./account')

router.use('/account', account.routes());
module.exports = router;