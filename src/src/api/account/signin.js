const MyDB = require('../../connectWithDB.js')();
const conn = MyDB.init(); 
const hash = require('../../hash.js').hash;
const jwt = require("jsonwebtoken");
const jwtKey = require('../../secret.js').jwtKey;

function checkWithDB(id) {
	let query = "SELECT * FROM USER WHERE userID=?;";
	return new Promise ((resolve, reject) => {
		conn.query(query, [id], (err, rows) => {
			
			if (!err) {
				console.log("Connect Success");
				resolve(rows[0]);
			}
			else {
				console.log(err);
			}
		})
	})
}

function createToken(id) {
	let token = jwt.sign({
		id: id
	},
	jwtKey,
	{
		expiresIn: '30m'
	})
	return token;
}

// 로그인
exports.login = async (ctx) => {
	
	const id = ctx.request.body.id;
	let pw = ctx.request.body.pw;
	let code = 0826;
	let token;
	
	let user = await checkWithDB(id);
	
	if (user) {
		pw = hash(pw);
		
		if (pw === user.userPW) {
			token = await createToken(id);
			code = 1103;
		}
	} 
	
	ctx.body = {
		code: code,
		result: {
			token: token
		}
	}
}