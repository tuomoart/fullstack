const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const loginRouter = require('../controllers/login')
const Blog = require('../models/blog')
const User = require('../models/user')
const initialBlogs = [
  {
    title: 'Blogikirjoitus',
    author: 'Matti Luukkainen',
    url: 'www.wikipedia.com',
    likes: 313
  },
  {
    title: 'Joku toinen blogi',
    author: 'Tuntematon',
    url: 'www.blogspot.fi',
    likes: 0
  }
]

const testBlog = {
  title: 'Joku kolmas blogi',
  author: 'Tuntematon',
  url: 'www.blogspot.se'
}

const testUser = {
  username: 'test',
  name: 'test',
  password: 'test'
}

let token = null

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()

  await User.deleteMany({})
  await api.post('/api/users').send(testUser)

  const result = await api.post('/api/login').send(testUser)

  token = result.body.token

})

const api = supertest(app)

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('correct amount of blogs is returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(2)
})

test('id is defined as id', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})

test('cannot add blogs without a token', async () => {
  await api
    .post('/api/blogs')
    .send(testBlog)
    .expect(401)
})

test('when blog is added the number of blogs grows by one', async () => {
  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(testBlog)
    
  
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(3)
})

test('blog with correct data is added', async () => {
  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(testBlog)
  
  const response = await api.get('/api/blogs')
  expect(response.body[2].title).toContain("Joku kolmas blogi")
})

test('likes defaults to 0 if no value is given', async () => {
  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(testBlog)
  
  const response = await api.get('/api/blogs')
  expect(response.body[2].likes).toBe(0)
})

test('blog without title or url is not added and status 400 is returned', async () => {
  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send({
      author: "kirjoittelija",
      likes: 10
    })
    .expect(400)
  
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(2)
})

test('blog can be deleted, number decreases by one', async () => {
  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(testBlog)

  let response = await api.get('/api/blogs')

  await api
    .delete(`/api/blogs/${response.body[2].id}`)
    .set('Authorization', `bearer ${token}`)
    .expect(204)
  
    
  response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(2)
})

test('blogs can be modified', async () => {
  let response = await api.get('/api/blogs')

  await api
    .put(`/api/blogs/${response.body[0].id}`)
    .set('Authorization', `bearer ${token}`)
    .send({
      title: initialBlogs[0].title,
      author: initialBlogs[0].author,
      url: initialBlogs[0].url,
      likes: 100000
    })
  
  response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(2)

  expect(response.body[0].likes).toBe(100000)
})

afterAll(() => {
  mongoose.connection.close()
})