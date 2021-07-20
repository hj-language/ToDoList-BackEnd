const KoaRouter = require('koa-router');
const taskmanager = new KoaRouter();

const todo = require('./todo.js')

taskmanager.post('/', todo.create); 	// Create
taskmanager.get('/', todo.read); 		// Read
taskmanager.put('/', todo.update); 		// Update
taskmanager.delete('/', todo.delete); 	// Delete

module.exports = taskmanager;