import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import BlogCreation from './components/BlogCreation'
import blogService from './services/blogs'
import loginService from './services/login'

const Notification = ({ err, message }) => {
  if (message === null) {
    return null
  }
  if(err){
    return (
      <div className="error">
        {message}
      </div>
    )
  }
  return (
    <div className="notification">
      {message}
    </div>
  )
}

const LoginForm = ({ username, password, setUsername, setPassword, handleLogin }) => {

  return (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

const ShowBlogs = ({ blogs, addLike, deleteBlog, loggedIn }) => {
  return (
    <div>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} addLike={addLike} deleteBlog={deleteBlog} loggedIn={loggedIn}/>
      )}
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a, b) => b.likes - a.likes) )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      setNotificationType(false)
      setNotificationMessage(`${username} logged in successfully`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
      setUser(user)
      setUsername('')
      setPassword('')
      blogService.setToken(user.token)
    } catch {
      setNotificationType(true)
      setNotificationMessage('wrong username or password')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }

  const createBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      await blogService.create(blogObject)
      const updatedBlogs = await blogService.getAll()
      setBlogs(updatedBlogs)
      setNotificationType(false)
      setNotificationMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    } catch (error) {
      setNotificationType(true)
      setNotificationMessage(`blog creation ended with an error: ${error}`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }

  const addLike = async (blogObject) => {
    try {
      await blogService.update(blogObject)

      setNotificationType(false)
      setNotificationMessage(`liked ${blogObject.title}`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    } catch (error) {
      setNotificationType(true)
      setNotificationMessage(`liking blog ended with an error: ${error}`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }

  const deleteBlog = async (blogObject) => {
    try {
      await blogService.deleteBlog(blogObject)
      const updatedBlogs = await blogService.getAll()
      setBlogs(updatedBlogs)
      setNotificationType(false)
      setNotificationMessage(`successfully deleted ${blogObject.title}`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    } catch (error) {
      setNotificationType(true)
      setNotificationMessage(`deleting blog ended with an error: ${error}`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async event => {
    event.preventDefault()
    window.localStorage.clear()
    blogService.setToken('')
    setUser(null)
  }

  return (
    <div>
      <Notification err={notificationType} message={notificationMessage}/>
      {!user && (
        <LoginForm
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          handleLogin={handleLogin}
        />
      )}
      {user && (
        <div>
          <h2>blogs</h2>
          <p>
            {user.name} logged in
            <button type="logout" onClick={handleLogout}>logout</button>
          </p>
          <Togglable buttonLabel='create new blog' ref={blogFormRef}>
            <BlogCreation
              createBlog={createBlog}
            />
          </Togglable>
          <ShowBlogs
            blogs={blogs}
            addLike={addLike}
            deleteBlog={deleteBlog}
            loggedIn={user}
          />
        </div>
      )
      }

    </div>
  )}


export default App