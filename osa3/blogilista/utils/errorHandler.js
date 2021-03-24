const errorHandler = (error, request, response, next) => {
  console.error(`${error.name}: ${error.message}`)

  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: 'invalid username'})
  }
}

module.exports = errorHandler