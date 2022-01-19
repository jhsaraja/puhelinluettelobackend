const express = require('express')
var morgan = require('morgan')

// New token to morgan to get also content of the request
morgan.token('data', function(req) {
  return JSON.stringify(req.body)
});

const app = express()

app.use(express.json())

/* 
morgan with tiny logs to console: POST /api/persons/ 200 52 - 4.381 ms 
(:method :url :status :res[content-length] - :response-time ms)
*/
//app.use(morgan('tiny'))  
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [  
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  const number = persons.length
  const date = new Date()
  res.send('<p>Phonebook has info for ' + number + ' people</p><p>' + date +'</p>')
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id) 
  console.log(id)
  const person = persons.find(person => person.id === id)
  console.log(person)

  if (person) {    
    response.json(person)  
  } else {    
    response.status(404).end()  
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

/*
  Method returns a random integer between min and max values. 
  The returned value is not lower than min (or the next integer greater than min if min isn't an integer) 
  and is less than (but not equal to) max. 
*/
const generateId = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); 
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log(request.body)

  if (!body) {
    return response.status(400).json({ 
      error: 'body missing' 
    })
  }

  if (!body.name) {
    return response.status(400).json({ 
      error: 'Name missing' 
    })
  }

  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({ 
      error: 'Name must be unique' 
    })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'Number missing' 
    })
  }

  var id
  var i = 0;

  do {
    id = generateId(10,100000)
    console.log("id " + id)
    i++
  }
  while ((persons.find(person => person.id === id)) && (i < 10)); 

  if (i === 10) {
    return response.status(500).json({ 
      error: 'Failed to get id' 
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: id,
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})