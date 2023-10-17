import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'

const csvToJSON = (csvLines) => {
	let todo = {}

	for (csvLine of csvLines)
	}
	return JSON.stringify(todo)
}

createServer(async (req, res) => {
	res.writeHead(200, { 'Content-Type': 'application/json' });
	const todoList = await readFile('todo.csv', 'utf-8').split('\n')
	const todoListJSON = csvToJSON(todoList)

	res.end(todoListJSON)
}).listen(3000, 'localhost')
