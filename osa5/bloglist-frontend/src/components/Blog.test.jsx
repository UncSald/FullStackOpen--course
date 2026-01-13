import { render, screen } from '@testing-library/react'
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