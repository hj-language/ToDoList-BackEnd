const mysql = require('mysql');
const dbInfo = require('./secret.js');

const MyDB = () => {
	return {
		init:()=>{
			return mysql.createConnection({
				host: dbInfo.host,
				user: dbInfo.user,
				password: dbInfo.password,
				database: dbInfo.database,
				port: dbInfo.port
			})
		}
	}
};

module.exports = MyDB;