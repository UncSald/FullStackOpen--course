const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, showBlogInfo } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Marc Alingue',
        username: 'macou',
        password: 'salasana'
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {

    const locator = page.getByText('log in to application')
    await expect(locator).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
  })

  describe('Login', () => {

    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })
    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'macou', 'salakavala')
      await expect(page.getByText('log in to application')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })
    
    test('a new blog can be created', async ({ page }) => {
      await createBlog(page,
        'First class tests',
        'Robert C. Martin',
        'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll')

      await expect(page.getByText('First class tests Robert C. Martin')).toBeVisible()
    })
  })

  describe('When there is a blog on the list', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await createBlog(page,
        'First class tests',
        'Robert C. Martin',
        'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll')
    })
    test('a blog can be liked', async ({ page }) => {
      await showBlogInfo(page, 'First class tests', 'Robert C. Martin')
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
    })
    test('a blog can be deleted by the creator', async ({ page }) => {
      await showBlogInfo(page, 'First class tests', 'Robert C. Martin')
      await page.getByRole('button', { name: 'delete' }).click()
      page.on('dialog', dialog => dialog.accept())
      await expect(page.getByText('successfully deleted First class tests')).toBeVisible()
      await expect(page.getByText('First class tests Robert C. Martin')).toBeHidden()
    })
    test('the delete button can only be seen by the creator', async ({ page }) => {
      await showBlogInfo(page, 'First class tests', 'Robert C. Martin')
      await expect(page.getByRole('button', { name: 'delete' })).toBeVisible()
      await page.getByRole('button', { name: 'logout' }).click()
      await expect(page.getByText('log in to application')).toBeVisible()
      await loginWith(page, 'macou', 'salasana')
      await expect(page.getByText('Marc Alingue logged in')).toBeVisible()
      await showBlogInfo(page, 'First class tests', 'Robert C. Martin')
      await expect(page.getByRole('button', { name: 'delete' })).toBeHidden()
    })

    describe('when there are multiple blogs on the list', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page,
          'Canonical string reduction',
          'Edsger W. Dijkstra',
          'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html')
      })
      test('blogs are ordered with the most liked blog first', async ({ page }) => {
        let blogsList = page.locator('div > li')
        let expectedOrder = ['First class tests Robert C. Martinshow',
          'Canonical string reduction Edsger W. Dijkstrashow']
        await expect(blogsList).toHaveText(expectedOrder)
        await showBlogInfo(page, 'Canonical string reduction', 'Edsger W. Dijkstra')
        const likeButton = page.getByRole('button', { name: 'like' })
        await likeButton.click()
        await page.goto('http://localhost:5173')
        blogsList = page.locator('div > li')
        expectedOrder = ['Canonical string reduction Edsger W. Dijkstrashow',
          'First class tests Robert C. Martinshow']
        await expect(blogsList).toHaveText(expectedOrder)
      })
    })
  })



})
