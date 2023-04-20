import http from 'node:http'

const server = http.createServer(async (request, response) => {
  const buffer = []

  for await (const chunk of request) {
    buffer.push(chunk)
  }

  const fullStreamContent = Buffer.concat(buffer).toString()
  console.log(fullStreamContent)
})

server.listen(5432)