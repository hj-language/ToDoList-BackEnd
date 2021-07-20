const crypto = require('crypto');
const hashing_key = require('./secret.js').hashingKey;

exports.hash = (pw) => {
	return crypto.createHmac('sha256', hashing_key).update(pw).digest('hex').slice(0,60);
}