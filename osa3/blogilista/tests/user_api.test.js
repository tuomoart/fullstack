const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

const testUser={
  username: "Testikayttajanimi",
  name: "Testikayttaja",
  password: "tosisalainen"
}


describe('Creating a user', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })

  test('succeeds with valid username', async () => {
    await api
      .post('/api/users')
      .send(testUser)
    
    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(1)
    expect(response.body[0].name).toContain(testUser.name)
  })

  test('stops and returns correct error with too short username', async () => {
    const invalidUser = {
      username: "aa",
      name: testUser.name,
      password: testUser.password
    }
    
    let response = await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400)
    
    expect(response.body.error).toContain('invalid username')
    
    response = await api.get('/api/users')
    expect(response.body).toHaveLength(0)
    
  })

  test('stops and returns correct error with no username given', async () => {
    const invalidUser = {
      name: testUser.name,
      password: testUser.password
    }
    
    let response = await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400)
    
    expect(response.body.error).toContain('invalid username')
    
    response = await api.get('/api/users')
    expect(response.body).toHaveLength(0)
    
  })

  test('stops and returns correct error with too short password', async () => {
    const invalidUser = {
      username: testUser.username,
      name: testUser.name,
      password: 'aa'
    }
    
    let response = await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400)
    
    expect(response.body.error).toContain('invalid password')
    
    response = await api.get('/api/users')
    expect(response.body).toHaveLength(0)
    
  })

  test('stops and returns correct error with no password given', async () => {
    const invalidUser = {
      username: testUser.username,
      name: testUser.name
    }
    
    let response = await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400)
    
    expect(response.body.error).toContain('invalid password')
    
    response = await api.get('/api/users')
    expect(response.body).toHaveLength(0)
    
  })
})

afterAll(() => {
  mongoose.connection.close()
})