const logger = require('./utils/logger')
const app = require('./app')
const http = require('http')


const server = http.createServer(app)

const PORT = 3003
server.listen(PORT, () => {
  logger.info(`server running on port ${PORT}`)
})