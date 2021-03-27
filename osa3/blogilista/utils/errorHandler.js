const errorHandler = (error, request, response, next) => {

  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: 'invalid username'})
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })
  }
}

module.exports = errorHandler