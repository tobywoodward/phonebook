const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as arg')
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://tobywoodward02_db_user:${password}@cluster0.cxdon5i.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

const contactSchema = new mongoose.Schema({
    name : String,
    number : String,
})

const Contact = mongoose.model('Contact', contactSchema)

if (process.argv.length === 5){
    const contact = new Contact({
        name: process.argv[3],
        number: process.argv[4],
    })

    contact.save().then(result => {
        console.log('contact saved!')
        mongoose.connection.close()
    })
} else if (process.argv.length === 3){
    Contact.find({}).then(result => {
        result.forEach(contact => {
            console.log(contact)
        })
        mongoose.connection.close()
    })
}

