import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf8')
      .then(data => { this.#database = JSON.parse(data) })
      .catch(() => { this.#persist() })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table, search) {
    let data = this.#database[table] ?? []

    if (search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase())
        })
      })
    }
    return data
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) this.#database[table].push(data)
    else this.#database[table] = [data]

    this.#persist()
    return data
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)
    const task = this.#database[table][rowIndex] ?? []
    const created_at = task.created_at
    const completed_at = task.completed_at
    const updated_at = new Date()
    
    if (rowIndex > -1) {
      this.#database[table][rowIndex] = { id, ...data, created_at, completed_at, updated_at }
      this.#persist()
    } else { return 'Task not found' }
  }

  complete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)
    const task = this.#database[table][rowIndex] ?? []
    const created_at = task.created_at
    const completed_at = new Date()
    const updated_at = new Date()
    const title = task.title
    const description = task.description

    if (rowIndex > -1) {
      this.#database[table][rowIndex] = { id, title, description, created_at, completed_at, updated_at }
      this.#persist()
    } else { return 'Task not found' }
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)
      this.#persist()
    } else { return 'Task not found' }
  }
}