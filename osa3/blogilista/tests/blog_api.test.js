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
  url: 'www.blogspot.se',
  likes: 10
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

afterAll(() => {
  mongoose.connection.close()
})