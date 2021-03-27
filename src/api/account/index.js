const Router = require('koa-router');
const account = new Router();

const signup = require('./signup');
const signin = require('./signin');

account.post('/signup/', signup.post);
account.get('/signin/', signin.post);

module.exports = account;