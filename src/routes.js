import { Database } from './database.js'
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/task'),
    handler: (request, response) => {
      const { search } = request.query

      const task = database.select('task', search ? {
        title: search,
        description: search
      } : null)

      return response.end(JSON.stringify(task))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/task'),
    handler: (request, response) => {
      const { title, description } = request.body
      if (title === undefined || description === undefined) return response.writeHead(400).end(JSON.stringify('You need to put a title and a description'))
      const task = {
        id: randomUUID(),
        title,
        description,
        created_at: new Date(),
        completed_at: null,
        updated_at: new Date(),
      }

      database.insert('task', task)
      return response.writeHead(201).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/task/:id'),
    handler: (request, response) => {
      const { id } = request.params
      const { title, description } = request.body
      if (title === undefined || description === undefined) return response.writeHead(400).end(JSON.stringify('You need to put a title and a description'))
      const resp = database.update('task', id, {
        title: title,
        description: description,
      })
      if (resp === 'Task not found') return response.writeHead(400).end(JSON.stringify(resp))
      return response.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/task/:id'),
    handler: (request, response) => {
      const { id } = request.params
      const resp = database.delete('task', id)
      if (resp === 'Task not found') return response.writeHead(400).end(JSON.stringify(resp))
      return response.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/task/:id/complete'),
    handler: (request, response) => {
      const { id } = request.params
      const resp = database.complete('task', id)
      if (resp === 'Task not found') return response.writeHead(400).end(JSON.stringify(resp))
      return response.writeHead(204).end()
    }
  },
]