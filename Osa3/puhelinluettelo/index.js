require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const Person = require('./models/person')

morgan.token('body', function getBody (req) {
    return JSON.stringify(req.body)
})

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


app.get('/api/people', (request, response, next) => {
    Person.find({}).then(people => {
        response.json(people)
    })
    .catch(error => next(error))
})

// app.get('/info', (request, response) => {
//     response.send(`<div>
//                         Phonebook has info for ${people.length} people
//                     </div>
//                     <div>
//                         ${Date()}
//                     </div>`)
// })

app.get('/api/people/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
    .catch(error => next(error))
})

app.delete('/api/people/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id).then(person => {
        response.status(204).end()
    })

    .catch(error=>next(error))
})

app.post('/api/people', (request, response, next) => {
    const body = request.body

    const person = new Person ({
        name: body.name,
        number: body.number,
    })

    person.save().then(result => {
        console.log(`Added ${person.name} number ${person.number} to phonebook`)
        response.json(result)
    })
    .catch(error => next(error))

})

app.put('/api/people/:id', (request, response, next) => {
    const { name, number } = request.body

    Person.findById(request.params.id)
        .then(person => {
            if(!person) {
                return response.status(404).end()
            }

            person.name = name
            person.number = number

            return person.save().then(updatedPerson => {
                    response.json(updatedPerson)
            })
        })
        .catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})