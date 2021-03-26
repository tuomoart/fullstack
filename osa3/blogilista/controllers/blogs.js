const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {

    const blogs = await Blog.find({})

    response.json(blogs)
})
  
blogsRouter.post('/', async (request, response) => {

    if (request.body.title === undefined || request.body.url === undefined) {
        response.status(400).end()
        return
    }

    const userId = (await User.find({}))[0]._id
    console.log('id: ', userId)

    const newBlog = {
        title: request.body.title,
        author: request.body.author,
        url: request.body.url,
        likes: request.body.likes === undefined ? 0 : request.body.likes,
        user: userId
    }
    
    const blog = new Blog(newBlog)

    const result = await blog.save()

    response.status(201).json(result)
    
})

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id)

    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new:true })

    response.json(updatedBlog)
})

module.exports = blogsRouter