const MyDB = require('../../connectWithDB.js')();
const conn = MyDB.init(); // DB와 연결
const nodemailer = require('nodemailer'); 
const serverEmail = require('../../secret.js').emailInfo; 
const hash = require('../../hash.js').hash;



// 이메일 인증 코드를 생성하는 함수
function createEmailVerifyCode() {
	
	// 랜덤으로 6자리 난수로 이루어진 인증 코드를 생성한다.
	// 6자리이기 때문에 100000 이상 999999 이하로 설정한다.
	return Math.floor(Math.random()*(999999 - 100000 + 1)) + 100000;	
}



// client_email에 verify_code를 담은 인증메일을 발송하는 함수
function sendMail(client_email, verify_code) {
	
	const mailOption = {
		from: serverEmail.auth.user,
		to: client_email,
		subject: "이메일 인증 요청 메일입니다.",
		html: "<p> 인증번호는 <b>"+verify_code+"</b> 입니다.</p>"
	}
	
	return new Promise((resolve, reject) => {
		nodemailer.createTransport(serverEmail).sendMail(mailOption, (err, res)=> {
			if (!err) {
				console.log("Send email Success");
				resolve(1103);
			}
			else {
				console.log(err);
				reject(0826);
			}
		});
	});
}



// 테이블명, 조건, 값으로 db에 검색하는 함수
function checkWithDB(table, cond, cont, cond2, cont2) {
	
	let query = "SELECT * FROM "+table+" WHERE "+cond+"='"+cont+"'";
	if (cond2) {
		query = query+" AND "+cond2+"='"+cont2+"'";
	}
	query = query+";";
	
	console.log(query);
	
	return new Promise ((resolve, reject) => {
		
		// db에 query 전달하여 연결한다.
		conn.query(query, (err, rows) => {
			
			// 연결 성공 시 검색 결과를 반환한다.(검색 결과 존재 여부와 무상관)
			// 검색 결과가 존재하지 않다면 빈 리스트가 반환된다.
			if (!err) {
				console.log("Connect Success");
				resolve(rows[0]);
			}
			else {
				console.log(err);
			}
		});
	});
}



// USER 테이블에 회원 정보를 저장하는 함수
function insertUserInfo(id, pw, name, email) {
	pw = hash(pw);	
	return new Promise((resolve, reject) => {
		conn.query("INSERT INTO USER VALUES(?, ?, ?, ?)", [id, pw, name, email], (err, rows) => {
			if (!err) {
				console.log("Insert userInfo Success");
				resolve(1103);
			}
			else  {
				console.log(err);
				reject(0826);
			}
		});
	});
}



// VERIFY 테이블에 이메일과 인증 번호를 저장하는 함수
function insertEmailInfo(email, code) {
	return new Promise((resolve, reject) => {
		conn.query("INSERT INTO VERIFY VALUES(?, ?)", [email, code], (err, rows) => {
			if (!err) {
				console.log("Insert emailInfo Success");
				resolve(1103);
			}
			else {
				console.log(err);
				reject(0826);
			}
		})
	});
}



// VERIFY 테이블에 저장된 email 필드를 삭제하는 함수
function deleteEmailInfo(email) {
	
	const query = "DELETE FROM VERIFY WHERE Email=?;";
	
	return new Promise((resolve, reject) => {
		conn.query(query, [email], (err, rows) => {
			if (!err) {
				console.log("Delete emailInfo Success");
				resolve(1103);
			}
			else {
				console.log(err);
				reject(0826);
			}
		})
	})
}


// 아이디 중복확인 함수
exports.idCheck = async (ctx) => {
	
	const client_id = ctx.request.body.id;
	const db_id = await checkWithDB("USER", "userID", client_id);
	
	let code = 0826;
	
	// 요청한 id가 db에 존재하지 않으면 성공
	if (!db_id) 
		code = 1103;
	
	ctx.body = {
		code: code
	};
	
};



// 이메일 중복확인 함수
exports.emailCheck = async (ctx) => {
	
	const client_email = ctx.request.body.email;
	const db_email = await checkWithDB("USER", "userEMAIL", client_email);
	
	let code = 0826;
	
	// 요청한 email이 db에 존재하지 않으면 인증메일 발송
	if (!db_email) {
		
		// 이메일 인증코드 생성
		const email_verify_code = createEmailVerifyCode();
		
		// 이메일 발송에 성공했다면 DB에 저장
		if (await sendMail(client_email, email_verify_code) === 1103) {
			await deleteEmailInfo(client_email);
			code = await insertEmailInfo(client_email, email_verify_code);
		}
	};
	
	ctx.body = {
		code: code
	};
};



// 이메일 인증 함수
exports.emailVerify = async (ctx) => {
	
	const client_email = ctx.request.body.email;
	const client_code = ctx.request.body.code;
	const db_code = await checkWithDB("VERIFY", "EMAIL", client_email, "Code", client_code);
	
	let code = 0826;
	
	// 요청한 email, code가 db에 저장된 내용과 일치하면 성공
	if (db_code) {
		// email과 관련된 데이터를 db로부터 삭제
		code = await deleteEmailInfo(client_email);
	}
	
	ctx.body = {
		code: code
	};
};



// 회원가입
exports.signUp = async (ctx) => {
	
	const id = ctx.request.body.id;
	const pw = ctx.request.body.pw;
	const name = ctx.request.body.name;
	const email = ctx.request.body.email;
	
	// 회원정보를 db에 저장하고, code를 받아옴
	let code = await insertUserInfo(id, pw, name, email);
	
	ctx.body = {
		code: code
	};
};