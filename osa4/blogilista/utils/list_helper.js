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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
