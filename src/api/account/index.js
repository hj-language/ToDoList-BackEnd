const Router = require('koa-router');
const account = new Router();

const signup = require('./signup');
const signin = require('./signin');

account.post('/signup/id/', signup.idCheck);
account.post('/signup/email/', signup.emailDoubleCheck);
account.post('/signup/certification/', signup.emailCertification);
account.post('/signup/', signup.signUp);

account.get('/signin/login/', signin.login);

module.exports = account;