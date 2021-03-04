const lodash = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return(blogs.map((blog) => blog.likes)).reduce(((acc, cur) => acc + cur),0)
}

const favoriteBlog = (blogs) => {
  return(
    blogs.reduce((acc, cur) => {
      if (cur.likes > acc.likes) {
        return cur
      }

      return acc
    })
  )
}

const mostBlogs = (blogs) => {
  const authors = lodash.countBy(blogs, (blog => blog.author))

  let formattedAuthors = []

  for (const [key, value] of Object.entries(authors)) {
    formattedAuthors.push({
      author: key,
      blogs: value
    })
  }

  return formattedAuthors.reduce(((acc, cur) => {
    if (cur.blogs > acc.blogs) {
      return cur
    }

    return acc
  }))
}

const mostLikes = (blogs) => {
  const authors = lodash.groupBy(blogs, (blog => blog.author))

  let formattedAuthors = []

  for (const [key, value] of Object.entries(authors)) {
    const likes = value.map(blog => blog.likes).reduce((acc, cur) => acc + cur)

    formattedAuthors.push({
      author: key,
      likes: likes
    })
  }

  return formattedAuthors.reduce(((acc, cur) => {
    if (cur.likes > acc.likes) {
      return cur
    }

    return acc
  }))
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}