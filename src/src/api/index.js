const KoaRouter = require('koa-router');
const account = require('./account/index.js');
const todo = require('./taskmanager/index.js');
const api = new KoaRouter();

api.use('/account', account.routes());
api.use('/todo', todo.routes());
module.exports = api;