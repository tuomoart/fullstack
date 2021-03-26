const errorHandler = (error, request, response, next) => {

  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: 'invalid username'})
  }
}

module.exports = errorHandler