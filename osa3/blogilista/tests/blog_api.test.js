const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
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

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

const api = supertest(app)

test('notes are returned as json', async () => {
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

test('when blog is added the number of blogs grows by one', async () => {
  await api
    .post('/api/blogs')
    .send(testBlog)
  
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(3)
})

test('blog with correct data is added', async () => {
  await api
    .post('/api/blogs')
    .send(testBlog)
  
  const response = await api.get('/api/blogs')
  expect(response.body[2].title).toContain("Joku kolmas blogi")
})

test('likes defaults to 0 if no value is given', async () => {
  await api
    .post('/api/blogs')
    .send(testBlog)
  
  const response = await api.get('/api/blogs')
  expect(response.body[2].likes).toBe(0)
})

test('blog without title or url is not added and status 400 is returned', async () => {
  await api
    .post('/api/blogs')
    .send({
      author: "kirjoittelija",
      likes: 10
    })
    .expect(400)
  
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(2)
})

test('blog can be deleted, number decreases by one', async () => {
  let response = await api.get('/api/blogs')

  await api
    .delete(`/api/blogs/${response.body[0].id}`)
    .expect(204)
  
    
  response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(1)
})

test('blogs can be modified', async () => {
  let response = await api.get('/api/blogs')

  await api
    .put(`/api/blogs/${response.body[0].id}`)
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