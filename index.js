require('dotenv').config()
// important modules
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
// morgan token configuration to add the data being sent with the request incase there is any
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

// Base route of the App
app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

// Route Showing all the Persons in the phonebook
app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then((persons) => {
            response.json(persons)
        })
        .catch((error) => next(error))
})

// Route showing the total number of people in the phonebook with the current date and time
app.get('/info', (request, response, next) => {
    Person.countDocuments({})
        .then((count) => {
            response.json(`Persons has info for ${count} people ${new Date()}`)
        })
        .catch((error) => next(error))
})

// Route to get a single User
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then((person) => {
            response.json(person)
        })
        .catch((error) => next(error))
})

// Route to delete a Person, please refresh the browser before making this request
// will fix the bug
app.delete('/api/persons/:id', (request, response, next) => {
    console.log(request.params.id)
    Person.findByIdAndRemove(request.params.id)
        .then((response) => {
            response.status(204).end()
        })
        .catch((error) => next(error))
})

// Route to add a new person to the database
app.post('/api/persons', (request, response, next) => {
    const body = request.body
    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person
        .save()
        .then((savedPerson) => savedPerson.toJSON())
        .then((savedAndFormattedPerson) => {
            response.json(savedAndFormattedPerson)
        })
        .catch((error) => next(error))
})

// Route to update the number of a user already in the database
app.put('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndUpdate(
        request.params.id,
        { number: request.body.number },
        { new: true, runValidators: true }
    )
        .then((updatedPerson) => {
            response.json(updatedPerson)
        })
        .catch((error) => next(error))
})

// Handling the error of a non-existent route
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// Request error handlers
const errorHandler = (error, request, response) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
}

app.use(errorHandler)

// Port to listen on
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
