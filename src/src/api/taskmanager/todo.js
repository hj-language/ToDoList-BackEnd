const MyDB = require('../../connectWithDB.js')();
const conn = MyDB.init();
const jwt = require("jsonwebtoken");
const jwtKey = require('../../secret.js').jwtKey;
const atob = require('atob');

function parseJwt(token) {
	var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

function getIdInToken(token) {
	return parseJwt(token).id;
}

function verifyToken(token) {
	try {
		jwt.verify(token, jwtKey)
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
}

// USER 테이블에 id가 존재하는지 검사한다.
function isInUserDB(id) {
	let query = "SELECT * FROM USER WHERE userID=?;";
	return new Promise((resolve, reject) => {
		conn.query(query, [id], (err, rows) => {
			if (!err)
				// 에러가 없고, rows가 존재한다면(즉 id가 존재한다면)
				if (rows[0])
					resolve(true);
			reject(false);
		})
	})
}

async function isValidUser (token) {
	if (await verifyToken(token) && await isInUserDB(getIdInToken(token))) {
		return true;
	}
	return false;
}

// TODO 테이블에 내용을 저장한다.
function addIntoDB(todo, userid) {
	// todo 테이블 : userID, content, importance, deadline, classification, memo
	// todoID는 자동으로 증가되어 저장
	let query = "INSERT INTO TODO(userID, content, importance, deadline, classification, memo) VALUES(?, ?, ?, ?, ?, ?);"
	let {content, importance, deadline, classification, memo} = todo;
	let items = [userid, content, importance, deadline, classification, memo]
	
	return new Promise((resolve, reject) => {
		conn.query(query, items, (err, rows) => {
			if (!err)
				resolve(1103);
			else
				reject(0826);
		})
	})
}

// TODO 테이블에 todoID로 검색한다.
function searchInDB(todoID) {
	let query = "SELECT * FROM TODO WHERE todoID=?;";
	
	return new Promise((resolve, reject) => {
		conn.query(query, [todoID], (err, rows) => {
			if (!err)
				resolve(rows[0]);
			else
				reject();
		})
	})
}

// TODO 테이블에 todoID로 검색하여 삭제한다.
function deleteInDB(todoID) {
	let query = "DELETE FROM TODO WHERE todoID=?;";
	
	return new Promise((resolve, reject) => {
		conn.query(query, [todoID], (err, rows) => {
			if (!err)
				resolve(1103);
			else
				reject(0826);
		})
	})
}

// TODO 테이블에 todoID로 검색하여 수정한다.
function updateInDB(todoID, todo) {
	let query = "UPDATE TODO SET content=?, importance=?, deadline=?, classification=?, memo=? WHERE todoID=?;"
	let {content, importance, deadline, classification, memo} = todo;
	let items = [content, importance, deadline, classification, memo, todoID];
	
	return new Promise((resolve, reject) => {
		conn.query(query, items, (err, rows) => {
			if (!err) {
				resolve(1103);
			}
			else {
				console.log(err);
				reject(0826);
			}
		})
	})
}

// 객체가 비었는지 확인한다.
function isEmpty(param) {
	return Object.keys(param).length === 0;
}

exports.create = async (ctx) => {
	const token = ctx.request.body.token
	let code = 0826;
	
	// 토큰의 유효성과 존재하는 회원인지 검사 후 DB에 저장
	if (await isValidUser(token))
		code = await addIntoDB(ctx.request.body.todo, getIdInToken(token));
	
	ctx.body = {
		code: code
	}
};

exports.read = async (ctx) => {
	const token = ctx.request.body.token;
	let code = 0826;
	let todoContent = null;;
	
	if (await isValidUser(token)) {
		todoContent = await searchInDB(ctx.request.body.todoID);
		if (!isEmpty(todoContent)) {
			// userID는 제거하고 보내준다.
			delete todoContent.userID;
			code = 1103;
		}
			
	}
	
	ctx.body = {
		code: code,
		result: todoContent 
	}
};

exports.update = async (ctx) => {
	const token = ctx.request.body.token;
	let code = 0826;
	if (await isValidUser(token))
		code = await updateInDB(ctx.request.body.todoID, ctx.request.body.todo);
	
	ctx.body = {
		code: code
	}
};

exports.delete = async (ctx) => {
	const token = ctx.request.body.token;
	let code = 0826;
	
	if (await isValidUser(token))
		code = await deleteInDB(ctx.request.body.todoID);
	
	ctx.body = {
		code: code
	}
};