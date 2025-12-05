const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const api = supertest(app)



beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(helper.initialBlogs[1])
    await blogObject.save()
})

test('correct amount of blogs are returned as json', async () => {
    const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, 2)
    })

test('identifying field is id', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body

    assert.ok(blogs[0].id)
    assert.ok(blogs[1].id)
})

test('blog can be added', async () => {
    const newBlog = {
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 12,
        }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const blogs = response.body

    assert.strictEqual(blogs.length, 3)
})

test('defaults to 0 if no likes are given', async () => {
    const newBlog = {
            title: "First class tests",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
            likes: undefined,
        }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const blogs = response.body
    const addedBlog = blogs.find(blog => blog.title === "First class tests")
    assert.strictEqual(addedBlog.likes, 0)
})

test('blog without title or url returns Bad Request', async () => {
    const newBlog = {
            title: "TDD harms architecture",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
            likes: 0,
        }
    
    await api
        .post('/api/blogs')
        .send({ author: newBlog.author, url: newBlog.url, likes: newBlog.likes })
        .expect(400)

    await api
        .post('/api/blogs')
        .send({ title: newBlog.title, author: newBlog.author, likes: newBlog.likes})
        .expect(400)
    
    await api
        .post('/api/blogs')
        .send({ author: newBlog.author, likes: newBlog.likes})
        .expect(400)
})


after(async () => {
  await mongoose.connection.close()
})