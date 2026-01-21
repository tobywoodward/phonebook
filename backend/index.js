console.log('STARTING SERVER', new Date().toISOString())

require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const Contact = require('./models/phonebook.js')

app.use(express.json())
app.use(express.static('dist'))
app.use(express.static('public'))

const customFormat = ':method :url :status :res[content-length] - :response-time ms :body'
app.use(morgan(customFormat))
morgan.token('body', (request) => {
        return request.method === 'POST' 
            ? JSON.stringify(request.body)
            : ''
    })

const generateID = () => {
    return String(Math.floor(10000 * Math.random()))
}

// let persons = [
//     { 
//       "id": "1",
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": "2",
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": "3",
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": "4",
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]

app.get('/api/info', (request, response, next) => {
    Contact.find({})
    .then(persons => {
        response.send(`Phonebook has info for ${persons.length} people <br/> ${new Date().toString()}`)
    })
    .catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
    Contact.find({})
    .then(persons => {
        response.json(persons)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Contact.findById(id)
    .then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Contact.findByIdAndDelete(id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    if (!body.name || !body.number) {
         return response.status(400).json({
            error: 'content missing'
        })
    }
    
    const person = new Contact({
        name: body.name,
        number: body.number,
    })
    person.save()
    .then(newPerson => {
        response.json(newPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    const { name, number } = request.body

    Contact.findById(id)
        .then(contact => {
            if (!contact) {
                return response.status(404).end()
            }

            contact.name = name
            contact.number = number

            return contact.save().then((updatedContact) => {
                response.json(updatedContact)
            })
        })

        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message })
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})