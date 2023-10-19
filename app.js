import { writeFileSync, existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { json } from 'node:stream/consumers'

const todoFile = 'todo.csv'
const main = () => {
	if (!existsSync(todoFile))
		writeFileSync(todoFile, '')

	createServer( async (req, res) => {
		res.writeHead(200, { 'Content-Type': 'application/json'})
		const url = new URL(req.url, 'http://localhost:3000')
			if (url.pathname === '/todos') {
			switch (req.method) {
				case 'GET':
					const todos = await getTodos()
					res.end(JSON.stringify(todos))
					break
				case 'POST':
					const task = await json(req)
					addTodo(task)
					break
				case 'PUT':
					const toggle = await json(req)
					toggleTodo(parseInt(url.searchParams.get('id')), toggle)
					break
				case 'DELETE':
					removeTodo(parseInt(url.searchParams.get('id')))
					break
			}
		}
		res.end()
	}).listen(3000, 'localhost')
}
main()

const getTodos = async () => {
	const todos = await readFile(todoFile, 'utf-8')
	if (todos === '')
		return []
	return todos.split('\n').map((todo) => JSON.parse(todo))
}

const addTodo = async (task) => {
	const todos = await getTodos()
	const id = Date.now()

	todos.push({id: id, title: task.title, completed: false})

	writeFile(todoFile, todos.map((todo) => JSON.stringify(todo)).join('\n'))
}

const toggleTodo = async (id, toggle) => {
	const todos = await getTodos()
	todos.map((todo) => {
		if (todo.id === id) todo.completed = toggle.completed === true ? true : false
		return todo
	})

	writeFile(todoFile, todos.map((todo) => JSON.stringify(todo)).join('\n'))
}

const removeTodo = async (id) => {
	const todos = await getTodos()

	writeFile(todoFile, todos.filter((todo) => todo.id !== id)
														.map((todo) => JSON.stringify(todo))
														.join('\n'))
}
