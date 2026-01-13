import { useState } from 'react'

const Blog = ({ blog, addLike, deleteBlog, loggedIn }) => {
  const [visibility, setVisibility] = useState(false)
  let status = false

  console.log(blog.user.id, loggedIn)

  if (blog.user.username === loggedIn.username) {
    status = true
  }

  const toggleVisibility = () => {
    setVisibility(!visibility)
  }

  const likeBlog = () => {
    const newBlog = blog
    newBlog.likes = newBlog.likes+1
    addLike(newBlog)
  }

  const remove = () => {
    window.confirm(`remove ${blog.title} by ${blog.user.name}`)
    deleteBlog(blog)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const deleteStyle = {
    backgroundColor: 'red',
    borderRadius: '8px',
  }

  if (visibility) {
    return (
      <li className='blog' style={blogStyle}>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>hide</button>
        <div>
          <a href={blog.url}>{blog.url}</a>
        </div>
        <div>
          likes {blog.likes}
          <button onClick={likeBlog}>like</button>
        </div>
        <div>{blog.user.name}</div>

        {status && (<div>
          <button style={deleteStyle} onClick={remove}>delete</button>
        </div>)}
      </li>
    )
  }

  return (
    <li className='blog' style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={toggleVisibility}>show</button>
    </li>
  )
}

export default Blog