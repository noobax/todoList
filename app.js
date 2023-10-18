import { createServer } from 'node:http'
import { readFile, writeFile } from 'node:fs/promises'
import { json } from 'node:stream/consumers'
import { existsSync, writeFileSync } from 'node:fs'

const getTodos = async (file) => {
	let todos = []
	const todoListCsv = await readFile('todos.csv', 'utf-8')
	todos = todoListCsv.split('\n')
//	todos.pop()

	return todos.map((e) => JSON.parse(e))
}

const addTodo = async (file, todo) => {
	const items = await getTodos(file)
	const item = {id: (Date.now()), task: todo, done: false}

	items.push(item)
	writeFile(file, items.map((e) => JSON.stringify(e)).join('\n'))
}

const editTodo = async (file, id, todoDone) => {
	const items = await getTodos(file)
	let newTodo = {}

	for (let item of items) {
		console.log(item['id'] == id)
		if (item['id'] == id) {
			item['done'] = todoDone['done'] === true ? true : false
			newTodo = item
		}
	}
	writeFile(file, items.map((e) => JSON.stringify(e)).join('\n'))
	return newTodo
}

const removeTodo = async (file, id) => {
	const items = await getTodos(file)

	
	const newItems = items.filter((item) => item['id'] != id)
	console.log(newItems)
	writeFile(file, newItems.map((e) => JSON.stringify(e)).join('\n'))
	return newItems
}


createServer(async (req, res) => {

	res.writeHead(200, { 'Content-Type': 'application/json' })
	const url = new URL(req.url, 'http://localhost:3000')
	const todoFile = 'todos.csv'
	/*
	if (!existsSync(todoFile))
		writeFileSync(todoFile, '', {flag:'w+'})
	*/
	if (url.pathname === '/todos') {
		switch (req.method) {
			case 'GET':
				res.end(JSON.stringify(await getTodos(todoFile)))
				break;
			case 'POST':
				const data = await json(req)
				addTodo(todoFile, data)
				res.end(JSON.stringify(data))
				break;
			case 'PUT':
				const data2 = await json(req)
				const id = url.searchParams.get('id')
				const newTodo = await editTodo(todoFile, id, data2)
				res.end(JSON.stringify(newTodo))
				break
			case 'DELETE':
				const id2 = url.searchParams.get('id')
				removeTodo(todoFile, id2)
				res.end('done')
				break;
			default:
				break;
		}
	}
}).listen(3000, 'localhost')
