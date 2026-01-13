import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogCreation from './BlogCreation'

test('BlogCreation calls callback function with right content', async () => {

  const user = userEvent.setup() 
  const createBlog = vi.fn()

  render(<BlogCreation createBlog={createBlog} />)

  const title = screen.getByLabelText('title')
  const author = screen.getByLabelText('author')
  const url = screen.getByLabelText('url')
  const createButton = screen.getByText('create')

  await user.type(title, 'Canonical string reduction')
  await user.type(author, 'Edsger W. Dijkstra')
  await user.type(url, 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html')
  await user.click(createButton)

  expect(createBlog.mock.calls[0][0]).toStrictEqual({
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html"
  })
})