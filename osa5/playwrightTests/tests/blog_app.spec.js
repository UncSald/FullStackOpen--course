const { test, expect, beforeEach, describe } = require('@playwright/test')

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
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })
    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByLabel('username').fill('macou')
      await page.getByLabel('password').fill('salakavala')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('log in to application')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
    })
    
    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel('title').fill('First class tests')
      await page.getByLabel('author').fill('Robert C. Martin')
      await page.getByLabel('url').fill('http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.getByText('First class tests Robert C. Martin')).toBeVisible()
    })
  })

  describe('When there are blogs on the list', () => {
    beforeEach(async ({ page }) => {
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel('title').fill('First class tests')
      await page.getByLabel('author').fill('Robert C. Martin')
      await page.getByLabel('url').fill('http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll')
      await page.getByRole('button', { name: 'create' }).click()
    })
    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'show' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
    })
    test('a blog can be deleted by the creator', async ({ page }) => {
      await page.getByRole('button', { name: 'show' }).click()
      await page.getByRole('button', { name: 'delete' }).click()
      page.on('dialog', dialog => dialog.accept())
      await expect(page.getByText('successfully deleted First class tests')).toBeVisible()
      await expect(page.getByText('First class tests Robert C. Martin')).toBeHidden()
    })
    test('the delete button can only be seen by the creator', async ({ page }) => {
      await page.getByRole('button', { name: 'show' }).click()
      await expect(page.getByRole('button', { name: 'delete' })).toBeVisible()
      await page.getByRole('button', { name: 'logout' }).click()
      await expect(page.getByText('log in to application')).toBeVisible()
      await page.getByLabel('username').fill('macou')
      await page.getByLabel('password').fill('salasana')
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByRole('button', { name: 'show' }).click()
      await expect(page.getByRole('button', { name: 'delete' })).toBeHidden()
    })
  })

})
