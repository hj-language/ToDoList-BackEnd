const KoaRouter = require('koa-router');
const account = new KoaRouter();

const signup = require('./signup');
const signin = require('./signin');

account.post('/signup/id/', signup.idCheck);
account.post('/signup/email/', signup.emailCheck);
account.post('/signup/emailVerify/', signup.emailVerify);
account.post('/signup/', signup.signUp);

account.post('/signin/', signin.login);

module.exports = account;