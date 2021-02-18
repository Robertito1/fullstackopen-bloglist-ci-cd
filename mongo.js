const mongoose = require('mongoose')
require('dotenv').config()

const password = process.env.password

if (process.argv.length < 3 || process.argv[2] !== password) {
    console.log(
        'Please provide the correct password as an argument: node mongo.js <password>'
    )
    process.exit(1)
}
const url = `mongodb+srv://Robertito1:${password}@cluster0.rnhzs.mongodb.net/test?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: Number,
})
const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    Person.find({}).then((result) => {
        console.log('phonebook:')
        result.forEach((note) => {
            console.log(note.name, note.number)
        })
        mongoose.connection.close()
    })
} else if (process.argv.length === 4) {
    console.log('Please provide the <name> <phoneNumber> argument correctly')
    mongoose.connection.close()
} else {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })

    person.save().then((result) => {
        console.log('person saved!')
        mongoose.connection.close()
    })
}
