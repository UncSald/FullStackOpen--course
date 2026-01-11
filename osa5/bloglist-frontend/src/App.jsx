import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Togglable from './components/togglable'
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

const LoginForm = ({ username, password, setUsername, setPassword, handleLogin}) => {

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

const NewBlogForm = ({ title, author, url, setTitle, setAuthor, setUrl, handleBlogCreation}) => {
  return (
    <div>
      <form onSubmit={handleBlogCreation}>
        <div>
          <label>
            title
            <input
              type="text"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            author
            <input
              type="text"
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            url
            <input
              type="url"
              value={url}
              onChange={({ target }) => setUrl(target.value)}
            />
          </label>
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

const ShowBlogs = ({ blogs }) => {
  return (
    <div>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
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
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
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

  const handleLogout = async event => {
    event.preventDefault()
    window.localStorage.clear()
  }

  const handleBlogCreation = async event => {
    event.preventDefault()
    try {
      const blog = {
        title: title,
        author: author,
        url: url
      }
      blogFormRef.current.toggleVisibility()
      await blogService.create(blog)
      setNotificationType(false)
      setNotificationMessage(`a new blog ${title} by ${author} added`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    } catch {
        setNotificationType(true)
        setNotificationMessage('blog creation ended with an error')
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
      }
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
            <NewBlogForm
              title={title}
              author={author}
              url={url}
              setTitle={setTitle}
              setAuthor={setAuthor}
              setUrl={setUrl}
              handleBlogCreation={handleBlogCreation}
            />
          </Togglable>
          <ShowBlogs
            blogs={blogs}
          />
        </div>
        )
       }

    </div>
  )}


export default App