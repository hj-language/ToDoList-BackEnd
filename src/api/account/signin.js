const MyDB = require('../../db_con.js')();
const connection = MyDB.init();

const severTest = () => {
	return new Promise ((resolve, reject) => {
		connection.query('SELECT * FROM USER;', (err, rows, fields) => {
			if(!err) {
				console.log('rows', rows);
				resolve(rows[0]);
			} else {
				console.log(err)
			}
		})
	})
}

exports.login = async(ctx) => {
	console.log('login')
	ctx.body = await severTest();
}