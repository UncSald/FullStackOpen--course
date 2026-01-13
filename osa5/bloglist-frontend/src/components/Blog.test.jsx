import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
  title: "Canonical string reduction",
  author: "Edsger W. Dijkstra",
  url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
  likes: 12,
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText('Canonical string reduction Edsger W. Dijkstra')
  expect(element).toBeDefined()
})

test('clicking the show button opens blog info', async () => {
  const blog = {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    user: {
        username: 'macou',
        name:'macou'
    }
  }

  render(
    <Blog blog={blog}/>
  )

  const user = userEvent.setup()
  const button = screen.getByText('show')
  await user.click(button)

  const url = screen.getByText('http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html')
  const likes = screen.getByText('likes 12')
  const username = screen.getByText('macou')

  expect(url, likes, username).toBeDefined()
})

test('clicking the like button twice calls the handler twice', async () => {
  const blog = {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    user: {
        username: 'macou',
        name:'macou'
    }
  }
  
  const mockHandler = vi.fn()

  render(
    <Blog blog={blog} addLike={mockHandler}/>
  )

  const user = userEvent.setup()
  const button = screen.getByText('show')
  await user.click(button)

  const like = screen.getByText('like')
  await user.click(like)
  await user.click(like)


  expect(mockHandler.mock.calls).toHaveLength(2)
})