/* 
Add a new person: node mongo.js Salasana "Test Tester" 123456 
*/
const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://fullstackopen:${password}@cluster0.hqko0.mongodb.net/persons-app?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

// Jos määrittelee modelin nimeksi Person, muuttaa Mongoose sen monikkomuotoon people, jota se käyttää vastaavan kokoelman nimenä.
const Person = mongoose.model('Person', personSchema)

if (process.argv.length>3) {
  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  Person.find({}).then(result => {
    console.log("phonebook:")
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}



