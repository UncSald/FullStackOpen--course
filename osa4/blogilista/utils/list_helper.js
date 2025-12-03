const lodash = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    const favourite = blogs.reduce((max, blog) => (blog.likes > max.likes ? blog : max), blogs[0])
    return favourite
}

const mostBlogs = (blogs) => {
    const authors = {}
    var max = 0
    var maxAuth = ''
    lodash.forEach(blogs, function(blog) {
        authors[blog.author] = (authors[blog.author] || 0) + 1
        if ( authors[blog.author] > max ) {
            max = authors[blog.author]
            maxAuth = blog.author
        }
    }, {})
    return { author: maxAuth, blogs: max }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}
