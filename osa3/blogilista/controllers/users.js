const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response, next) => {
  const body = request.body

  if (!body.password || body.password.length < 3) {
    return response.status(400).json({ error: "invalid password"})
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save().catch(error => next(error))

  response.json(savedUser)
})

usersRouter.get('/', async (request, response, next) => {
  const users = await User.find({})
  response.json(users.map(u => u.toJSON()))
})

module.exports = usersRouter